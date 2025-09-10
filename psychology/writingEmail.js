import { React, useState, useRef, useEffect,useCallback } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useComponentSelector } from '../../lo_components/utils.js';
import { Scene, SceneElement, ConversationMove, StoreVariable, Stem, Directions,
         ConstructedResponse, LO_Checkbox, TabComponent} from '../../lo_components/components.js';
import MyOutline from '../../content/psychology/texts/my_outline.js';
import JJs_Outline from '../../content/psychology/texts/jjs_outline.js';
import Lins_Outline from '../../content/psychology/texts/lins_outline.js';
import Annies_Outline from '../../content/psychology/texts/annies_outline.js';

export function WritingEmail({onScreen}) {
   const psych_email_to_babysitter = useComponentSelector("psych_sba.email_to_babysitter", s => s?.value ?? '');
   const completed = useComponentSelector("psych_sba.completed", s => s?.value ?? '') || '';
   return (
       <Scene id="psych_sba.writing_email" onScreen={onScreen} title="Writing the Email to Annie's Friend">
              <div className="floatLeftNarrow">
                  <ConversationMove 
                     id="psych_sba.writing_email.move.1" 
                     onScreen={onScreen}
                     showOnScreens={[1,2,3,4]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Phew...we've covered a lot of ground.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.writing_email.move.2" 
                     onScreen={onScreen}
                     showOnScreens={[2,3,4]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                        <p>For real. I think we have the difference between positive and negative reinforcement
                           and positive and negative punishment down.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.writing_email.move.3" 
                     onScreen={onScreen}
                     showOnScreens={[3,4]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>Don't forget that the whole <b>point</b> of this was to figure out what
                           to tell my friend! We still have to solve her babysitting problem.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.writing_email.move.4" 
                     onScreen={onScreen}
                     showOnScreens={[4]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>So, here's what we already wrote ... What do we need to do next?</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.writing_email.move.5" 
                      onScreen={onScreen}
                      showOnScreens={[5, 6, 7, 8]}
                      name="Annie"
                      imgURL="/TeamMemberTwo.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindow">
                         <p>Well, we had better tell her that we're recommending she use positive reinforcement, and explain why.</p>
                   </ConversationMove>
                   <ConversationMove 
                     id="psych_sba.writing_email.move.6" 
                      onScreen={onScreen}
                      showOnScreens={[6, 7, 8]}
                      name="Lin"
                      imgURL="/TeamMemberThree.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindowVar2">
                         <p>And we should probably explain what positive reinforcement is. It gave us all a lot of trouble,
                            and we're taking a psychology class. She isn't.</p>
                   </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.writing_email.move.7" 
                     onScreen={onScreen}
                     showOnScreens={[7, 8]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                        <p>Most important of all, we need a list of specific positive reinforcement techniques we should suggest to her.
                           Let's give her some good ideas!
                        </p>
                  </ConversationMove>
                  <ConversationMove 
                      id="psych_sba.writing_email.move.8" 
                      onScreen={onScreen}
                      showOnScreens={[8]}
                      name="Annie"
                      imgURL="/TeamMemberTwo.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindow">
                         <p>That gives us an outline we can use. Maybe we can each fill in the outline, and compare notes afterward?</p>
                   </ConversationMove>

                   <ConversationMove 
                      id="psych_sba.writing_email.move.9" 
                      onScreen={onScreen}
                      showOnScreens={[10, 11, 12]}
                      name="Annie"
                      imgURL="/TeamMemberTwo.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindow">
                         <p>I'm done!</p>
                   </ConversationMove>
                   <ConversationMove 
                      id="psych_sba.writing_email.move.10" 
                      onScreen={onScreen}
                      showOnScreens={[11, 12]}
                      name="JJ"
                      imgURL="/TeamMemberOne.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindowVar3">
                         <p>So am I!</p>
                   </ConversationMove>
                   <ConversationMove 
                      id="psych_sba.writing_email.move.11" 
                      onScreen={onScreen}
                      showOnScreens={[12]}
                      name="Lin"
                      imgURL="/TeamMemberThree.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindowVar2">
                       <p>I am, too.</p>
                   </ConversationMove>
                  <ConversationMove 
                      id="psych_sba.writing_email.move.11" 
                      onScreen={onScreen}
                      showOnScreens={[13]}
                      name="You"
                      imgURL="/self.png"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationLightFlex"
                      pictureClass="imageWindowVar1">
                         <p>I'm going to go ahead and pull together the final email. I'll pull the best ideas out of all our outlines.<br /><br /></p>
                         <ConstructedResponse
                             id="psych_sba.final_email"
                             form="psych_sba"
                             section="Brainstorming"
                             type="LO_TextOrSpeechInput"
                             stem="Write the final email."
                             directions="Put your answer in the box below."
                             className="very-large-input"
                         />
                  </ConversationMove>
               <ConversationMove 
                   id="psych_sba.writing_email.move.12" 
                   onScreen={onScreen}
                   showOnScreens={[14]}
                   name="You"
                   imgURL="/self.png"
                   maxHeight="40px"
                   screenPercent="100%"
                   className="conversationLightFlex"
                   pictureClass="imageWindowVar1">
                    <LO_Checkbox
                        id="psych_sba.age_appropriacy.completed.check"
                        form="psych_sba"
                        section="Selecting a Strategy"
                        group_id="psych_sba.completed"
                        defaultValue=""
                        label="OK. I've finished the email!"
                        targetedNotCheckedValue=""
                        style="checkbox"
                    />
                 </ConversationMove>
                 {completed &&
                 <ConversationMove 
                      id="psych_sba.writing_email.move.9" 
                      onScreen={onScreen}
                      showOnScreens={[14]}
                      name="Annie"
                      imgURL="/TeamMemberTwo.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindow">
                         <p>Ok. I'm so excited! I just sent the email to my roommate and got
                            an answer back.</p>
                 </ConversationMove>}
                 {completed &&
                 <ConversationMove 
                      id="psych_sba.writing_email.move.9" 
                      onScreen={onScreen}
                      showOnScreens={[15]}
                      name="Annie"
                      imgURL="/TeamMemberTwo.jpg"
                      maxHeight="40px"
                      screenPercent="100%"
                      className="conversationDark"
                      pictureClass="imageWindow">
                         <p>Positive reinforcement worked!</p> 
                         <p>Thank YOU so much!  I'm glad we were able to help my roommate by sharing
                            what we have been learning in psych. So cool. Applying psych to our own
                            lives pays off... Let's get together and study for our exam. I think we 
                            work really well together!</p>
                 </ConversationMove>}
              </div>
              <div className="floatRightWide">
                  <SceneElement onScreen={onScreen} showOnScreens={[4]}>
                      <div className="fullContentWindow">
                          <h3>The Opening We Wrote</h3>
                          <br />
                          <StoreVariable id="psych_sba.email_to_babysitter" />
                      </div>
                  </SceneElement>
                  <SceneElement onScreen={onScreen} showOnScreens={[8]}>
                      <div className="fullContentWindow">
                          <p><b>Outline for Our Email to Annie's Friend</b></p>
                          <ol>
                              <li><b>Why Annie’s friend shouldn’t give up on setting a bedtime</b><br />
                                 {psych_email_to_babysitter}<br /><br />
                              </li>
                              <li><b>What psychological technique we are recommending (positive reinforcement)</b><br /><br /></li>
                              <li><b>Explanation of what positive reinforcement is and why it works</b><br /><br /></li>
                              <li><b>List of positive reinforcement techniques she can try to get the kid to
                                     go to sleep at bedtime</b><br /><br /></li>
                              <li><b>Final paragraph -- wish her luck!</b><br /><br /></li>
                          </ol>
                      </div>
                  </SceneElement>
                  <SceneElement onScreen={onScreen} showOnScreens={[13]}>
                      <Directions>The four tabs to the right contain the email outline for each group member.
                                  You can view each group member’s outline by clicking on the tab with their 
                                  name on it. Then, you can copy and paste different portions of the email 
                                  outlines into the box below as you create the final email.</Directions>
                      <TabComponent id="leftEmailTab">            
                          <TabList>
                              <Tab>Your Outline</Tab>
                              <Tab>JJ's Outline</Tab>
                              <Tab>Lin's Outline</Tab>
                              <Tab>Annie's Outline</Tab>
                          </TabList>
                          <TabPanel>
                              <MyOutline />
                          </TabPanel>
                          <TabPanel>
                              <JJs_Outline />
                          </TabPanel>
                          <TabPanel>
                              <Lins_Outline />
                          </TabPanel>
                          <TabPanel>
                              <Annies_Outline />
                          </TabPanel>
                      </TabComponent>
                  </SceneElement>
              </div>
              <SceneElement onScreen={onScreen} showOnScreens={[9]}> 
                  <div className="floatLeftHalf">
                      <Directions>As you are filling in your email outline, so are your friends.</Directions>
                      <div className="contentDiv"><ol>
                        <li style={{width: "100%"}}>
                            <ConstructedResponse
                                id="psych_sba.email_to_babysitter2"
                                form="psych_sba"
                                section="Using AI"
                                type="LO_TextOrSpeechInput"
                                stem="Why Annie's friend shouldn't give up on setting a bedtime."
                                directions="Put your answer in the box below."
                                defaultValue={psych_email_to_babysitter}
                                className="medium-input-very-short"
                             />
                        </li>
                        <li style={{width: "100%"}}>
                            <ConstructedResponse
                                id="psych_sba.recommendation_for_positive_reinforcement"
                                form="psych_sba"
                                section="Using AI"
                                type="LO_TextOrSpeechInput"
                                stem="What psychological technique we are recommending (positive reinforcement)."
                                directions="Put your answer in the box below."
                                className="medium-input-very-short"
                             />
                        </li>
                        <li style={{width: "100%"}}>
                            <ConstructedResponse
                                id="psych_sba.explanation_of_positive_reinforcement"
                                form="psych_sba"
                                section="Using AI"
                                type="LO_TextOrSpeechInput"
                                stem="Explanation of what positive reinforcement is and why it works."
                                directions="Put your answer in the box below."
                                className="medium-input-very-short"
                             />
                        </li>
                      </ol>
                     </div>
                    </div>
                    <div className="floatLeftHalf">
                      <div className="contentDiv"><ol start="4">
                        <li>
                             <Stem>List of positive reinforcement techniques she can try to get the kid to go to sleep at bedtime</Stem>
                             <ol type="a">
                                   <li style={{width: "100%"}}>
                                         <ConstructedResponse
                                            id="psych_sba.example_positive_reinforcement_1"
                                            form="psych_sba"
                                            section="Using AI"
                                            type="LO_TextOrSpeechInput"
                                            stem=""
                                            directions=""
                                            className="medium-input-very-short"
                                         />
                                   </li>
                                   <li style={{width: "100%"}}>
                                        <ConstructedResponse
                                            id="psych_sba.example_positive_reinforcement_2"
                                            form="psych_sba"
                                            section="Using AI"
                                            type="LO_TextOrSpeechInput"
                                            stem=""
                                            directions=""
                                            className="medium-input-very-short"
                                         />
                                   </li>
                                   <li style={{width: "100%"}}>
                                        <ConstructedResponse
                                            id="psych_sba.example_positive_reinforcement_3"
                                            form="psych_sba"
                                            section="Using AI"
                                            type="LO_TextOrSpeechInput"
                                            stem=""
                                            directions=""
                                            className="medium-input-very-short"
                                         />
                                   </li>
                                   <li style={{width: "100%"}}>
                                        <ConstructedResponse
                                            id="psych_sba.example_positive_reinforcement_4"
                                            form="psych_sba"
                                            section="Using AI"
                                            type="LO_TextOrSpeechInput"
                                            stem=""
                                            directions=""
                                            className="medium-input-very-short"
                                         />
                                   </li>
                                   <li style={{width: "100%"}}>
                                        <ConstructedResponse
                                            id="psych_sba.example_positive_reinforcement_5"
                                            form="psych_sba"
                                            section="Using AI"
                                            type="LO_TextOrSpeechInput"
                                            stem=""
                                            directions=""
                                            className="medium-input-very-short"
                                         />
                                   </li>
                             </ol>
                        </li>
                        <li className="narrow-input-short">
                            <ConstructedResponse
                                id="psych_sba.final_paragraph"
                                form="psych_sba"
                                section="Using AI"
                                type="LO_TextOrSpeechInput"
                                stem="Final paragraph -- wish her luck!"
                                directions=""
                                className="medium-input-very-short"
                             />
                        </li>
                     </ol>
                    </div>
                  </div>
              </SceneElement>
              <SceneElement onScreen={onScreen} showOnScreens={[15]}> 
                 {completed &&
                  <>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="narrowFloatRightContentWindow">
                       <h3>My roommate's email:</h3>
                       <p>Hey!</p>
                       <p>I just wanted to thank you and your friends for helping me out with the bedtime situation!</p>
                       <p>I tried the positive reinforcement technique you all suggested, and it actually worked!</p>
                       <p>It took me a while to figure out the perfect reinforcement. He loves Paw Patrol, so I started
                          giving him Paw Patrol stickers to reinforce him going to bed on time. I gave him one sticker
                          for getting into bed and told him that I would leave more stickers for his mom to give him in
                          the morning, IF he stayed in bed and went to sleep. {String.fromCodePoint('0x1f60A')}</p>
                       <p>So far, he has gone to bed without a fuss three nights in a row!</p>
                       <p>Please tell everyone I really appreciate their ideas! Y’all are lifesavers!</p><br />

                  </div>
                </>}
              </SceneElement>

       </Scene>
  );
}