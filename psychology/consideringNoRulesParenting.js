import { React, useState, useRef, useEffect,useCallback } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useComponentSelector } from '../../lo_components/utils.js';
import { LO_SpeechButton, ConversationMove, Scene, SceneElement,
         TabComponent, ConstructedResponse, AIFeedback } from '../../lo_components/components.js';
import {NoRulesParenting} from '../../content/psychology/texts/norulesparenting.js';

function pickClass(onScreen) {
     if (onScreen==7 || onScreen==8 || onScreen==9) {
         return "floatLeftMedium";
     } else {
         return "floatLeftNarrow";
     }
}

export function ConsideringNoRulesParenting({onScreen}) {
  const title="Considering No-Rules Parenting";
  return (
       <Scene id="psych_sba.consideringNoRulesParenting" onScreen={onScreen} title={title}>
      <div className={pickClass(onScreen)}>
              <ConversationMove 
                  id="psych_sba.consideringNoRulesParenting.move.1" 
                  onScreen={onScreen}
                  showOnScreens={[1]}
                  name="Lin"
                  imgURL="/TeamMemberThree.jpg"
                  maxHeight="40px"
                  screenPercent="100%"
                  className="conversationDark"
                  pictureClass="imageWindowVar2">
                       <p>Good job, Annie! That's a lot of content. I guess we had better
                          each go over it before we discuss it.</p>
              </ConversationMove>
              <ConversationMove 
                  id="psych_sba.consideringNoRulesParenting.move.2" 
                  onScreen={onScreen}
                  showOnScreens={[2]}
                  name="JJ"
                  imgURL="/TeamMemberOne.jpg"
                  maxHeight="40px"
                  screenPercent="100%"
                  className="conversationDark"
                  pictureClass="imageWindowVar3">
                     <p>This research is amazing!</p>
              </ConversationMove>
              <ConversationMove 
                  id="psych_sba.consideringNoRulesParenting.move.3" 
                  onScreen={onScreen}
                  showOnScreens={[3]}
                  name="Annie"
                  imgURL="/TeamMemberTwo.jpg"
                  maxHeight="40px"
                  screenPercent="100%"
                  className="conversationDark"
                  pictureClass="imageWindow">
                      <p>It is a lot. I actually had to ask the question several different ways to get
                         all of the information I found. Sometimes small differences in the way I asked
                         the question got me a very different answer.
                      </p>
              </ConversationMove>
              <ConversationMove 
                  id="psych_sba.consideringNoRulesParenting.move.4" 
                  onScreen={onScreen}
                  showOnScreens={[3]}
                  name="JJ"
                  imgURL="/TeamMemberOne.jpg"
                  maxHeight="40px"
                  screenPercent="100%"
                  className="conversationDark"
                  pictureClass="imageWindowVar3">
                     <p>So much for "do nothing" lol. It seems like there's a lot more evidence against no-rules parenting than for it.  </p>
              </ConversationMove>
              <ConversationMove 
                  id="psych_sba.consideringNoRulesParenting.move.5" 
                 onScreen={onScreen}
                 showOnScreens={[4,5,6]}
                 name="Lin"
                 imgURL="/TeamMemberThree.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar2">
                      <p>I agree with JJ. Annie, since your friend is about ready to give up,
                         maybe we should put together an email that explains why giving up
                         and going with no-rules parenting (and no bedtime) would be a bad idea.</p>
              </ConversationMove>
              <ConversationMove 
                  id="psych_sba.consideringNoRulesParenting.move.6" 
                  onScreen={onScreen}
                  showOnScreens={[5,6]}
                  name="Annie"
                  imgURL="/TeamMemberTwo.jpg"
                  maxHeight="40px"
                  screenPercent="100%"
                  className="conversationDark"
                  pictureClass="imageWindow">
                      <p>All right. Once we write that, we can look into what we have learned about
                         effective methods to set a consistent bedtime, and add that to our email.
                      </p>
              </ConversationMove>
             <ConversationMove 
                 id="psych_sba.scene.move1" 
                 onScreen={onScreen}
                 showOnScreens={[7, 8, 9]}
                 name="Annie"
                 imgURL="/TeamMemberTwo.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindow">
                     <p>To make sure that our email is really good, let's get some feedback from AI. 
                        If we need to improve our email, we can go back and change the text, then get more feedback.
                     </p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.scene.7.move2" 
                onScreen={onScreen}
                showOnScreens={[8, 9]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>Here's the prompt I wrote for us to try to get feedback from AI. It took a bit of
                      work to make it precise enough to give us targeted feedback:</p><br />
                   <p><i>Here is an email I wrote to explain to a friend why they need to avoid a no-rules
                     parenting approach and find a good strategy to get a six-year-old child to bed on time.</i></p>
                     <p><i>Briefly,
                     in no more than two or three sentences, evaluate how well I have used evidence from psychology
                     to support this argument (but restricting that feedback to feedback that is appropriate given
                     the purpose of the email).</i></p>
             </ConversationMove>
          </div>
          <SceneElement onScreen={onScreen} showOnScreens={[1]}>
              <div className="narrowFloatRightContentWindow">
                  <p>"No-rules parenting," or "permissive parenting," is an approach where parents avoid setting
                     firm boundaries and rules, often seeking to be very lenient in their child's behavior, including
                     sleep routines. While this style might seem appealing in some ways, there is limited evidence
                     to support its effectiveness in promoting healthy behaviors like sleep habits. In fact, research
                     generally favors more structured approaches to sleep and behavior management. Below is
                     the evidence regarding <b>no-rules parenting</b> and <b>alternatives</b> for addressing sleep refusal.
                  </p><br />
                  <h3>Evidence For and Against No-Rules Parenting to Address Sleep Refusal</h3>
                  <ol>
                      <li><b>Child-Led Autonomy</b></li>
                      <ul>
                          <li><b>Claim</b>: Allowing children to choose when to sleep can foster autonomy,
                                               reducing bedtime power struggles and increasing intrinsic motivation to rest.</li>
                          <li><b>Evidence and Counterevidence:</b></li>
                          <ul>
                             <li>Studies on self-determination theory suggest that giving children choices promotes
                                 a sense of control, potentially reducing defiance.</li>
                             <li>However, young children often lack the biological and cognitive maturity to make 
                                 health-conscious decisions about sleep. Sleep research shows that inconsistent 
                                 schedules can disrupt circadian rhythms, leading to insufficient or fragmented sleep.</li>
                          </ul>
                      </ul>
                  </ol>
             </div>
         </SceneElement>
         <SceneElement onScreen={onScreen} showOnScreens={[2]}>
            <div className="narrowFloatRightContentWindow">
              <ol start="2">
                  <li><b>Natural Consequences</b></li>
                  <ul><li><b>Claim:</b> Experiencing the effects of insufficient sleep (e.g., feeling tired) could 
                             motivate a child to adjust bedtime without external pressure.</li>
                      <li><b>Evidence and CounterEvidence:</b></li>
                      <ul>
                         <li>Natural consequences are more effective for older children and adolescents
                             who can connect cause and effect.</li>
                         <li>However, younger children may not link fatigue with staying up late and could experience
                             negative effects like irritability, reduced focus, and weakened immune function.</li>
                      </ul>
                  </ul>
                  <li><b>Reduced Stress Around Sleep</b></li>
                  <ul>
                      <li><b>Claim:</b> Removing strict bedtime rules may create a relaxed environment, 
                             making it easier for children to fall asleep naturally.</li>
                      <li><b>Evidence and Counterevidence:</b></li>
                      <ul>
                         <li>Stress and anxiety are known to interfere with sleep onset.</li>
                         <li>However, research suggests that structured bedtime routines reduce cortisol
                             levels and promote melatonin release, facilitating better sleep.</li>
                      </ul>
                  </ul>
              </ol>
             </div>
         </SceneElement>
         <SceneElement onScreen={onScreen} showOnScreens={[3]}>
            <div className="narrowFloatRightContentWindow">
                 <ol start="4">
                      <li><b>Parental Responsiveness</b></li>
                      <ul>
                          <li><b>Claim:</b> Prioritizing connection and meeting the child's needs (e.g., 
                                               through co-sleeping or comforting) can improve emotional security, 
                                               reducing sleep resistance.</li>
                          <li><b>Evidence and Counterevidence:</b></li>
                          <ul>
                              <li>Attachment-based approaches can improve sleep quality by addressing
                                  underlying anxieties or fears.</li>
                              <li>However, overly permissive approaches without structure may inadvertently 
                                  reinforce avoidance behaviors.</li>
                          </ul>
                      </ul>
                 </ol>
                 <h3>Challenges of No-Rules Parenting for Sleep Refusal</h3>
                 <ul>
                     <li><b>Inconsistent Sleep Patterns:</b> A lack of structure can lead to irregular sleep, 
                            which is associated with behavioral and cognitive challenges.</li>
                     <li><b>Delayed Sleep Onset:</b> Without a set bedtime, children may stay awake longer, 
                            disrupting their natural sleep-wake cycles.</li>
                     <li><b>Parental Burnout</b>: Allowing children to dictate bedtime can result in extended
                            negotiations and increased nighttime disruptions.</li>
                 </ul>
             </div>
         </SceneElement>
         <SceneElement onScreen={onScreen} showOnScreens={[6]}>
             <TabComponent id="leftEmailTab">
                 <TabList>
                     <Tab>Email</Tab>
                     <Tab>Annie's Summary</Tab>
                 </TabList>
                 <TabPanel>
                     <div className="narrowFloatRightContentWindow">
                          <ConversationMove 
                              id="psych_sba.draft_email.move"
                              name="You"
                              imgURL="/self.png"
                              maxHeight="30px"
                              screenPercent="100%"
                              className="conversationLightFlex"
                              pictureClass="imageWindowVar1"> 
                                  <ConstructedResponse
                                      id="psych_sba.email_to_babysitter"
                                      form="psych_sba"
                                      section={title}
                                      type="LO_TextOrSpeechInput"
                                      stem="Draft an email Annie can use to explain to her friend why, since no-rules parenting is a bad idea,
                                            she should figure out an effective bedtime strategy for her 6-year-old."
                                            directions="Put your answer in the box below. You can go back to review the arguments and evidence
                                            on prior screens."
                                      className="wide-input"
                                  />
                          </ConversationMove>
                     </div>
                 </TabPanel>
                 <TabPanel>
                     <div className="narrowFloatRightContentWindow">
                         <NoRulesParenting />
                     </div>
                 </TabPanel>
             </TabComponent>
         </SceneElement>
         <SceneElement onScreen={onScreen} showOnScreens={[9]}>
             <div className="floatRightMediumWide">
                  <div className="contentBox">
                      <ConstructedResponse 
                          id="psych_sba.email_to_babysitter"
                          form="psych_sba"
                          section={title}
                          type="LO_TextOrSpeechInput"
                          stem="An email Annie can use to explain to her friend why GIVING UP IS A BAD IDEA "
                          directions="You can edit this email, if you would like to, before you submit it for AI feedback.
                                      Then, you can revise it again based on the AI feedback."
                         className="wide-input"
                      />
                  </div><br />
                  <AIFeedback 
                    id="psych_sba.email_to_babysitter"
                    target="psych_sba.email_feedback"
                    form="psych_SBA"
                    section={title}
                    systemPrompt="Hello. I am your psychology teaching assistant. How can I help you?"
                    promptButtonText="Click here to get AI Feedback"
                    promptPrefix="This is an email I wrote to explain to a friend why they need to avoid a no-rules \
                             parenting approach and find a good strategy to get a six-year-old child to bed on time. \
                             MY EMAIL SAYS: "
                    promptSuffix="PLEASE FOLLOW THESE DIRECTIONS: \
                             If my email is missing, meaningless, filler content, incomplete, or irrelevant to my purpose then say so and stop writing; otherwise, \
                             briefly, in no more than two or three sentences, evaluate how well I have used evidence from psychology \
                             to support this argument (but restricting that feedback to feedback that is appropriate given \
                             the purpose of the email). If my response seems strong, don't provide any suggestions for improvement! \
                             Output your response in Markdown. Address the writer as 'you' or 'your'. Don't mention my instructions. \
                             The response should should begin with the following phrase in normal size bold font: 'AI Feedback'."
                    feedbackID="psych_sba.email_feedback" />
              </div>
         </SceneElement>
     </Scene>
    );}

