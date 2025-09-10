import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { LO_SpeechButton, Scene, SceneElement, ConversationMove, Directions,
         ConstructedResponse, LO_SortableList, OpenAIQuery, Comment } from '../../lo_components/components.js';

export function UsingAI({onScreen}) {
  const title = "Using AI";
  const studentText = useComponentSelector("psych_sba.student_ai_prompt", s => s?.value ?? '');

  return (
      <Scene id="psych_sba.scene.4" onScreen={onScreen} title={title}>
          <ConversationMove 
             id="psych_sba.usingAI.move.1" 
             onScreen={onScreen}
             showOnScreens={[1, 2, 3, 4, 5, 6]}
             name="JJ"
             imgURL="/TeamMemberOne.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar3">
                  <p>My mom’s a Pediatrician, and I have heard her say that not going to bed on time
                     is called "sleep refusal" and the "doing nothing" parenting style is called
                     "no-rules parenting." In Gen Psych, we have been reading about the "permissive"
                     parenting style; "no-rules parenting" seems like an example of that. </p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.usingAI.move.2" 
             onScreen={onScreen}
             showOnScreens={[2, 3, 4, 5, 6]}
             name="Annie"
             imgURL="/TeamMemberTwo.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindow">
                 <p>That is definitely NOT how I was raised.</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.usingAI.move.3" 
             onScreen={onScreen}
             showOnScreens={[3, 4, 5, 6]}
             name="JJ"
             imgURL="/TeamMemberOne.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar3">
                 <p>Same!</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.usingAI.move.4" 
             onScreen={onScreen}
             showOnScreens={[4, 5, 6]}
             name="Lin"
             imgURL="/TeamMemberThree.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar2">
                 <p>Nope! But we can use "no-rules parenting" and "sleep refusal" in the AI prompt..</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.usingAI.move.5" 
             onScreen={onScreen}
             showOnScreens={[5, 6]}
             name="JJ"
             imgURL="/TeamMemberOne.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar3">
                <p>That's a good point. I use AI a lot, and I end up spending a lot of time trying to get my question
                   to it right...otherwise, I get all kinds of weird answers.</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.usingAI.move.6" 
             onScreen={onScreen}
             showOnScreens={[6]}
             name="Annie"
             imgURL="/TeamMemberTwo.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindow">
               <p>Yeah, I've had that happen too. We should figure out a good way to write the question to get the info we want.</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.usingAI.move.7" 
             onScreen={onScreen}
             showOnScreens={[7]}
             name="JJ"
             imgURL="/TeamMemberOne.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar3">
             <p>OK, so if we want to find out about sleep refusal...no-rules parenting...and other ways to get a young 
                child to go to bed...what prompt could we write for the AI?</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.usingAI.move.8" 
             onScreen={onScreen}
             showOnScreens={[7]}
             name="You"
             imgURL="/self.png"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationLightFlex"
             pictureClass="imageWindowVar1">
               <ConstructedResponse
                   id='psych_sba.student_ai_prompt'
                   form="psych_sba"
                   section={title}
                   type="LO_TextOrSpeechInput"
                   stem="What prompt should we write for the AI in order to learn about sleep refusal and
                         no-rules parenting and to also learn about other strategies to get a young child to go to bed?"
                   className="wide-input"
               />
         </ConversationMove>
         <ConversationMove 
             id="psych_sba.usingAI.move.9" 
             onScreen={onScreen}
             showOnScreens={[8]}
             name="Annie"
             imgURL="/TeamMemberTwo.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindow">
               <p>Hmmm...yeah, these are pretty good. Let's rank them.<br /> Number 1 is for the prompt we think is the best.</p>
         </ConversationMove>
         <ConversationMove 
            id="psych_sba.usingAI.move.10" 
            onScreen={onScreen}
            showOnScreens={[10, 11, 12, 13]}
            name="JJ"
            imgURL="/TeamMemberOne.jpg"
            maxHeight="40px"
            screenPercent="100%"
            className="conversationDark"
            pictureClass="imageWindowVar3">
               <p>Ummm ... I asked the question multiple times, and the answer changed.</p>
         </ConversationMove>
         <ConversationMove 
            id="psych_sba.usingAI.move.11" 
            onScreen={onScreen}
            showOnScreens={[11, 12, 13]}
            name="Annie"
            imgURL="/TeamMemberTwo.jpg"
            maxHeight="40px"
            screenPercent="100%"
            className="conversationDark"
            pictureClass="imageWindow">
            <p>That happened to me too! It didn’t change <i>much</i> between searches, but <br />
               it changed enough for me to notice. What worries me more is sometimes it gave sources,<br />
               but sometimes it didn’t. Then when I tried to look up the sources I was provided, I couldn't<br />
               find them all the time!  
            </p>
         </ConversationMove>
         <ConversationMove 
            id="psych_sba.usingAI.move.12" 
            onScreen={onScreen}
            showOnScreens={[12, 13]}
            name="JJ"
            imgURL="/TeamMemberOne.jpg"
            maxHeight="40px"
            screenPercent="100%"
            className="conversationDark"
            pictureClass="imageWindowVar3">
               <p>One time when I ran it, it gave me evidence AGAINST no-rules parenting,<br /> but it listed it
                  as evidence FOR no-rules parenting.</p>
         </ConversationMove>
         <ConversationMove 
            id="psych_sba.usingAI.move.13" 
            onScreen={onScreen}
            showOnScreens={[13]}
            name="Lin"
            imgURL="/TeamMemberThree.jpg"
            maxHeight="40px"
            screenPercent="100%"
            className="conversationDark"
            pictureClass="imageWindowVar2">
                 <p>I recently read an article that says these are called 'hallucinations'. <br />
                    They happen because the AI doesn't actually understand what it's saying, <br />
                    the way a human does. It's more like a parrot than a person. It's just producing<br />
                    sequences of words it has been trained to produce, in an order determined by a math<br />
                    formula to look like human speech. It can take wrong turns, and those wrong turns<br />
                    can spin out of control!</p>
         </ConversationMove>
         <ConversationMove 
            id="psych_sba.usingAI.move.14" 
            onScreen={onScreen}
            showOnScreens={[14, 15]}
            name="Annie"
            imgURL="/TeamMemberTwo.jpg"
            maxHeight="40px"
            screenPercent="100%"
            className="conversationDark"
            pictureClass="imageWindow">
               <p>That means we can't just take the AI summary at face value. We had better<br />
                  check what it says against the textbook and other sources we can actually<br />
                  find. You know what, I'll look all of this up and verify everything, then<br />
                  I'll send you a summary of where I've gotten rid of anything I can't verify.<br />
                  Then we can go over it together.  
               </p>
          </ConversationMove>
          <ConversationMove 
            id="psych_sba.usingAI.move.15" 
             onScreen={onScreen}
             showOnScreens={[15]}
             name="JJ"
             imgURL="/TeamMemberOne.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar3">
               <p>Thanks, Annie! This sounds like a lot of work, but I guess we need to do it<br />
                  if we want to help your friend!</p>
          </ConversationMove>
         <SceneElement onScreen={onScreen} showOnScreens={[8]}>
             <div className="floatRightMediumWide">
                 <Comment>This item doesn't actually have a key. But I've provided one in the ItemKeys parameter to illustrate how it could be keyed.</Comment>
                 <LO_SortableList
                     id="psych_sba.ai_prompt_shuffle"
                     form="psych_sba"
                     section={title}
                     stem="Which is the best prompt?"
                     directions="The prompt you just entered is in the first box below. Use drag and 
                                 drop to rank the choices. In the Number 1 position, put the choice
                                 you think is the best prompt to use for the AI.”"
                     optionList = {[
                         studentText,
                         "Is no-rules parenting any good for sleep refusal, and if not, what other things could I try?",
                         "What is the evidence for no-rules parenting and any alternatives to address sleep refusal?",
                         "What is the evidence-based way to stop sleep refusal: no-rules parenting or something else like behavior modification?"
                    ]}
                    itemKeys = {[
                         "What is the evidence for no-rules parenting and any alternatives to address sleep refusal?",
                         "What is the evidence-based way to stop sleep refusal: no-rules parenting or something else like behavior modification?",
                         "Is no-rules parenting any good for sleep refusal, and if not, what other things could I try?",
                         studentText,
                    ]}
                 />
                 </div>
             </SceneElement>
         <SceneElement onScreen={onScreen} showOnScreens={[9]}>
             <Directions>From all of your group member’s AI prompt suggestions, your group chose this prompt.
                         If you still want to edit the AI prompt before you try it, you can.
             </Directions>
             <OpenAIQuery 
                 promptID="psych_sba.revised_student_ai_prompt" 
                 targetID="psych_sba.ai_output"
                 systemPrompt="Hello. I am your psychology teaching assistant. How can I help you?"
                 queryInstruction="Click here to get AI feedback on your AI prompt."
                 postPrompt=". Output your response in Markdown but do not mention Markdown in your response."
                 defaultValue="What is the evidence for no-rules parenting and any alternatives to address sleep refusal?"
             />
         </SceneElement>
     </Scene>
  );
 }