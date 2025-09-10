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
                                  <p>To encourage a child to go to bed at bedtime, it's a great idea to use positive reinforcement. </p><br /><br />
                              </li>
                              <li><p><b>Explanation of what positive reinforcement is and why it works.</b></p>
                                  <p>Instead of focusing on what the child is doing wrong, positive reinforcement highlights
                                     and rewards good behavior, making it more likely to happen again in the future.<br /><br /></p>
                                  <p>Positive reinforcement is effective because it strengthens the behavior you want
                                     to see. Instead of focusing on what the child might do "wrong," this method encourages
                                     compliance and cooperation by creating positive associations with bedtime. Children are
                                     more likely to repeat behaviors that earn them rewards and praise, and they feel more
                                     motivated when they know their actions are recognized in a positive way.</p><br /><br />
                               </li>
                              <li><b>List of positive reinforcement techniques she can try to get the kid to bed at bedtime.</b><br /><br />
                                  <ol>
                                        <li>Sticker Chart: Reward each on-time bedtime with a sticker to track progress visually.</li>
                                        <li>Bedtime Story: Offer a favorite bedtime story as a reward for getting into bed on time.</li>
                                        <li>Special Night Light: Let them choose a fun night light or glowing toy for their room.</li>
                                        <li>Cozy Blanket: Reward with a special cozy blanket or plush pillow for their efforts.<br /><br /></li>
                                   </ol>
                              </li>
                              <li><p><b>Final paragraph -- wish her luck!</b></p>
                                  <p>I hope with this advice, your next babysitting gig goes much better.</p>
                              </li>
                            </ol>
                          </div>
  );
}