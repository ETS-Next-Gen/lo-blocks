import { React } from 'react';
import { Element, ConditionalListElement} from '../../../lo_components/components.js';

export default function ChoiceOfStrategies() {
  return (
        <>
          <div className="contentBox"><br />
            <p>You decided the following strategies might not be appropriate for your babysitter's six-year-old:</p><b>
            <ul>
                <ConditionalListElement>
                    psych_sba.age_appropriacy.flexible_bedtime_routines
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.age_appropriacy.positive_reinforcement
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.age_appropriacy.gradual_fading
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.age_appropriacy.empathy_and_emotional_support
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.age_appropriacy.natural_consequences_with_limits
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.age_appropriacy.environmental_adjustments
                </ConditionalListElement>
                <ConditionalListElement>
                    psych_sba.age_appropriacy.collaborative_problem_solving
                </ConditionalListElement>
            </ul></b>
            <p>This is your explanation:<br /><br />
               <i><Element>psych_sba.age_appropriacy.explanation</Element></i></p><br /><br />
         </div>
     </>
    );
}
