import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { Scene, SceneElement, ConversationMove } from '../../lo_components/components.js';

export function PostQuiz1({onScreen}) {
   const basePath = process.env.NEXT_PUBLIC_BASEPATH || '';
   return (
       <Scene id="psych_sba.postQuiz1" 
          onScreen={onScreen} 
          title="Understanding Reinforcement and Punishment">
              <div className="floatLeftHalf">
                  <ConversationMove 
                     id="psych_sba.scene.22.move.1" 
                     onScreen={onScreen}
                     showOnScreens={[1,2,3,4]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>I think we're getting a lot closer to helping your roommate out,
                           Annie, but can you text her to see what she and the parents have
                           been doing recently to try to get the kid to go to bed?</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.22.move.2" 
                     onScreen={onScreen}
                     showOnScreens={[2,3,4]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                        <p>Good idea. We know it was sometimes "do nothing," but maybe not every time.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.22.move.3" 
                     onScreen={onScreen}
                     showOnScreens={[3,4]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>Sure, I’ll text her now and let you know what she says.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.22.move.4" 
                     onScreen={onScreen}
                     showOnScreens={[4]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>She texted right back. See for yourselves.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.22.move.5" 
                     onScreen={onScreen}
                     showOnScreens={[5, 6, 7, 8]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>So what is this? Punishment or reinforcement?</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.22.move.6" 
                     onScreen={onScreen}
                     showOnScreens={[6, 7, 8]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                        <p>You'd think yelling was punishment! But it doesn't seem to have worked as punishment, 
                           because his refusing to go to sleep got worse. So in this case, yelling was a reinforcer.
                           If yelling worked as a punisher, we would expect that he would stop the problem behaviors
                           after being yelled at.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.22.move.7" 
                     onScreen={onScreen}
                     showOnScreens={[7, 8]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                        <p>In other words, their attempt to control his behavior gave him something he wanted, probably attention,
                           so every time they tried to bring the problem under control, they were only making it worse.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.22.move.8" 
                     onScreen={onScreen}
                     showOnScreens={[8]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>That means we need to figure out things to suggest that will reinforce <b>cooperation</b>. We don't want to accidentally reinforce the wrong thing!</p>
                  </ConversationMove>
              </div>
              <SceneElement onScreen={onScreen} showOnScreens={[4, 5, 6, 7, 8]}>
                  <div className="floatLeftHalf">
                       <img src={`${basePath}/messages.png`} style={{"height": "400px"}} alt="Messages"/>
                  </div>
              </SceneElement>
       </Scene>
  );
}