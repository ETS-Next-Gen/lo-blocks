import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { Scene, SceneElement, ConversationMove, LO_MultiDrop } from '../../lo_components/components.js';

export function PreQuiz2({onScreen}) {
   const basePath = process.env.NEXT_PUBLIC_BASEPATH || '';
   return (
       <Scene id="psych_sba.prequiz2" onScreen={onScreen} title="Understanding Negative and Positive Reinforcement and Punishment">
              <div className="floatLeftNarrow">
                  <ConversationMove 
                     id="psych_sba.prequiz2.move.1" 
                     onScreen={onScreen}
                     showOnScreens={[1,2]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>Hey guys, there's still something we need to get clear in our own heads before we offer any solutions to my roommate.
                           The most effective behavior modification technique, according to what we learned earlier, is <b>positive</b>&nbsp;
                           reinforcement. But I'm not really clear yet on the difference between positive and negative reinforcement.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.prequiz2.move.2" 
                     onScreen={onScreen}
                     showOnScreens={[2]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                        <p>I just checked back through my notes ... here's what I have:</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.prequiz2.move.3" 
                     onScreen={onScreen}
                     showOnScreens={[3,4,5]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                        <p>So, positive doesn't mean good, and negative doesn't mean bad. Instead, positive means adding something, and negative
                                        means taking something away! And it's the same for punishment. Look! Here's what I have in my notes::</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.prequiz2.move.4" 
                     onScreen={onScreen}
                     showOnScreens={[4, 5]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>So positive punishment would be like spanking the child every time he tries to avoid bedtime.
                           The adult is <b>adding</b> spanking, something that is undesirable, to <b>decrease</b> the
                           child’s behavior of avoiding bedtime.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.prequiz2.move.5" 
                     onScreen={onScreen}
                     showOnScreens={[5]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>And negative punishment would be like taking away his favorite toy whenever he avoids bedtime.
                           The adult is <b>taking away</b> the toy, something <b>desirable</b>, to <b>decrease</b> the child’s behavior of avoiding bedtime. </p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.prequiz2.move.6" 
                     onScreen={onScreen}
                     showOnScreens={[7, 8]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                                      <p>I'm still not as clear on this as I would like to be. Maybe some practice would help!</p>
                                      <p>Can we take some of the things that the parents have already tried or that we suggested
                                           early on and figure out what category they fit into? I don't know about you, but that would help me.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.prequiz2.move.7" 
                     onScreen={onScreen}
                     showOnScreens={[8]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>Yeah...me, too. How about if we fill in something like this graphic?</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.prequiz2.move.8" 
                     onScreen={onScreen}
                     showOnScreens={[9]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                                      <p>I found this chart on the Internet. I think it sums things up nicely!</p>
                  </ConversationMove>

             </div>
             <div className="floatRightWide">
                  <h3>&nbsp;</h3>
                  <h3>&nbsp;</h3>
                  <SceneElement onScreen={onScreen} showOnScreens={[2]}>
                      <div className="contentBox">
                          <p className="cursive"><b>Lecture Notes:</b></p><br />
                          <p className="cursive"><b>Positive reinforcement</b> strengthens responding by presenting a typically <b>pleasurable</b> stimulus immediately after a response. </p><br />
                          <p className="cursive"><b>Negative reinforcement</b> strengthens a response by reducing or removing a typically <b>unpleasant</b> stimulus immediately after a response.</p>
                      </div>
                  </SceneElement>
                  <SceneElement onScreen={onScreen} showOnScreens={[3, 4, 5]}>
                      <div className="contentBox">
                          <p className="cursive"><b>Lecture Notes:</b></p><br />
                          <p className="cursive"><b>Positive punishment</b> refers to weakening responses by <b>presenting</b> a typically <b>aversive</b> stimulus immediately after a response. </p><br />
                          <p className="cursive"><b>Negative punishment</b> weakens a response by <b>reducing or removing</b> something typically <b>pleasurable</b> immediately after a response.</p>
                      </div>
                  </SceneElement> 
                  <SceneElement onScreen={onScreen} showOnScreens={[8]}>
                      <LO_MultiDrop
                         id="psych_sba.positive_negative_reinforcement_punishment"
                         stem="How should the following statements be classified?"
                         directions="Drag and drop each choice below into the correct table cell above."
                         dropMax={1}
                         category_label1="Positive Reinforcement"
                         category_label2="Negative Reinforcement"
                         category_label3="Positive Punishment"
                         category_label4="Negative Punishment"
                         optionList={
                                [
                                 "Giving the child a sticker of his favorite cartoon character when he goes to bed when asked.",
                                 "Taking away his electronics for a week after he refuses to go to bed 3 times.",
                                 "Making the child write 'I will go to sleep on time' 100 times if he does not go to bed when asked.",
                                 "Allowing the child to have a pass on their chores when they go to bed when asked.",
                                ]
                         }
                      />
                  </SceneElement> 
             </div>
            <SceneElement onScreen={onScreen} showOnScreens={[9]}>
                 <img src={`${basePath}/poster.jpg`} style={{float: "left", "height": "400px", "marginLeft": "30px"}} />
            </SceneElement>
      </Scene>
  );
}