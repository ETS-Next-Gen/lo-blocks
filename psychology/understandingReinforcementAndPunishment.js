import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { LO_SpeechButton, Scene, SceneElement, ConversationMove, StoreVariable } from '../../lo_components/components.js';

export function UnderstandingReinforcementAndPunishment({onScreen}) {
  return (
    <Scene id="psych_sba.reinforce_punish_intro" onScreen={onScreen} title="Understanding Reinforcement and Punishment">
             <div className="floatLeftNarrowPlus">
                  <ConversationMove 
                     id="psych_sba.reinforce_punish_intro.move.1" 
                     onScreen={onScreen}
                     showOnScreens={[1,2,3]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                     <p>Don't you think this is where we can bring in the things we're studying in Psych class?
                        Here are my lecture notes... I've got a definition of "reinforcement." It's from our textbook.</p>
                 </ConversationMove>
                 <ConversationMove 
                     id="psych_sba.reinforce_punish_intro.move.2" 
                     onScreen={onScreen}
                     showOnScreens={[2,3]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                     <p>I'm not quite sure I get this. In the class, we learned about both <b>positive</b> and <b>negative </b>
                        reinforcement. Isn't that basically just reward vs. punishment?</p>
                 </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish_intro.move.3" 
                     onScreen={onScreen}
                     showOnScreens={[3]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                     <p>Uh, no ... punishment isn't the same thing as negative reinforcement. Let me look up my notes.</p>
                 </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.15.move.1"
                     onScreen={onScreen}
                     showOnScreens={[4,5,6,7,8]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                        <p>Here we go. Here's  how my notes say punishment is defined.</p>
                 </ConversationMove>
                 <ConversationMove 
                    id="psych_sba.scene.15.move.2" 
                    onScreen={onScreen}
                    showOnScreens={[5,6,7]}
                    name="Annie"
                    imgURL="/TeamMemberTwo.jpg"
                    maxHeight="40px"
                    screenPercent="100%"
                    className="conversationDark"
                    pictureClass="imageWindow">
                         <p>Looking at the examples confuses me a little. It seems to include unintentional consequences!
                            I mean, in the second example, Amelia's teacher wasn't trying to punish her.</p>
                 </ConversationMove>
                 <ConversationMove 
                      id="psych_sba.scene.15.move.3" 
                      onScreen={onScreen}
                      showOnScreens={[6,7]}
                      name="Lin"
                      imgURL="/TeamMemberThree.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindowVar2">
                         <p><b>Reinforcement</b> and <b>punishment</b> are being used as technical terms.&nbsp;
                            <u>Anything that makes a preceding behavior more likely is a reinforcement</u>. <u>Anything
                            that makes it less likely is a punishment</u>.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.15.move.4" 
                     onScreen={onScreen}
                     showOnScreens={[7]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                         <p>I'm still a bit confused. Why are the examples with Ella and Nathan classified as punishment instead of reinforcement?</p>
                  </ConversationMove>
                 <ConversationMove 
                    id="psych_sba.scene.15.move.5" 
                    onScreen={onScreen}
                    showOnScreens={[9]}
                    name="Annie"
                    imgURL="/TeamMemberTwo.jpg"
                    maxHeight="40px"
                    screenPercent="100%"
                    className="conversationDark"
                    pictureClass="imageWindow">
                         <p>This is tricky: "following classroom rules" is just "not breaking them" and 
                            "withdrawing from group activities" is just "not participating in them". </p>
                         <p>So, what behavior is really being changed?  
                            Being sent to the principal's office is caused by rule-breaking, not rule
                            following, and you can't be laughed at unless you're participating in 
                            group activities!  </p>
                         <p>Since the behaviors of rule-breaking and participating are decreasing,
                            these scenarios are examples of punishment.</p>
                 </ConversationMove>
             </div>
             <SceneElement onScreen={onScreen} showOnScreens={[1, 2, 3]}>
                 <h3>&nbsp;</h3>
                 <div className="narrowFloatRightContentWindow">
                                 <p className="cursive"><b>Lecture Notes:</b></p><br />
                                 <p className="cursive"><b>Definition of Reinforcement:</b> Reinforcement is any event that <b>strengthens</b> (increases the frequency of) a preceding response.</p><br />
                                 <p className="cursive">Examples:</p> 
                                 <ul className="cursive">
                                         <li>Charlotte shares her crayons with classmates because it earns her positive attention from peers.</li>
                                         <li>Sofia screams in the grocery store until her parent gives her candy.</li>
                                         <li>Benjamin plays nicely with others because he gets extra playtime when he shares.</li>
                                         <li>Daniel whines loudly whenever his caregiver focuses on another child.</li>
                                </ul>
                     <LO_SpeechButton 
                          id="psych_sba.lecture1" 
                          label="Read Aloud"
                          text="Lecture notes. Definition of reinforcement: Reinforcement is any event that strengthens (increases the frequency of)
                                a preceding response. Examples: Charlotte shares her crayons with classmates because it earns her positive attention
                                from peers. Sofia screams in the grocery store until her parent gives her candy. Benjamin plays nicely with others 
                                because he gets extra playtime when he shares. Daniel whines loudly whenever his caregiver focuses on 
                                another child."
                     />
                 </div>
            </SceneElement>
            <SceneElement onScreen={onScreen} showOnScreens={[4, 5, 6, 7, 8, 9]}>
                <h3>&nbsp;</h3>
                <div className="narrowFloatRightContentWindow">
                      <p className="cursive"><b>Lecture Notes:</b></p><br />
                      <p className="cursive"><b>Definition of Punishment:</b> Punishment is any consequence that <b>decreases</b> the frequency of a preceding behavior.</p><br />
                      <p className="cursive">Examples:</p> 
                      <ul className="cursive">
                           <li>Liam stops throwing toys after being told firmly that it's unacceptable.</li>
                           <li>Amelia avoids asking questions in class because she once received an impatient response from her teacher.</li>
                           <li>Nathan follows classroom rules after being sent to the principal's office for breaking them.</li>
                           <li>Ella withdraws from group activities because her peers laughed at her during a presentation.</li>
                      </ul>
                    <LO_SpeechButton 
                        id="psych_sba.lecture1" 
                        label="Read Aloud"
                        text="Lecture notes. Definition of punishment: Punishment is any event that decreases the frequency of
                              a preceding response. Examples: Liam stops throwing toys after being told firmly that it's unacceptable. 
                              Amelia avoids asking questions in class because she once received an impatient response from her
                              teacher. Nathan follows classroom rules after being sent to the principal's office for breaking them.
                              Ella withdraws from group activities because her peers laughed at her during a presentation."
                    />
                    </div>
            </SceneElement>
     </Scene>
  );
}