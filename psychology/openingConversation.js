import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { LO_SpeechButton, Scene, ConversationMove } from '../../lo_components/components.js';

export function OpeningConversation({onScreen}) {
  return (
      <Scene id="psych_sba.scene.1" onScreen={onScreen}>
          <h3>Introduction</h3>
          <ConversationMove 
             id="psych_sba.scene.1.move1"
             onScreen={onScreen}
             showOnScreens={[1, 2, 3, 4, 5, 6, 7]}
             name="Annie"
             imgURL="/TeamMemberTwo.jpg"
             maxHeight="40px"
             screenPercent="100%"
             bgColor="#5DE2E7"
             className="conversationDark"
             pictureClass="imageWindow">
              <p>Hey, sorry I'm late. I was talking to my roommate about a problem. </p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.scene.1.move2" 
             onScreen={onScreen}
             showOnScreens={[2, 3, 4, 5, 6, 7]}
             name="JJ"
             imgURL="/TeamMemberOne.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar3">
               <p>What's going on? Is it something you can tell us?</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.scene.1.move3" 
             onScreen={onScreen}
             showOnScreens={[3, 4, 5, 6, 7]}
             name="Annie"
             imgURL="/TeamMemberTwo.jpg"
             maxHeight="30px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindow">
                <p>Oh, yeah, it's not a secret. She's got a babysitting gig for some extra cash, <br />
                   but the kid is giving her all kinds of trouble, just like his parents warned her. <br />
                   He's six, and he doesn't want to go to bed. He just runs around when it's his bedtime. </p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.scene.1.move4" 
             onScreen={onScreen}
             showOnScreens={[4, 5, 6, 7]}
             name="Lin"
             imgURL="/TeamMemberThree.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar2">
                <p>What did the parents say about it?</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.scene.1.move5" 
             onScreen={onScreen}
             showOnScreens={[5, 6, 7]}
             name="Annie"
             imgURL="/TeamMemberTwo.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindow">
                 <p>They've tried pretty much everything. They've taken away his games and toys, they've tried
                    to just let him figure it out on his own, but it's almost like nothing will work for them to
                    fix this. She's really frustrated and thinks she should just let him do whatever he wants and
                    hope he'll grow out of it. I told her I was meeting with you all and we would try to come up
                    with something to help her from what we’ve been learning in our psychology class.  </p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.scene.1.move6" 
             onScreen={onScreen}
             showOnScreens={[6, 7]}
             name="Lin"
             imgURL="/TeamMemberThree.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar2">
                  <p>Hey! I read in our textbook that a good way to learn something is to actually use it to solve
                     a problem. We should be able to use what we're learning from psych to come up with a solution
                     for your friend, Annie. We'll also be studying while we’re helping!</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.scene.1.move7" 
             onScreen={onScreen}
             showOnScreens={[7]}
             name="Annie"
             imgURL="/TeamMemberTwo.jpg"
             maxHeight="30px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindow">
                   <p>That sounds like a win-win, to me.</p>
          </ConversationMove>
      </Scene>
  );
}