import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { StoreVariable } from '../../../lo_components/components.js';

export default function MyOutline({onScreen}) {
   const psych_email_to_babysitter = useComponentSelector("psych_sba.email_to_babysitter", s => s?.value ?? '');

   return (
            <div className="contentDiv">
              <ol>
                  <li><p><b>Why Annie's Friend Shouldn't Give Up On Setting Bedtime.</b></p>
                      <StoreVariable id="psych_sba.email_to_babysitter2" /><br /><br />
                  </li>
                  <li><p><b>What psychological technique we are recommending (positive reinforcement).</b></p>                    
                      <StoreVariable id="psych_sba.recommendation_for_positive_reinforcement" /><br /><br />
                  </li>
                  <li><p><b>Explanation of what positive reinforcement is and why it works.</b></p>
                      <StoreVariable id="psych_sba.explanation_of_positive_reinforcement" /><br /><br />
                  </li>
                  <li><b>List of positive reinforcement techniques she can try to get the kid to bed at bedtime.</b>
                      <ol>
                          <li><StoreVariable id="psych_sba.example_positive_reinforcement_1" /></li>
                          <li><StoreVariable id="psych_sba.example_positive_reinforcement_2" /></li>
                          <li><StoreVariable id="psych_sba.example_positive_reinforcement_3" /></li>
                          <li><StoreVariable id="psych_sba.example_positive_reinforcement_4" /></li>
                          <li><StoreVariable id="psych_sba.example_positive_reinforcement_5" /><br /><br /></li>
                      </ol>
                 </li>
                 <li><p><b>Final paragraph -- wish her luck!</b></p>
                     <p><StoreVariable id="psych_sba.final_paragraph" /></p>
                 </li>
              </ol>
         </div>
  );
}