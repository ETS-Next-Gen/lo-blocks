import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { LO_SpeechButton, Scene, SceneElement, ConversationMove, LO_Checkbox_MultipleSelectionMultipleChoice, 
         LO_Radiobutton_SingleSelectionMultipleChoice, ConstructedResponse, AIFeedback, StoreVariable } from '../../lo_components/components.js';
import FlexibleBedtimeRoutineDetails from '../../content/psychology/texts/flexible_bedtime_routine_details.js';
import PositiveReinforcementDetails from '../../content/psychology/texts/positive_reinforcement_details.js';
import GradualFadingDetails from '../../content/psychology/texts/gradual_fading_details.js';
import EmpathyAndEmotionalSupportDetails from '../../content/psychology/texts/empathy_and_emotional_support_details.js';
import NaturalConsequencesWithLimitsDetails from '../../content/psychology/texts/natural_consequences_with_limits_details.js';
import EnvironmentalAdjustmentDetails from '../../content/psychology/texts/environmental_adjustment_details.js';
import CollaborativeProblemSolvingDetails from '../../content/psychology/texts/collaborative_problem_solving_details.js';

export function SelectingAStrategy({onScreen, editable, showKeys, showChecks, showUnchecked, showDetails}) {
  const title="Selecting a Strategy"

  const psych_sba_age_appropriacy_bedtime_routines = useComponentSelector("psych_sba.age_appropriacy.flexible_bedtime_routines", s => s?.value ?? '');
  const psych_sba_age_appropriacy_positive_reinforcement = useComponentSelector("psych_sba.age_appropriacy.positive_reinforcement", s => s?.value ?? '');
  const psych_sba_age_appropriacy_gradual_fading = useComponentSelector("psych_sba.age_appropriacy.gradual_fading", s => s?.value ?? '');
  const psych_sba_age_appropriacy_empathy_and_emotional_support = useComponentSelector("psych_sba.age_appropriacy.empathy_and_emotional_support", s => s?.value ?? '');
  const psych_sba_age_appropriacy_natural_consequences_with_limits = useComponentSelector("psych_sba.age_appropriacy.natural_consequences_with_limits", s => s?.value ?? '');
  const psych_sba_age_appropriacy_environmental_adjustments = useComponentSelector("psych_sba.age_appropriacy.environmental_adjustments", s => s?.value ?? '');
  const psych_sba_age_appropriacy_collaborative_problem_solving = useComponentSelector("psych_sba.age_appropriacy.collaborative_problem_solving", s => s?.value ?? '');
  const psych_sba_age_appropriacy_explanation = useComponentSelector("psych_sba.age_appropriacy.explanation", s => s?.value ?? '');

  const psych_sba_feasibility_bedtime_routines = useComponentSelector("psych_sba.feasibility.flexible_bedtime_routines", s => s?.value ?? '');
  const psych_sba_feasibility_positive_reinforcement = useComponentSelector("psych_sba.feasibility.positive_reinforcement", s => s?.value ?? '');
  const psych_sba_feasibility_gradual_fading = useComponentSelector("psych_sba.feasibility.gradual_fading", s => s?.value ?? '');
  const psych_sba_feasibility_empathy_and_emotional_support = useComponentSelector("psych_sba.feasibility.empathy_and_emotional_support", s => s?.value ?? '');
  const psych_sba_feasibility_natural_consequences_with_limits = useComponentSelector("psych_sba.feasibility.natural_consequences_with_limits", s => s?.value ?? '');
  const psych_sba_feasibility_environmental_adjustments = useComponentSelector("psych_sba.feasibility.environmental_adjustments", s => s?.value ?? '');
  const psych_sba_feasibility_collaborative_problem_solving = useComponentSelector("psych_sba.feasibility.collaborative_problem_solving", s => s?.value ?? '');
  const psych_sba_feasibility_explanation = useComponentSelector("psych_sba.feasibility.explanation", s => s?.value ?? '');

  function pickClass(onScreen) {
      if (onScreen <=3) {
          return "floatLeftHalf";
      } else if (onScreen==8 || onScreen==9 || onScreen==10 || onScreen==11 || onScreen==12) {
          return "floatLeft";
      } else if (onScreen >= 19) {
          return "floatLeftHalf";
      } else {
          return "floatLeftNarrow";
      }
  }

  return (
     <Scene id="psych_sba.selectingAStrategy" onScreen={onScreen} title={title}>
         <div className={pickClass(onScreen)}>
             <ConversationMove 
                 id="psych_sba.selectingAStrategy.move.1" 
                 onScreen={onScreen}
                 showOnScreens={[1,2, 3]}
                 name="Annie"
                 imgURL="/TeamMemberTwo.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindow">
                     <p>All right, I think we've covered no-rules parenting. But our email really needs
                        to give my friend a practical solution -- one we know will work, because there's good
                        psychological evidence for it. So I also dug into information about strategies we
                        could suggest to her, so she can solve that bedtime problem!
                     </p><br />
                     <p>There’s only one issue. I have seven different ideas for how to address sleep 
                        refusal. Which is a lot! </p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.2" 
                onScreen={onScreen}
                showOnScreens={[2, 3]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>Well, I know which one I like! Why don't we take a poll and see which of these choices
                      we think we should recommend?</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.3" 
                onScreen={onScreen}
                showOnScreens={[4]}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                    <p>Well ... since it seems like we can’t agree on what to recommend, maybe we should
                       take a closer look at the notes I put together about each strategy.  </p>
            </ConversationMove>
            <ConversationMove 
               id="psych_sba.selectingAStrategy.move.4" 
               onScreen={onScreen}
               showOnScreens={[5]}
               name="JJ"
               imgURL="/TeamMemberOne.jpg"
               maxHeight="40px"
               screenPercent="100%"
               className="conversationDark"
               pictureClass="imageWindowVar3">
                  <p>Hey Annie, do you know if your friend's child gets scared or anxious when bedtime approaches?
                     I hadn't even thought about the need for empathy and emotional support.</p>
            </ConversationMove>
            <ConversationMove 
               id="psych_sba.selectingAStrategy.move.5" 
               onScreen={onScreen}
               showOnScreens={[5]}
               name="Annie"
               imgURL="/TeamMemberTwo.jpg"
               maxHeight="40px"
               screenPercent="100%"
               className="conversationDark"
               pictureClass="imageWindow">
                   <p>I don't know. I'll have to ask her.
                   </p>
            </ConversationMove>
            <ConversationMove 
              id="psych_sba.selectingAStrategy.move.5" 
              onScreen={onScreen}
              showOnScreens={[6]}
              name="JJ"
              imgURL="/TeamMemberOne.jpg"
              maxHeight="40px"
              screenPercent="100%"
              className="conversationDark"
              pictureClass="imageWindowVar3">
                 <p>Woah! There’s honestly a lot of good strategies she could try,
                    and we haven’t even covered them all yet. </p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.6" 
                onScreen={onScreen}
                showOnScreens={[7]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                     <p>Wow, Annie. There's so much information here, 
                        I'm not sure how to explain it to your friend
                        or what she could even do with it.</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.6" 
                onScreen={onScreen}
                showOnScreens={[7]}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                    <p>Yeah. I think we're going to have to figure out
                       which of these is the <b>best</b> thing for her to try and explain that!</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.7" 
                onScreen={onScreen}
                showOnScreens={[8,9,10,11,12]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                     <p>OK, so now that we know what the strategies are, we can figure
                        out which of them is the best choice for your roommate to use, 
                        Annie. But how should we go about doing that?</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.8" 
                onScreen={onScreen}
                showOnScreens={[9,10,11,12]}
                name="JJ"
                imgURL="/TeamMemberOne.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar3">
                     <p>Well, not all of the strategies will apply to a six-year-old. We should
                        eliminate any that seem unlikely to work with younger children.</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.9" 
                onScreen={onScreen}
                showOnScreens={[10,11,12]}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                     <p>Also, some of the strategies might work better for the parents, because
                        they're around all the time. We need a strategy Annie's friend can use
                        even if it doesn't line up with what the parents are doing.</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.10" 
                onScreen={onScreen}
                showOnScreens={[11,12]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>There's another thing to think about. Annie's friend needs fast results!
                      We shouldn't advise her to try anything that would take a long time,
                      or only make small changes to the child's behavior.</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.11" 
                onScreen={onScreen}
                showOnScreens={[12]}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                     <p>That makes sense! So let's take it step by step, and see which
                        of the strategies we can eliminate using one of these criteria.</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.12" 
                onScreen={onScreen}
                showOnScreens={[13, 14, 15]}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                <p>Let's start by checking whether any of these strategies aren't likely to work on younger children.
                   Even if we only eliminate one of the seven, it'll be a start.</p>
            </ConversationMove>
            <ConversationMove 
                id="psych_sba.selectingAStrategy.move.13" 
                onScreen={onScreen}
                showOnScreens={[16, 17, 18]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                     <p>So the next thing we agreed to check on was which of these strategies makes sense for the babysitter to try.<br /><br />
                        It has to be something she can <b>change</b> while she is babysitting, not something that requires changes to
                        the child's or the family's usual habits and practices when the babysitter isn't there.</p>
            </ConversationMove>
              <ConversationMove 
                id="psych_sba.selectingAStrategy.move.14" 
                 onScreen={onScreen}
                 showOnScreens={[19,20,21,22]}
                 name="Annie"
                 imgURL="/TeamMemberTwo.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindow">
                     <p>OK, I've put together this table to show what we decided for each strategy based on the majority of our votes.<br /><br />
                        Incidentally, some of us got a response from the AI that said collaborative problem
                        solving wasn't completely feasible, because it requires intimate knowledge,
                        trust, and an ongoing relationship. But I think my friend has that kind of
                        relationship, so I've marked "collaborative problem solving" as feasible.</p> 
              </ConversationMove>
              <ConversationMove 
                id="psych_sba.selectingAStrategy.move.15" 
                 onScreen={onScreen}
                 showOnScreens={[20,21,22]}
                 name="JJ"
                 imgURL="/TeamMemberOne.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar3">
                   <p>That means we've narrowed down our choices to three:</p>
                   <ul>
                        <li>Positive Reinforcement</li>
                        <li>Empathy and Emotional Support</li>
                        <li>Collaborative Problem Solving</li>
                   </ul>
              </ConversationMove>
              <ConversationMove 
                id="psych_sba.selectingAStrategy.move.16" 
                 onScreen={onScreen}
                 showOnScreens={[21,22]}
                 name="Lin"
                 imgURL="/TeamMemberThree.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar2">
                       <p>Well, I guess we need to figure out which of these techniques works best. I remember from my psychology course
                          that these strategies are called "parenting techniques", and if you want to know how effective they are, you
                          look into their "effect size".</p>
              </ConversationMove>
              <ConversationMove 
                id="psych_sba.selectingAStrategy.move.17" 
                 onScreen={onScreen}
                 showOnScreens={[22]}
                 name="Annie"
                 imgURL="/TeamMemberTwo.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindow">
                     <p>Let's take a break then, and each of us do some research. Let's see what we can come up with!</p>
              </ConversationMove>
          </div>
          <ConversationMove 
             id="psych_sba.selectingAStrategy.move.18" 
             onScreen={onScreen}
             showOnScreens={[23,24]}
             name="JJ"
             imgURL="/TeamMemberOne.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar3">
               <p>I asked ChatGPT: "What are the short-term effect sizes for the following parenting techniques: 
                  positive reinforcement, empathy and emotional support, and collaborative problem solving?"</p>
               <p>When I ran it a few times, it consistently said <b>positive reinforcement</b> has <b>moderate to large</b>&nbsp; 
                  effect sizes, <b>empathy and emotional support</b> have <b>moderate</b> effect sizes, and <b>collaborative 
                  problem solving</b> has <b>small to moderate</b> effect sizes.</p>
               <p>If we're going with this, we should probably recommend that Annie's friend try positive
                  reinforcement to solve the kid's bedtime problem.</p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.selectingAStrategy.move.19" 
             onScreen={onScreen}
             showOnScreens={[24]}
             name="Lin"
             imgURL="/TeamMemberThree.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindowVar2">
                <p>Well, when I tried to get sources from the AI, they weren't helpful. So I went to Google Scholar
                   instead because that's a great place to look for research articles. At first a lot of the results
                   were irrelevant, but I finally had some luck when I typed in the following search:  <br /><br />
                   <i>What are the effect sizes for parenting techniques?</i><br /><br />
                   Look at the article that was at the top of the search!<br /><br />
                   <a href="https://www.jaacap.org/action/showPdf?pii=S0890-8567%2818%2931980-4" target="other">
                        What to teach parents to reduce disruptive child behavior: two meta-analyses of parenting program components</a><br /><br />
                   It actually looks at both long-term and short-term effects. When I dug into the details, I found a table that showed
                   a larger absolute effect size for positive reinforcement reducing problem behaviors than for empathy and problem-solving!
                </p>
          </ConversationMove>
          <ConversationMove 
             id="psych_sba.selectingAStrategy.move.20" 
             onScreen={onScreen}
             showOnScreens={[25]}
             name="Annie"
             imgURL="/TeamMemberTwo.jpg"
             maxHeight="40px"
             screenPercent="100%"
             className="conversationDark"
             pictureClass="imageWindow">
                 <p>I thought I would go old-school and simply use the subject index at the back of the textbook!<br /><br />
                    At first, the results were frustrating. The entries for "positive reinforcement" didn't say anything about how effective it was,
                    compared to anything else. Looking up emotion and empathy didn't lead me to anything useful, and I couldn't even find
                    "collaborative problem solving" in the index.<br /><br />
                    But then I looked for "parenting techniques". I found a section labeled, "Parent-child relationship", and
                    under that there was an entry, "operant conditioning, and". The "operant condiopning, and" part really means, "operant 
                    conditioning and the parent-child relationship". I remembered from when we were studying operant conditioning
                    that it works through positive (and also negative reinforcement), so I figured it was a good place to look,
                    especially since I couldn't find anything else that was relevant. Here's what the textbook says, on page 243:<br /><br />
                    <i>As we have seen, parents can learn from operant conditioning practices ... parents should remember the basic
                    rule of shaping: <b>Notice people doing something right and affirm them for it.</b> Give children attention and
                    other reinforcers when they are behaving <b>well</b> .... Target a specific behavior, reward it, and watch
                    it increase. When children misbehave, don't yell at them or hit them. Simply explain the misbehavior
                    and take away the screen time, remove a misused toy, or give a brief time-out.</i><br /><br />
                    Since operant conditioning (and hence positive and negative reinforcement) is pretty much the only advice the book gives about
                    childhood misbehavior, I think that confirms it. <b>Positive reinforcement</b> is what we should recommend!
                 </p>
          </ConversationMove>
         <SceneElement onScreen={onScreen} showOnScreens={[3]}>
             <div className="floatLeftHalf">
                 <LO_Radiobutton_SingleSelectionMultipleChoice
                     id='psych_sba.sleep_refusal_strategies'
                     form="psych_sba"
                     section={title}
                     stem="Which one of these possible strategies should we recommend to Annie's friend?"
                     directions=""
                     values={[1,2,3,4,5,6,7]}
                     labels={["Flexible Bedtime Routines","Positive Reinforcement","Gradual Fading",
                              "Empathy and Emotional Support","Natural Consequences with Limits",
                              "Environmental Adjustments","Collaborative Problem Solving"]}
                     divStyle="floatRightContentWindow"
                  />
              </div>
         </SceneElement>
         <SceneElement onScreen={onScreen} showOnScreens={[4]}>
             <div className="narrowFloatRightContentWindow">
                  <h3>Alternatives to Address Sleep Refusal</h3>
                  <p>Evidence-based strategies balance autonomy with structure, 
                     helping children feel both empowered and guided:</p>
                  <ol>
                      <li><b>Flexible Bedtime Routines</b></li>
                      <FlexibleBedtimeRoutineDetails />
                      <li><b>Positive Reinforcement</b></li>
                      <PositiveReinforcementDetails />
                  </ol>
             </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[5]}>
           <div className="narrowFloatRightContentWindow">
                <ol start="3">
                    <li><b>Gradual Fading</b></li>
                    <GradualFadingDetails />
                    <li><b>Empathy and Emotional Support</b></li>
                    <EmpathyAndEmotionalSupportDetails />
               </ol>
           </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[6]}>
          <div className="narrowFloatRightContentWindow">
              <ol start="5">
                  <li><b>Natural Consequences with Limits</b></li>
                  <NaturalConsequencesWithLimitsDetails />
                  <li><b>Environmental Adjustments</b></li>
                  <EnvironmentalAdjustmentDetails />
              </ol>
          </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[7]}>
           <div className="narrowFloatRightContentWindow">
               <ol start="7">
                   <li><b>Collaborative Problem-Solving</b></li>
                       <CollaborativeProblemSolvingDetails />
               </ol>
               <h3>Conclusion</h3>
               <p>While no-rules parenting may appeal to families seeking to avoid power struggles, 
                  its effectiveness for addressing sleep refusal is limited, especially in younger children.
                  Structured, evidence-based alternatives--such as flexible routines, positive reinforcement,
                  and gradual fading--are more consistently effective at promoting healthy sleep while
                  respecting a child's autonomy.</p>
           </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[14]}>
             <div className="floatRightNarrow">
                <div className="contentWindow">
                  <ConstructedResponse
                    id="psych_sba.age_appropriacy.explanation"
                    form="psych_sba"
                    section="Selecting a Strategy"
                    type="LO_TextOrSpeechInput"
                    stem="Why did you choose the strategy or strategies that you did? Explain."
                    directions="Put your answer in the box below."
                    className="large-input"
                    relatedVariables={["psych_sba.age_appropriacy.feedback"]}
                  />
                </div>
             </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[14, 15]}>
             <div className="floatLeftMedium">
               <div className="contentBox">
                 <SceneElement onScreen={onScreen} showOnScreens={[15]}>
                     <h3>You chose the following strategies:</h3>
                 </SceneElement>
                 <LO_Checkbox_MultipleSelectionMultipleChoice
                     id='psych_sba.age_appropriacy'
                     form="psych_sba"
                     section="Selecting a Strategy"
                     stem="Which of these strategies might not apply to a six-year-old?"
                     directions="Click 'Details' on each strategy to try to figure out if they might be appropriate for younger children.)"
                     values={[1,2,3,4,5,6,7]}
                     labels={["Flexible Bedtime Routines","Positive Reinforcement","Gradual Fading",
                              "Empathy and Emotional Support","Natural Consequences with Limits",
                              "Environmental Adjustments","Collaborative Problem Solving"]}
                     itemKeys={[0, 0, 0, 0, 1, 0, 0]}
                     refIDs = {["nfyc_h1","nfyc_h2","nfyc_h3","nfyc_h4","nfyc_h5","nfyc_h6","nfyc_h7"]}
                     editable={editable}
                     showKeys={showKeys}
                     showChecks={showChecks}
                     showUnchecked={showUnchecked}
                     showDetails={showDetails}
                     defaultValue=""
                     targetedVariables={["psych_sba.age_appropriacy.flexible_bedtime_routines",
                                         "psych_sba.age_appropriacy.positive_reinforcement",
                                         "psych_sba.age_appropriacy.gradual_fading",
                                         "psych_sba.age_appropriacy.empathy_and_emotional_support",
                                         "psych_sba.age_appropriacy.natural_consequences_with_limits",
                                         "psych_sba.age_appropriacy.environmental_adjustments",
                                         "psych_sba.age_appropriacy.collaborative_problem_solving"
                                       ]}
                     targetedValues={["Flexible Bedtime Routines","Positive Reinforcement","Gradual Fading",
                                      "Empathy and Emotional Support","Natural Consequences with Limits",
                                      "Environmental Adjustments","Collaborative Problem Solving"]}
                     targetedNotCheckedValue=""
                     style="checkbox"
                     relatedVariables={["psych_sba.age_appropriacy.feedback","psych_sba.age_appropriacy.explanation"]}
                     divClass="contentDiv">
                         <FlexibleBedtimeRoutineDetails />
                         <PositiveReinforcementDetails />
                         <GradualFadingDetails />
                         <EmpathyAndEmotionalSupportDetails />
                         <NaturalConsequencesWithLimitsDetails />
                         <EnvironmentalAdjustmentDetails />
                         <CollaborativeProblemSolvingDetails />
                 </LO_Checkbox_MultipleSelectionMultipleChoice>
                 <SceneElement onScreen={onScreen} showOnScreens={[15]}>
                     <br />
                     <h3>You offered the following explanation for your choices:</h3>
                     <StoreVariable id="psych_sba.age_appropriacy.explanation" />
                     <br />
                     <br />
                 </SceneElement>
               </div>
            </div>
        </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[15]}>
            <div className="floatRightMedium">
                <AIFeedback 
                  id="psych_sba.age_appropriacy.explanation"
                  target="psych_sba.age_appropriacy.feedback"
                  form="psych_SBA"
                  section="Selecting a Strategy"
                  systemPrompt="Hello. I am your psychology teaching assistant. How can I help you?"
                  promptButtonText="Click here to get AI feedback on your explanation"
                  promptPrefix={"DIRECTIONS:\
                      The student identified the following strategies for addressing sleep resistance in children as inappropriate for a six-year-old. STRATEGY OR STRATEGIES: \
                      " + psych_sba_age_appropriacy_bedtime_routines + ", \
                      " + psych_sba_age_appropriacy_positive_reinforcement + ", \
                      " + psych_sba_age_appropriacy_gradual_fading + ", \
                      " + psych_sba_age_appropriacy_empathy_and_emotional_support + ", \
                      " + psych_sba_age_appropriacy_natural_consequences_with_limits + ", \
                      " + psych_sba_age_appropriacy_environmental_adjustments + ", \
                      " + psych_sba_age_appropriacy_collaborative_problem_solving + ". \
                      The student justified choosing the items he or she had identified as follows: JUSTIFICATION: \
                      " + psych_sba_age_appropriacy_explanation}
                      promptSuffix="If the student's justification for his or her choice of strategy or strategies is blank or \
                                does not justify the listed strategy or strategies then say so and stop writing; \
                                if they suggest that all strategies are appropriate, tell them that natural consequences with \
                                limits are not appropriate for six year olds and explain why; otherwise, \
                                briefly for each strategy identified by the student evaluate \
                                whether the student's explanation justifies their inference that it is inappropriate for six year olds. \
                                Output your response in Markdown with at least one list bullet. Address the student as 'you' and 'your'. \
                                Do not discuss strategies that the student fails to mention. Do not \
                                discuss the directions. Do not provide a conclusion. Do not say you are stopping."
                  feedbackID="psych_sba.age_appropriacy.feedback" />
            </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[17]}>
             <div className="floatRightMedium">
                <div className="contentWindow">
                  <ConstructedResponse
                    id="psych_sba.feasibility.explanation"
                    form="psych_sba"
                    section="Selecting a Strategy"
                    type="LO_TextOrSpeechInput"
                    stem="Why did you choose the strategy or strategies that you did? Explain."
                    directions="Put your answer in the box below."
                    className="large-input"
                    relatedVariables={["psych_sba.age_appropriacy.feedback"]}
                  />
                </div>
             </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[17, 18]}>
             <div className="floatLeftMedium">
               <div className="contentBox">
                 <SceneElement onScreen={onScreen} showOnScreens={[18]}>
                     <h3>You chose the following strategies:</h3>
                 </SceneElement>
                 <LO_Checkbox_MultipleSelectionMultipleChoice
                     id='psych_sba.feasibility'
                      form="psych_sba"
                     section="Selecting a Strategy"
                     stem="Which of these strategies could the babysitter implement effectively?"
                     directions="Click 'Details' on each strategy to try to figure out if the babysitter could implement them.)"
                     values={[1,2,3,4,5,6,7]}
                     labels={["Flexible Bedtime Routines","Positive Reinforcement","Gradual Fading",
                              "Empathy and Emotional Support","Natural Consequences with Limits",
                              "Environmental Adjustments","Collaborative Problem Solving"]}
                     itemKeys={[0, 1, 0, null, 0, 0, null]}
                     refIDs = {["feas_h1","feas_h2","feas_h3","feas_h4","feas_h5","feas_h6","feas_h7"]}
                     defaultValue=""
                     targetedVariables={["psych_sba.feasibility.flexible_bedtime_routines",
                                        "psych_sba.feasibility.positive_reinforcement",
                                        "psych_sba.feasibility.gradual_fading",
                                        "psych_sba.feasibility.empathy_and_emotional_support",
                                        "psych_sba.feasibility.natural_consequences_with_limits",
                                        "psych_sba.feasibility.environmental_adjustments",
                                        "psych_sba.feasibility.collaborative_problem_solving"
                                       ]}
                     targetedValues={["Flexible Bedtime Routines","Positive Reinforcement","Gradual Fading",
                                      "Empathy and Emotional Support","Natural Consequences with Limits",
                                      "Environmental Adjustments","Collaborative Problem Solving"]}
                     targetedNotCheckedValue=""
                     editable={editable}
                     showKeys={showKeys}
                     showChecks={showChecks}
                     showUnchecked={showUnchecked}
                     showDetails={showDetails}
                     style="checkbox"
                     relatedVariables={["psych_sba.feasibility.feedback","psych_sba.feasibility.explanation"]}
                     divClass="contentDiv">
                        <FlexibleBedtimeRoutineDetails />
                        <PositiveReinforcementDetails />
                        <GradualFadingDetails />
                        <EmpathyAndEmotionalSupportDetails />
                        <NaturalConsequencesWithLimitsDetails />
                        <EnvironmentalAdjustmentDetails />
                        <CollaborativeProblemSolvingDetails />
                 </LO_Checkbox_MultipleSelectionMultipleChoice>
                 <SceneElement onScreen={onScreen} showOnScreens={[18]}>
                     <br />
                     <h3>You offered the following explanation for your choices:</h3>
                     <StoreVariable id="psych_sba.feasibility.explanation" />
                     <br />
                     <br />
                 </SceneElement>
               </div>
            </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[18]}>
            <div className="floatRightNarrow">
              <AIFeedback 
                id="psych_sba.feasibility.explanation"
                target="psych_sba.feasibility.feedback"
                form="psych_SBA"
                section="Using AI"
                systemPrompt="Hello. I am your psychology teaching assistant. How can I help you?"
                promptButtonText="Click here to get AI feedback on your explanation"
                promptPrefix={"DIRECTIONS:\
                    The student identified the following list of strategies for addressing sleep resistance in children as feasible for the babysitter to implement: \
                    " + psych_sba_feasibility_bedtime_routines + ", \
                    " + psych_sba_feasibility_positive_reinforcement + ", \
                    " + psych_sba_feasibility_gradual_fading + ", \
                    " + psych_sba_feasibility_empathy_and_emotional_support + ", \
                    " + psych_sba_feasibility_natural_consequences_with_limits + ", \
                    " + psych_sba_feasibility_environmental_adjustments + ", \
                    " + psych_sba_feasibility_collaborative_problem_solving + ". \
                        The student justified choosing the items he or she had identified as follows: JUSTIFICATION: \
                    " + psych_sba_feasibility_explanation}
                promptSuffix="If the student's justification \
                              does not provide evidence supporting at least one of the listed strategies as feasible for the babysitter to implement \
                              by actions taken during the babysitting session then say so and stop writing; otherwise, \
                              briefly only for any strategy identified by the student evaluate for each listed strategy \
                              whether the student's justification justifies their inference that it is feasible for the babysitter to implement. \
                    Output your response in Markdown with at least onelist bullet. Do not discuss strategies that the student fails to mention. Do not provide a conclusion.  Do not say you are stopping. "
                    feedbackID="psych_sba.feasibility.feedback" />
            </div>
       </SceneElement>
       <SceneElement onScreen={onScreen} showOnScreens={[19, 20, 21, 22]}>
            <div className="floatRightHalf">
             <table className="contentWindow">
              <thead>
                <tr className="tableHeader">
                  <td className="tableHeaderColumn">Strategy</td>
                  <td className="tableCell">Age Appropriate</td>
                  <td className="tableCell">Feasible</td>
                </tr>
              </thead>
              <tbody>
                <tr className="oddTableRow">
                  <td className="tableHeaderColumn">Flexible Bedtimes</td>
                  <td className="tableCell">&#x2713;</td>
                  <td className="tableCell"></td>
                </tr>
                <tr className="evenTableRow">
                  <td className="tableHeaderColumn">Positive Reinforcement</td>
                  <td className="tableCell">&#x2713;</td>
                  <td className="tableCell">&#x2713;</td>
                </tr>
                <tr className="oddTableRow">
                  <td className="tableHeaderColumn">Gradual Fading</td>
                  <td className="tableCell">&#x2713;</td>
                  <td className="tableCell"></td>
                </tr>
                <tr className="evenTableRow">
                  <td className="tableHeaderColumn">Empathy and Emotional Support</td>
                  <td className="tableCell">&#x2713;</td>
                  <td className="tableCell">&#x2713;</td>
                </tr>
                <tr className="oddTableRow">
                  <td className="tableHeaderColumn">Natural Consequences with Limits</td>
                  <td className="tableCell"></td>
                  <td className="tableCell"></td>
                </tr>
                <tr className="evenTableRow">
                  <td className="tableHeaderColumn">Environmental Adjustments</td>
                  <td className="tableCell">&#x2713;</td>
                  <td className="tableCell"></td>
                </tr>
                <tr className="oddTableRow">
                  <td className="tableHeaderColumn">Collaborative Problem Solving</td>
                  <td className="tableCell">&#x2713;</td>
                  <td className="tableCell">&#x2713;</td>
                </tr>
              </tbody>
             </table>
            </div>
       </SceneElement>
    </Scene>
  );
}