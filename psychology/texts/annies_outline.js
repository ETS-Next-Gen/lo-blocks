import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { StoreVariable } from '../../../lo_components/components.js';

export default function Annies_Outline({onScreen}) {
   const psych_email_to_babysitter = useComponentSelector("psych_sba.email_to_babysitter", s => s?.value ?? '');

   return (
                          <div className="contentDiv">    
                            <ol>
                              <li><p><b>Why Annie's Friend Shouldn't Give Up On Setting Bedtime.</b></p>
                                  <p></p>{psych_email_to_babysitter}<br /><br /></li>
                              <li><p><b>What psychological technique we are recommending (positive reinforcement).</b></p>
                                  <p>Positive reinforcement is a powerful strategy to encourage desired behaviors in children, such as going to bed at bedtime.<br /><br /></p>
                              </li>
                              <li><p><b>Explanation of what positive reinforcement is and why it works.</b><br /><br /></p>
                                  <p>Positive reinforcement involves providing a desirable reward or incentive after the desired behavior occurs,  
                                     increasing the likelihood that the behavior will be repeated.<br /><br /></p>
                                  <p>It is effective because it motivates behavior through encouragement rather than conflict. Children are more 
                                     likely to cooperate when they know their efforts will be recognized and appreciated. Additionally, it helps
                                     build their sense of accomplishment and strengthens their ability to follow routines, which is crucial for
                                     their development. By using positive reinforcement, you create a routine that feels rewarding and enjoyable
                                     for the child, making it easier for them to develop healthy habits over time.<br /><br /></p>
                              </li>
                              <li><b>List of positive reinforcement techniques she can try to get the kid to bed at bedtime.</b>
                                  <ol>
                                      <li>Bedtime Buddy: Allow them to sleep with their favorite stuffed animal or toy.</li>
                                      <li>Favorite Song: Play one favorite soothing song before lights out as a reward.</li>
                                      <li>Superhero Role: Call them a "bedtime superhero" for helping achieve their goals.</li>
                                      <li>Magical Bedtime Passport: Stamp their bedtime passport for every on-time bed night.</li>
                                      <li>Calming Scents: Reward with a choice of calming scents like lavender-scented mist for their room<br />.</li>
                                  </ol>
                              </li>
                              <li><p><b>Final paragraph -- wish her luck!</b></p>
                                  <p>I hope these techniques make your net babysitting experience a lot easier!</p>
                              </li>
                            </ol>
                          </div>
  );
}