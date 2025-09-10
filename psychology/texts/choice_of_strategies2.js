import { React } from 'react';
import { Element, ConditionalListElement} from '../../../lo_components/components.js';

export default function ChoiceOfStrategies2() {
  return (
          <div className="contentBox"><br />
            <p>You decided the following strategies might be feasible for the babysitter to implement:</p><b>
            <ul>
                <ConditionalListElement>
                    psych_sba.feasibility.bedtime_routines
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.feasibility.positive_reinforcement
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.feasibility.gradual_fading
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.feasibility.empathy_and_emotional_support
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.feasibility.natural_consequences_with_limits
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.feasibility.environmental_adjustments
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.feasibility.collaborative_problem_solving
                </ConditionalListElement>
            </ul></b>
            <p>This is your explanation:<br /><br />
               <i><Element>psych_sba.feasibility.explanation</Element></i></p><br /><br />
          </div>
    );
}
