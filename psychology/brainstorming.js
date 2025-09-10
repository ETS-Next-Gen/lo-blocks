import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { LO_SpeechButton, Scene, ConversationMove, SceneElement, ConstructedResponse, StoreVariable} from '../../lo_components/components.js';

export function Brainstorming({onScreen}) {
  return (
         <Scene id="psych_sba.scene.2" onScreen={onScreen} title="Brainstorming">
             <div className="floatLeftNarrow">
                 <ConversationMove 
                     id="psych_sba.brainstorming.move.1" 
                     onScreen={onScreen}
                     showOnScreens={[1, 2, 3, 4]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                        <p>Let's brainstorm some ideas for her. I don't have any
                           kids myself, but I have a younger sister.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.brainstorming.move.2" 
                     onScreen={onScreen}
                     showOnScreens={[2, 3, 4]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                         <p>And I've got little cousins.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.brainstorming.move.3" 
                     onScreen={onScreen}
                     showOnScreens={[3, 4]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>Thanks for helping out. She's really stressing about it.</p>
                        <p>OK, what do YOU think she should do to get the 6-year-old
                           to go to sleep at bedtime???</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.brainstorming.move.4" 
                     onScreen={onScreen}
                     showOnScreens={[5, 6]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>Haha, we are all over the place with our ideas!</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.brainstorming.move.5" 
                     onScreen={onScreen}
                     showOnScreens={[6]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                         <p>It looks like the choices are between using behavioral techniques, like we're learning about in class,
                            or doing nothing. My suggestion was to do nothing, but now I'm not sure. I'm going to ask the AI 
                            assistant if there's evidence for that.</p>
                  </ConversationMove>
            </div>
            <div className="floatRightWide">
                <SceneElement onScreen={onScreen} showOnScreens={[4]}>
                    <br /><br /><br />
                    <ConversationMove 
                        id="interdisciplinary_move30"
                        name="You"
                        imgURL="/self.png"
                        maxHeight="40px"
                        screenPercent="100%"
                        className="conversationLightFlex"
                        pictureClass="imageWindowVar1">
                            <ConstructedResponse
                                id='psych_sba.student_suggestion'
                                form="psych_sba"
                                section="Brainstorming"
                                type="LO_TextOrSpeechInput"
                                stem="What do you think the babysitter should do to get the 6-year-old to go to sleep at bedtime?"
                                      directions="Put your answer in the box below."
                                      className="wide-input"
                            />
                    </ConversationMove>
                </SceneElement>
                <SceneElement onScreen={onScreen} showOnScreens={[5, 6]}>
                    <div className="contentWindow"><StoreVariable id="psych_sba.student_suggestion" /></div>
                    <div className="contentWindow">Tell him you'll give him 50 cents if he goes to bed on time. 
                                                   Hey, 50 cents is a lot of money to a 6-year-old!
                    </div>
                    <div className="contentWindow">Say that you won't play any games with him ever again 
                                                   unless he goes to sleep at his bedtime.
                    </div>
                    <div className="contentWindow">I'm with the "do nothing" crowd.  She shouldn't do anything at all.
                                                   If he stays up, he stays up. That's on him. He'll be so tired the next day, he'll probably never do it again!
                    </div>
                </SceneElement>
            </div>
      </Scene>
  );
}