import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { LO_SpeechButton, Scene, SceneElement, ConversationMove, 
         LO_Radiobuttons, LO_Radiobutton, LO_Table_Of_Radiobutton_Questions, 
         Stem, Directions } from '../../lo_components/components.js';
import { Feedback_1_to_5 } from '../../content/psychology/texts/questions1to5_feedback.js';
import { Feedback_6_to_10 } from '../../content/psychology/texts/questions6to10_feedback.js';
import { Feedback_11_to_15 } from '../../content/psychology/texts/questions11to15_feedback.js';
import { Feedback_16_to_20 } from '../../content/psychology/texts/questions16to20_feedback.js';

export function Quiz2({onScreen, editable, showKeys, showChecks, showUnchecked}) {
  const quiz2_total = useComponentSelector("quiz2_total", s => s?.value ?? 0);
  const quiz2_percent = Math.round(quiz2_total/20*100);
  const annie2_percent = useComponentSelector("annie_percent", s => s?.value);
  const jj2_percent = useComponentSelector("jj_percent", s => s?.value);
  const lin2_percent = useComponentSelector("lin_percent", s => s?.value);

  return (
      <Scene id="psych_sba.quiz.2" onScreen={onScreen} title="Quiz 2: Positive and Negative Reinforcement and Punishment">
          <div className="floatLeftNarrowPlus">
              <ConversationMove 
                 id="psych_sba.quiz.2.move.1" 
                 onScreen={onScreen}
                 showOnScreens={[1, 2, 3]}
                 name="Lin"
                 imgURL="/TeamMemberThree.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar2">
                   <p>Hey everyone -- the TA just told me the quiz we took is a simplified version of the full quiz he gave in past years.</p>
                   <p>Let's try the full version of the quiz, where we have to decide not only if something is reinforcement or punishment,
                     but if it's positive reinforcement, negative reinforcement, positive punishment, or negative punishment.</p>
              </ConversationMove>
              <ConversationMove 
                 id="psych_sba.quiz.2.move.2" 
                 onScreen={onScreen}
                 showOnScreens={[2, 3]}
                 name="JJ"
                 imgURL="/TeamMemberOne.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar3">
                  <p>I'm game.</p>
              </ConversationMove>
              <ConversationMove 
                 id="psych_sba.quiz.2.move.3" 
                 onScreen={onScreen}
                 showOnScreens={[3]}
                 name="Annie"
                 imgURL="/TeamMemberTwo.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindow">
                  <p>I am, too. Let's give it a try!</p>
              </ConversationMove>
              <ConversationMove 
                 id="psych_sba.quiz.2.move.4" 
                 onScreen={onScreen}
                 showOnScreens={[4]}
                 name="Lin"
                 imgURL="/TeamMemberThree.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar2">
                    <p>Here are the first five questions on the quiz.</p>
              </ConversationMove>
              <ConversationMove 
                 id="psych_sba.quiz.2.move.5" 
                 onScreen={onScreen}
                 showOnScreens={[5]}
                 name="Lin"
                 imgURL="/TeamMemberThree.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar2">
                    <p>Here are the questions six through ten on the quiz.</p>
              </ConversationMove>
              <ConversationMove 
                 id="psych_sba.quiz.2.move.6" 
                 onScreen={onScreen}
                 showOnScreens={[6]}
                 name="Lin"
                 imgURL="/TeamMemberThree.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar2">
                    <p>Here are the questions eleven through fifteen on the quiz.</p>
              </ConversationMove>
              <ConversationMove 
                 id="psych_sba.quiz.2.move.7" 
                 onScreen={onScreen}
                 showOnScreens={[7]}
                 name="Lin"
                 imgURL="/TeamMemberThree.jpg"
                 maxHeight="40px"
                 screenPercent="100%"
                 className="conversationDark"
                 pictureClass="imageWindowVar2">
                    <p>Here are the questions sixteen through twenty on the quiz.</p>
              </ConversationMove>
              <ConversationMove 
                id="psych_sba.quiz.2.move.8" 
                onScreen={onScreen}
                showOnScreens={[8,9]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>Here is how we did on the quiz.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.9" 
                onScreen={onScreen}
                showOnScreens={[9]}
                showCondition={quiz2_percent<80}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                    <p>Looks like it's probably a good idea to review the correct answers!
                       We weren't as accurate as I'd like.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.9" 
                onScreen={onScreen}
                showOnScreens={[9]}
                showCondition={quiz2_percent>=80}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                    <p>Good job, everyone!</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.10" 
                onScreen={onScreen}
                showOnScreens={[10]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>Do you guys want to review the answers? Sometimes it helps to review, even if you got most of the answers right.</p>
             </ConversationMove>
             <ConversationMove 
               id="psych_sba.quiz.2.move.11" 
               onScreen={onScreen}
               showOnScreens={[10]}
               name="You"
               imgURL="/self.png"
               maxHeight="40px"
               screenPercent="100%"
               className="conversationLightFlex"
               pictureClass="imageWindowVar3">
                 <Stem>Indicate whether you want to review the correct answers.</Stem>
                 <LO_Radiobuttons id="psych_sba.review_item">
                     <LO_Radiobutton
                         id="psych_sba.review2.yes"
                         form="psych_sba"
                         section="Selecting a Strategy"
                         group_id="psych_sba.review2"
                         stem="Indicate whether you want to review the correct answers."
                         value={1}
                         label="Yes"
                     />
                     <LO_Radiobutton
                         id="psych_sba.review2.no"
                         form="psych_sba"
                         section="Selecting a Strategy"
                         stem="Indicate whether you want to review the correct answers."
                         group_id="psych_sba.review2"
                         value={2}
                         label="No"
                     />
                 </LO_Radiobuttons>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.12" 
                onScreen={onScreen}
                showOnScreens={[11]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>Here are the answers to the first five questions on the quiz.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.12b" 
                onScreen={onScreen}
                showOnScreens={[12]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>And here are the TA's explanations for the first five questions.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.13" 
                onScreen={onScreen}
                showOnScreens={[13]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>Here are the answers to questions six through ten on the quiz.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.13b" 
                onScreen={onScreen}
                showOnScreens={[14]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>And here are the TA's explanations for questions six through ten.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.14" 
                onScreen={onScreen}
                showOnScreens={[15]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>Here are the answers to questions eleven through fifteen on the quiz.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.14b" 
                onScreen={onScreen}
                showOnScreens={[16]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>And here are the TA's explanations for questions eleven through fifteen.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.14b" 
                onScreen={onScreen}
                showOnScreens={[16]}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                   <p>Number 11 confused me because it seemed like something positive was taken away.
                      Maybe his father usually smiled and was happy and then when Michael stood,
                      that smile was taken away. But then I realized that something was added to
                      the situation after he stood which makes it positive. The frown and glare
                      are just like the father saying no in a stern voice after an undesirable
                      behavior, so it’s adding something undesirable. I was also confused about
                      the sitting versus standing parts. Because you can't stand and sit at the
                      same time, standing up less meant staying in his seat more, so I thought
                      it might be reinforcement of the sitting. However, I realized that what was
                      discouraged was the standing. If it decreases the likelihood, psychologists
                      call it punishment, and that applies here.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.15" 
                onScreen={onScreen}
                showOnScreens={[17]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>Here are the answer to the questions sixteen through twenty on the quiz.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.15b" 
                onScreen={onScreen}
                showOnScreens={[18]}
                name="Lin"
                imgURL="/TeamMemberThree.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindowVar2">
                   <p>And here are the TA's explanations for the questions sixteen through twenty.</p>
             </ConversationMove>
             <ConversationMove 
                id="psych_sba.quiz.2.move.16b" 
                onScreen={onScreen}
                showOnScreens={[18]}
                name="Annie"
                imgURL="/TeamMemberTwo.jpg"
                maxHeight="40px"
                screenPercent="100%"
                className="conversationDark"
                pictureClass="imageWindow">
                   <p>Number 20 was particularly tricky--in part because the situation referred to a 
                      punishment in the past. On the other hand, the reference to punishment was a hint.
                      We have to assume that Amelia liked participating in group activities in the past.
                      Maybe a teacher excluded her in the past following some inappropriate behavior,
                      such as being disruptive, and the teacher's intent may have been to decrease that
                      inappropriate behavior. Because she had something that she liked taken away by being
                      excluded in the past, she learned that she really did not want to participate in the
                      group after all. Essentially, she was discouraged from participating by having
                      participation taken away.</p>
             </ConversationMove>
          </div>
          <div className="floatRightWideNoMargin">
              <SceneElement onScreen={onScreen} showOnScreens={[4, 11]}>
                  <LO_Table_Of_Radiobutton_Questions
                       id="psych_sba.positive_negative.1"
                       form="psych_sba"
                       section="Understanding Reinforcement and Punishment"
                       overallStem="What kind of punishment or reinforcement do these statements represent?"
                       directions="Indicate your answer by clicking in the appropriate column."
                       ids={['psych_sba.positive_negative.liam',
                             'psych_sba.positive_negative.daniel',
                             'psych_sba.positive_negative.lucas',
                             'psych_sba.positive_negative.nicole',
                             'psych_sba.positive_negative.victoria']}
                       itemKeys={[1, 2, 3, 4, 2]}
                       values={[1,2,3,4]}
                       labels={["Positive Reinforcement", "Negative Reinforcement", "Positive Punishment", "Negative Punishment"]}
                       suppressLabel={1}
                       editable={editable}
                       showKeys={showKeys}
                       showChecks={showChecks}
                       showUnchecked={showUnchecked}                       
                       categoryLabel="Strategy"
                       className="wideFloatRightContentWindow"
                       headerRowClass="tableHeader"
                       evenRowClass="evenTableRow"
                       oddRowClass="oddTableRow">
                     <span>1. Liam reads a book every night because he earns a sticker for each completed book.</span>
                     <span>2. Daniel puts away his toys so his parents will stop asking him to clean up.</span>
                     <span>3. Lucas stops touching the hot stove after he accidentally burns his hand.</span>
                     <span>4. Nicole avoids showing her homework to her parents because they reduce her screen time when it's incomplete.</span>
                     <span>5. Victoria throws a tantrum at dinner to get out of eating her vegetables.</span>
                  </LO_Table_Of_Radiobutton_Questions>
              </SceneElement>
              <SceneElement onScreen={onScreen} showOnScreens={[12]}>
                  <Feedback_1_to_5 className="wideFloatRightContentWindow" />
              </SceneElement>
              <SceneElement onScreen={onScreen} showOnScreens={[5, 13]}>
                  <LO_Table_Of_Radiobutton_Questions
                       id="psych_sba.positive_negative.2"
                       form="psych_sba"
                       section="Understanding Reinforcement and Punishment"
                       overallStem="What kind of punishment or reinforcement do these statements represent?"
                       directions="Indicate your answer by clicking in the appropriate column."
                       ids={['psych_sba.positive_negative.mia',
                             'psych_sba.positive_negative.matthew',
                             'psych_sba.positive_negative.noah',
                             'psych_sba.positive_negative.layla',
                             'psych_sba.positive_negative.william']}
                       itemKeys={[1, 2, 1, 1, 2]}
                       values={[1,2,3,4]}
                       labels={["Positive Reinforcement", "Negative Reinforcement", "Positive Punishment", "Negative Punishment"]}
                       suppressLabel={1}
                       editable={editable}
                       showKeys={showKeys}
                       showChecks={showChecks}
                       showUnchecked={showUnchecked}                       
                       categoryLabel="Strategy"
                       className="wideFloatRightContentWindow"
                       headerRowClass="tableHeader"
                       evenRowClass="evenTableRow"
                       oddRowClass="oddTableRow">
                     <span>6. Mia whines at the store because her parents give her candy to quiet her.</span>
                     <span>7. Matthew makes his bed every morning so his mom doesn't get upset.</span>
                     <span>8. Noah practices the piano daily because his parents cheer him on after each session.</span>
                     <span>9. Layla scribbles on walls because her sibling laughs and calls her "an artist."</span>
                     <span>10. William follows playground rules so he doesn't lose recess time.</span>
                  </LO_Table_Of_Radiobutton_Questions>
              </SceneElement>
              <SceneElement onScreen={onScreen} showOnScreens={[14]}>
                  <Feedback_6_to_10 className="wideFloatRightContentWindow" />
              </SceneElement>          
              <SceneElement onScreen={onScreen} showOnScreens={[6, 15]}>
                  <LO_Table_Of_Radiobutton_Questions
                       id="psych_sba.positive_negative.3"
                       form="psych_sba"
                       section="Understanding Reinforcement and Punishment"
                       overallStem="What kind of punishment or reinforcement do these statements represent?"
                       directions="Indicate your answer by clicking in the appropriate column."
                       ids={['psych_sba.positive_negative.michael',
                             'psych_sba.positive_negative.luna',
                             'psych_sba.positive_negative.benjamin',
                             'psych_sba.positive_negative.nathan',
                             'psych_sba.positive_negative.jackson']}
                       itemKeys={[3, 4, 3, 3, 4]}
                       values={[1,2,3,4]}
                       labels={["Positive Reinforcement", "Negative Reinforcement", "Positive Punishment", "Negative Punishment"]}
                       suppressLabel={1}
                       editable={editable}
                       showKeys={showKeys}
                       showChecks={showChecks}
                       showUnchecked={showUnchecked}                       
                       categoryLabel="Strategy"
                       className="wideFloatRightContentWindow"
                       headerRowClass="tableHeader"
                       evenRowClass="evenTableRow"
                       oddRowClass="oddTableRow">
                      <span>11. Michael stays seated during meals after his father frowns and glares at him every time he stands up.</span>
                      <span>12. Luna stops asking questions in class because her teacher never calls on her to speak.</span>
                      <span>13. Benjamin stops throwing toys after being told firmly that it's unacceptable.</span>
                      <span>14. Nathan stops interrupting when his teacher starts making him sit in a "quiet corner."</span>
                      <span>15. Jackson doesn't try new foods because his favorite dessert was once removed for refusing broccoli.</span>
                  </LO_Table_Of_Radiobutton_Questions>
              </SceneElement>
              <SceneElement onScreen={onScreen} showOnScreens={[16]}>
                  <Feedback_11_to_15 className="wideFloatRightContentWindow" />
              </SceneElement>
              <SceneElement onScreen={onScreen} showOnScreens={[7, 17]}>
                  <LO_Table_Of_Radiobutton_Questions
                       id="psych_sba.positive_negative.4"
                       form="psych_sba"
                       section="Understanding Reinforcement and Punishment"
                       overallStem="What kind of punishment or reinforcement do these statements represent?"
                       directions="Indicate your answer by clicking in the appropriate column."
                       ids={['psych_sba.positive_negative.charlotte',
                             'psych_sba.positive_negative.aiden',
                             'psych_sba.positive_negative.jack',
                             'psych_sba.positive_negative.chloe',
                             'psych_sba.positive_negative.amelia']}
                       itemKeys={[1, 2, 1, 3, 4]}
                       values={[1,2,3,4]}
                       labels={["Positive Reinforcement", "Negative Reinforcement", "Positive Punishment", "Negative Punishment"]}
                       suppressLabel={1}
                       editable={editable}
                       showKeys={showKeys}
                       showChecks={showChecks}
                       showUnchecked={showUnchecked}                       
                       categoryLabel="Strategy"
                       className="wideFloatRightContentWindow"
                       headerRowClass="tableHeader"
                       evenRowClass="evenTableRow"
                       oddRowClass="oddTableRow">
                  <span>16. Charlotte organizes her desk because she earns a "Super Organized" badge from her teacher for doing so.</span>
                  <span>17. Aiden studies for tests to avoid being grounded for poor grades.</span>
                  <span>18. Jack refuses to put on his shoes until his parent offers a snack as a bribe.</span>
                  <span>19. Chloe stops playing with scissors after being told by her teacher.</span>
                  <span>20. Amelia refuses to participate in group activities after being excluded as punishment in the past.</span>
                  </LO_Table_Of_Radiobutton_Questions>
              </SceneElement>
              <SceneElement onScreen={onScreen} showOnScreens={[18]}>
                  <Feedback_16_to_20 className="wideFloatRightContentWindow" />
              </SceneElement>
              <SceneElement onScreen={onScreen} showOnScreens={[8, 9]}>
                  <table className="veryNarrow">
                    <thead>
                      <tr className="tableHeader">
                        <td className="tableHeaderColumn">Name</td>
                        <td className="tableCell">Score</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="oddTableRow">
                         <td className="tableHeaderColumn">Annie</td>
                        <td className="tableCell">{annie2_percent}</td>
                      </tr>
                      <tr className="evenTableRow">
                        <td className="tableHeaderColumn">JJ</td>
                        <td className="tableCell">{jj2_percent}</td>
                      </tr>
                     <tr className="oddTableRow">
                        <td className="tableHeaderColumn">Lin</td>
                        <td className="tableCell">{lin2_percent}</td>
                      </tr>
                      <tr className="evenTableRow">
                        <td className="tableHeaderColumn">You</td>
                        <td className="tableCell">{quiz2_percent}</td>
                      </tr>
                    </tbody>
                  </table>
              </SceneElement>
          </div>
      </Scene>
)};