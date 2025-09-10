import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../lo_components/utils.js';
import { LO_SpeechButton, Scene, SceneElement, ConversationMove, 
         LO_Radiobuttons, LO_Radiobutton, LO_Table_Of_Radiobutton_Questions, 
         Stem, Directions } from '../../lo_components/components.js';

export function Quiz1({onScreen, editable, showKeys, showChecks, showUnchecked}) {
  const quiz_total = useComponentSelector("quiz_total", s => s?.value ?? 0);
  const quiz_percent = Math.round(quiz_total/20*100);
  const annie_percent = useComponentSelector("annie_percent", s => s?.value);
  const jj_percent = useComponentSelector("jj_percent", s => s?.value);
  const lin_percent = useComponentSelector("lin_percent", s => s?.value);

  return (
      <Scene id="psych_sba.quiz.1" onScreen={onScreen} title="Quiz 1: Reinforcement and Punishment">
              <div className="floatLeftNarrowPlus">
                  <ConversationMove 
                     id="psych_sba.scene.16.move.1"
                     onScreen={onScreen}
                     showOnScreens={[1,2]} 
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                         <p>It sounds like we may still be a bit confused on these concepts. I don't think
                            we should give Annie's friend any advice until we're sure we know exactly
                            what positive reinforcement is!</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.scene.16.move.2" 
                     onScreen={onScreen}
                     showOnScreens={[2]} 
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>You're right!<br /><br />
                           Hey, everyone, I've got an idea.<br /><br />
                           Do you remember when the TA gave us that practice quiz handout with twenty extra
                           questions on it to help us practice telling the difference between reinforcement
                           and punishment? Why don’t we try to answer those questions? Then, we can
                           discuss them ...</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.1" 
                     onScreen={onScreen}
                     showOnScreens={[3]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here are the first five questions on the quiz.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.2" 
                     onScreen={onScreen}
                     showOnScreens={[4]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here are the questions six through ten on the quiz.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.3" 
                     onScreen={onScreen}
                     showOnScreens={[5]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here are the questions eleven through fifteen on the quiz.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.4" 
                     onScreen={onScreen}
                     showOnScreens={[6]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here are the questions sixteen through twenty on the quiz.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.5" 
                     onScreen={onScreen}
                     showOnScreens={[7, 8]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here is how we did on the quiz.</p> 
                  </ConversationMove>
                 <ConversationMove 
                     id="psych_sba.reinforce_punish.move.6" 
                    onScreen={onScreen}
                    showOnScreens={[8]}
                    showCondition={quiz_percent >= 80} 
                    name="JJ"
                    imgURL="/TeamMemberOne.jpg"
                    maxHeight="40px"
                    screenPercent="100%"
                    className="conversationDark"
                    pictureClass="imageWindowVar3">
                        <p>Looks like we did pretty well!</p>
                  </ConversationMove>
                 <ConversationMove 
                    id="psych_sba.reinforce_punish.move.7" 
                    onScreen={onScreen}
                    showOnScreens={[8]}
                    showCondition={quiz_percent < 80} 
                    name="JJ"
                    imgURL="/TeamMemberOne.jpg"
                    maxHeight="40px"
                    screenPercent="100%"
                    className="conversationDark"
                    pictureClass="imageWindowVar3">
                        <p>Looks like maybe we should review the answers. We got a fair number wrong.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.8" 
                     onScreen={onScreen}
                     showOnScreens={[9]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Do you guys want to review the answers? Sometimes it helps to review, even if you got most of the answers right.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.9" 
                     onScreen={onScreen}
                     showOnScreens={[10, 11]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here are the answers to the first five questions.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.10" 
                     onScreen={onScreen}
                     showOnScreens={[11]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                         <p>I got #3 wrong. I was confused by "accidentally". It didn't matter if it was
                            an accident. It reduced the likelihood that Lucas would touch the stove to zero,
                            so in terms of psychological theory, it was a punishment.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.11" 
                     onScreen={onScreen}
                     showOnScreens={[12, 13, 14]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here are the answers to questions six through ten on the quiz.
                           Looks like these are all examples of reinforcement!</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.12" 
                     onScreen={onScreen}
                     showOnScreens={[13, 14]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                           <p>#7 confused me. But I guess you can paraphrase it as "Whenever his mom gets upset, 
                              that makes Matthew more likely to make his bed in the morning," so it's a reinforcer.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.13" 
                     onScreen={onScreen}
                     showOnScreens={[14]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                            <p>#9 confused me because the sister is probably calling her an artist to be sarcastic.
                               She wants her to stop! But the sarcastic praise is still making her more likely to scribble on the walls,
                               so it's a reinforcer. </p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.14" 
                     onScreen={onScreen}
                     showOnScreens={[15,16,17,18]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here are the answers to questions eleven through fifteen on the quiz.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.15" 
                     onScreen={onScreen}
                     showOnScreens={[16,17,18]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                            <p>#12 confused me because I didn't think NOT doing something would count
                               as punishment. But her teacher never calling on her to speak made it less
                               likely that Luna would ask questions in class, so it counts as punishment.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.16" 
                     onScreen={onScreen}
                     showOnScreens={[17,18]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                           <p>#15 confused me, because dessert was taken away only once. But that one time had a big impact, and took
                              the probability that Jackson will try new foods down to zero, so it counts as punishment psychologically.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.17" 
                     onScreen={onScreen}
                     showOnScreens={[18]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>#11 confused me, because the dad's actions are making it MORE likely that Michael
                           will stay seated. But what's really happening is that the dad is frowning angrily when
                           Michael stands up, and that's making Michael less likely to stand. So it's also a punishment.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.18" 
                     onScreen={onScreen}
                     showOnScreens={[19, 20, 21]}
                     name="Lin"
                     imgURL="/TeamMemberThree.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar2">
                        <p>Here are the answers to questions sixteen through twenty on the quiz.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.19" 
                     onScreen={onScreen}
                     showOnScreens={[20, 21]}
                     name="Annie"
                     imgURL="/TeamMemberTwo.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindow">
                           <p>#19 confused me, because the teacher giving Chloe an order didn't
                              seem like a punishment to me! But it counts as one, because it made Chloe
                              less likely to play with scissors.</p>
                  </ConversationMove>
                  <ConversationMove 
                     id="psych_sba.reinforce_punish.move.20" 
                     onScreen={onScreen}
                     showOnScreens={[21]}
                     name="JJ"
                     imgURL="/TeamMemberOne.jpg"
                     maxHeight="40px"
                     screenPercent="100%"
                     className="conversationDark"
                     pictureClass="imageWindowVar3">
                           <p>#17 confused me, because it sure sounded like a punishment if she got
                              grounded! But grounding her made her study more, so it's a reinforcement,
                              the way psychologists think about it. If it increases the likelihood someone
                              does something, psychologists call it reinforcement, and if it decreases
                              the likelihood, psychologists call it punishment.</p>
                  </ConversationMove>
              </div>
              <div className="floatLeftMediumWide">
                  <SceneElement
                     onScreen={onScreen}
                     showOnScreens={[3, 10, 11]}>
                      <LO_Table_Of_Radiobutton_Questions
                           id="psych_sba.reinforce_punish.1"
                            form="psych_sba"
                           section="Understanding Reinforcement and Punishment"
                           overallStem="Are these statements punishment or reinforcement?"
                           directions="Indicate your answer by clicking in the column for 'reinforcement' or 'punishment'."
                           ids={['psych_sba.reinforce_punish.liam',
                                 'psych_sba.reinforce_punish.daniel',
                                 'psych_sba.reinforce_punish.lucas',
                                 'psych_sba.reinforce_punish.nicole',
                                 'psych_sba.reinforce_punish.victoria']}
                           itemKeys={[1, 1, 2, 2, 1]}
                           values={[1,2]}
                           labels={["Reinforcement", "Punishment"]}
                           suppressLabel={1}
                           editable={editable}
                           showKeys={showKeys}
                           showChecks={showChecks}
                           showUnchecked={showUnchecked}
                           categoryLabel="Statement"
                           className="contentWindow"
                           headerRowClass="tableHeader"
                           evenRowClass="evenTableRow"
                           oddRowClass="oddTableRow"
                      >
                        <span>1. Liam reads a book every night because he earns a sticker for each completed book.</span>
                        <span>2. Daniel puts away his toys so his parents will stop asking him to clean up.</span>
                        <span>3. Lucas stops touching the hot stove after he accidentally burns his hand.</span>
                        <span>4. Nicole avoids showing her homework to her parents because they reduce her screen time when it's incomplete.</span>
                        <span>5. Victoria throws a tantrum at dinner to get out of eating her vegetables.</span>
                    </LO_Table_Of_Radiobutton_Questions>
                </SceneElement>
                <SceneElement
                  onScreen={onScreen}
                  showOnScreens={[4, 12, 13, 14]}>
                      <LO_Table_Of_Radiobutton_Questions
                           id="psych_sba.reinforce_punish.2"
                           form="psych_sba"
                           section="Understanding Reinforcement and Punishment"
                           overallStem="Are these statements punishment or reinforcement?"
                           directions="Indicate your answer by clicking in the column for 'reinforcement' or 'punishment'."
                           ids={['psych_sba.reinforce_punish.mia',
                                 'psych_sba.reinforce_punish.matthew',
                                 'psych_sba.reinforce_punish.noah',
                                 'psych_sba.reinforce_punish.layla',
                                 'psych_sba.reinforce_punish.william']}
                           itemKeys={[1, 1, 1, 1, 1]}
                           values={[1,2]}
                           labels={["Reinforcement", "Punishment"]}
                           suppressLabel={1}
                           editable={editable}
                           showKeys={showKeys}
                           showChecks={showChecks}
                           showUnchecked={showUnchecked}
                           categoryLabel="Statement"
                           className="narrowFloatRightContentWindow"
                           headerRowClass="tableHeader"
                           evenRowClass="evenTableRow"
                           oddRowClass="oddTableRow"
                      >
                          <span>6. Mia whines at the store because her parents give her candy to quiet her.</span>
                          <span>7. Matthew makes his bed every morning so his mom doesn't get upset.</span>
                          <span>8. Noah practices the piano daily because his parents cheer him on after each session.</span>
                          <span>9. Layla scribbles on walls because her sibling laughs and calls her "an artist."</span>
                          <span>10. William follows playground rules so he doesn't lose recess time.</span>
                      </LO_Table_Of_Radiobutton_Questions>
              </SceneElement>
              <SceneElement
                onScreen={onScreen}
                showOnScreens={[5, 15, 16, 17, 18]}>
                    <LO_Table_Of_Radiobutton_Questions
                         id="psych_sba.reinforce_punish.3"
                         form="psych_sba"
                         section="Understanding Reinforcement and Punishment"
                         overallStem="Are these statements punishment or reinforcement?"
                         directions="Indicate your answer by clicking in the column for 'reinforcement' or 'punishment'."
                         ids={['psych_sba.reinforce_punish.michael',
                               'psych_sba.reinforce_punish.luna',
                               'psych_sba.reinforce_punish.benjamin',
                               'psych_sba.reinforce_punish.nathan',
                               'psych_sba.reinforce_punish.jackson']}
                         itemKeys={[2, 2, 2, 2, 2]}
                         values={[1,2]}
                         labels={["Reinforcement", "Punishment"]}
                         suppressLabel={1}
                         editable={editable}
                         showKeys={showKeys}
                         showChecks={showChecks}
                         showUnchecked={showUnchecked}
                         categoryLabel="Statement"
                         className="narrowFloatRightContentWindow"
                         headerRowClass="tableHeader"
                         evenRowClass="evenTableRow"
                         oddRowClass="oddTableRow"
                    >
                        <span>11. Michael stays seated during meals after his father frowns and glares at him every time he stands up.</span>
                        <span>12. Luna stops asking questions in class because her teacher never calls on her to speak.</span>
                        <span>13. Benjamin stops throwing toys after being told firmly that it's unacceptable.</span>
                        <span>14. Nathan stops interrupting when his teacher starts making him sit in a "quiet corner."</span>
                        <span>15. Jackson doesn't try new foods because his favorite dessert was once removed for refusing broccoli.</span>
                    </LO_Table_Of_Radiobutton_Questions>
              </SceneElement>
              <SceneElement
                onScreen={onScreen}
                showOnScreens={[6, 19, 20, 21]}>
                    <LO_Table_Of_Radiobutton_Questions
                         id="psych_sba.reinforce_punish.4"
                         form="psych_sba"
                         section="Understanding Reinforcement and Punishment"
                         overallStem="Are these statements punishment or reinforcement?"
                         directions="Indicate your answer by clicking in the column for 'reinforcement' or 'punishment'."
                         ids={['psych_sba.reinforce_punish.charlotte',
                               'psych_sba.reinforce_punish.aiden',
                               'psych_sba.reinforce_punish.jack',
                               'psych_sba.reinforce_punish.chloe',
                               'psych_sba.reinforce_punish.amelia']}
                         itemKeys={[1, 1, 1, 2, 2]}
                         values={[1,2]}
                         labels={["Reinforcement", "Punishment"]}
                         suppressLabel={1}
                         editable={editable}
                         showKeys={showKeys}
                         showChecks={showChecks}
                         showUnchecked={showUnchecked}
                         categoryLabel="Statement"
                         className="narrowFloatRightContentWindow"
                         headerRowClass="tableHeader"
                         evenRowClass="evenTableRow"
                         oddRowClass="oddTableRow"
                    >
                        <span>16. Charlotte organizes her desk because she earns a "Super Organized" badge from her teacher for doing so.</span>
                        <span>17. Aiden studies for tests to avoid being grounded for poor grades.</span>
                        <span>18. Jack refuses to put on his shoes until his parent offers a snack as a bribe.</span>
                        <span>19. Chloe stops playing with scissors after being told by her teacher.</span>
                        <span>20. Amelia stops participating in group activities after being excluded as punishment in the past.</span>
                    </LO_Table_Of_Radiobutton_Questions>
              </SceneElement>
              <SceneElement
                  onScreen={onScreen}
                  showOnScreens={[7, 8]}>
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
                          <td className="tableCell">{annie_percent}</td>
                        </tr>
                        <tr className="evenTableRow">
                          <td className="tableHeaderColumn">JJ</td>
                          <td className="tableCell">{jj_percent}</td>
                        </tr>
                        <tr className="oddTableRow">
                          <td className="tableHeaderColumn">Lin</td>
                          <td className="tableCell">{lin_percent}</td>
                        </tr>
                        <tr className="evenTableRow">
                          <td className="tableHeaderColumn">You</td>
                          <td className="tableCell">{quiz_percent}</td>
                        </tr>
                      </tbody>
                    </table>
              </SceneElement>
              <ConversationMove 
                  id="psych_sba.reinforce_punish.move.9" 
                  onScreen={onScreen}
                  showOnScreens={[9]}
                  name="You"
                  imgURL="/self.png"
                  maxHeight="40px"
                  screenPercent="100%"
                  className="conversationLightFlex"
                  pictureClass="imageWindow">
                        <Stem>Indicate whether you want to review the correct answers.</Stem>
                        <LO_Radiobuttons id="psych_sba.review_item">
                            <LO_Radiobutton
                                id="psych_sba.review.yes"
                                form="psych_sba"
                                section="Selecting a Strategy"
                                group_id="psych_sba.review"
                                stem="Indicate whether you want to review the correct answers."
                                value={1}
                                label="Yes"
                            />
                            <LO_Radiobutton
                                id="psych_sba.review.no"
                                form="psych_sba"
                                section="Selecting a Strategy"
                                stem="Indicate whether you want to review the correct answers."
                                group_id="psych_sba.review"
                                value={2}
                                label="No"
                            />
                       </LO_Radiobuttons>
               </ConversationMove>
          </div>
      </Scene>
)};