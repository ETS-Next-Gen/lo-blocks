// src/lib/util/prerequisites.js
/**
 * This is a set of helpers for expressing whether we are ready to take
 * some action, such as a student advancing to the next set of exercises.
 * In most cases, this might be simply checking whether some set of exercises
 * is finished, but there may be more complex dependencies as well.
 * 
 * We are still evaluating the right format for this, but this version should
 * be sufficient for the current SBAs. We are less than comfortable with the
 * level of regexps used and the code complexity, and we need a documented,
 * human-friendly format to use in the courseware. This is the start of a
 * work-in-progress
 */
import { getValueById } from '@/lib/blocks';
import * as state from '@/lib/state';

const IDENTIFIER_REGEX = '[A-Za-z0-9_][A-Za-z0-9_-]*';
const STATUS_REQUIREMENT = new RegExp(`^(${IDENTIFIER_REGEX})\\s+(${IDENTIFIER_REGEX})$`);
const COMPARISON_REQUIREMENT = new RegExp(
  `^(${IDENTIFIER_REGEX})\\s+(${IDENTIFIER_REGEX})\\s*(>=|<=|>|<|=)\\s*(\\d+(?:\\.\\d+)?)$`
);

function parseSingleRequirement(requirement) {
  if (typeof requirement !== 'string') return null;
  const trimmed = requirement.trim();
  if (!trimmed) return null;

  const comparisonMatch = trimmed.match(COMPARISON_REQUIREMENT);
  if (comparisonMatch) {
    return {
      id: comparisonMatch[1],
      field: comparisonMatch[2],
      op: comparisonMatch[3],
      value: parseFloat(comparisonMatch[4])
    };
  }

  const statusMatch = trimmed.match(STATUS_REQUIREMENT);
  if (statusMatch) {
    return { id: statusMatch[1], status: statusMatch[2] };
  }

  const idMatch = trimmed.match(new RegExp(`^${IDENTIFIER_REGEX}$`));
  if (idMatch) {
    return { id: idMatch[0] };
  }

  console.warn(`[requirements] Unable to parse requirement expression "${requirement}"`);
  return null;
}

export function parseRequirements(dependsOn) {
  if (!dependsOn) return [];

  if (Array.isArray(dependsOn)) {
    return dependsOn
      .map((req) => (typeof req === 'string' ? parseSingleRequirement(req) : req))
      .filter(Boolean);
  }

  if (typeof dependsOn !== 'string') {
    console.warn('[requirements] dependsOn must be a string or array');
    return [];
  }

  return dependsOn
    .split(',')
    .map((req) => parseSingleRequirement(req))
    .filter(Boolean);
}

function checkRequirementValue(requirement, value) {
  // TODO the requirement might include an operation like `score>0.8`
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'boolean') return value;
  if (value instanceof Date) return true;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return Boolean(value);
}

function requirementValueFromGrader(props, id) {
  try {
    const correctField = state.componentFieldByName(props, id, 'correct');
    return state.selectFromStore(correctField, {
      id,
      fallback: 0,
      selector: (s) => s?.score ?? s
    });
  } catch (error) {
    console.warn(`[Chat] Unable to read grader correctness for ${id}`, error);
    return undefined;
  }
}

export async function isRequirementSatisfied(props, requirement) {
  if (!requirement?.id) return false;
  try {
    const blockValue = await getValueById(props, requirement.id);
    if (blockValue !== undefined) {
      return checkRequirementValue(requirement, blockValue);
    }
  } catch (error) {
    console.warn(`[Chat] getValueById failed for wait requirement ${requirement.id}`, error);
  }
  const blockScore = requirementValueFromGrader(props, requirement.id);
  return checkRequirementValue(requirement, blockScore);
}

/**
 * Check if all wait requirements are satisfied
 * @param {Object} props - Component props for context
 * @param {Array} requirements - Array of requirement objects with {id}
 * @returns {Promise<boolean>} - True if all requirements are satisfied
 */
export async function checkRequirements(props, requirements) {
  if (!requirements?.length) return true;
  try {
    const results = await Promise.all(
      requirements.map(async (requirement) => {
        try {
          return await isRequirementSatisfied(props, requirement);
        } catch (error) {
          console.warn(`[Chat] Failed to resolve wait requirement ${requirement.id}`, error);
          return false;
        }
      })
    );
    return results.every(Boolean);
  } catch (error) {
    console.warn('[Chat] Failed to resolve wait requirements', error);
    return false;
  }
}
