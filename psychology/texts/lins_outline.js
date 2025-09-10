import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { StoreVariable } from '../../../lo_components/components.js';

export default function Lins_Outline({onScreen}) {
   const psych_email_to_babysitter = useComponentSelector("psych_sba.email_to_babysitter", s => s?.value ?? '');

   return (
            <div className="contentDiv">
                <ol>        
                    <li><p><b>Why Annie's Friend Shouldn't Give Up On Setting Bedtime.</b></p>
                        <p></p>{psych_email_to_babysitter}<br /><br /></li>
                    <li><p><b>What psychological technique we are recommending (positive reinforcement).</b></p>
                        <p>Using positive reinforcement is an effective way to encourage a child to go to bed at bedtime.<br /><br /></p>
                    </li>
                    <li><p><b>Explanation of what positive reinforcement is and why it works.</b></p>
                        <p>Positive reinforcement involves rewarding the child when they perform the desired behavior, 
                           which increases the likelihood that they will repeat it in the future.<br /><br /></p>
                        <p>It helps establish a clear connection between the desired behavior (going to bed on time)
                           and the rewarding outcome. This approach encourages the child to view bedtime as a positive
                           experience rather than something to resist, fostering motivation and cooperation over time.
                           By focusing on rewarding good behavior rather than punishing noncompliance, the child
                           is more likely to feel empowered and develop healthy habits.<br /><br /></p>
                    </li>
                    <li><p><b>List of positive reinforcement techniques she can try to get the kid to bed at bedtime.</b></p>
                        <ol>
                            <li>Sing a Lullaby: Offer to sing their favorite lullaby if they go to bed without delay.</li>
                            <li>Golden Star Award: Create a "Golden Star" award for being a good bedtime hero.</li>
                            <li>Pajama Party Theme: Let them pick fun pajamas as part of bedtime preparation.</li>
                            <li>Countdown Timer: Use a timer with a cheerful tune to make bedtime feel exciting.</li>
                            <li>Bedtime Snack: Reward with a small, healthy snack like fruit or yogurt before bed.<br /><br /></li>
                        </ol>
                    </li>
                    <li><p><b>Final paragraph -- wish her luck!</b></p>
                         <p>With luck, this will help!</p>
                    </li>
                </ol>
            </div>
  );
}