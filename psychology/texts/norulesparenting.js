import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';

const NAVIGATEID='NAVIGATEID';

export function NoRulesParenting() {
  const [state, setState] = useState({'title': '', 'para1': ''});
  const navigation = useComponentSelector(NAVIGATEID, s => s?.navigation ?? '');

  return (
        <>
           <div  className="contentBox">
             <h3 id="norules_h0">Evidence for and Against No-Rules Parenting to Address Sleep Refusal</h3>
             <ol>
                  <li id="norules_h1"><b>Child-Led Autonomy</b></li>
                  <ul>
                      <li id="norules_h1_l1"><b>Argument</b>: Allowing children to choose when to sleep can foster autonomy,
                          reducing bedtime power struggles and increasing intrinsic motivation to rest.</li>
                      <li id="norules_h1_l1_lh2"><b>Evidence</b>:</li>
                      <ul>
                          <li id="norules_h1_l1_lh2_l1">Studies on self-determination theory suggest that giving children choices promotes
                              a sense of control, potentially reducing defiance.</li>
                          <li id="norules_h1_l1_lh2_l2">However, young children often lack the biological and cognitive maturity to make 
                              health-conscious decisions about sleep. Sleep research shows that inconsistent 
                              schedules can disrupt circadian rhythms, leading to insufficient or fragmented sleep.</li>
                          </ul>
                  </ul>
                  <li id="norules_h2"><b>Natural Consequences</b></li>
                  <ul><li id="norules_h2_l1"><b>Argument:</b> Experiencing the effects of insufficient sleep (e.g., feeling tired) could 
                             motivate a child to adjust bedtime without external pressure.</li>
                      <li id="norules_h2_l2_h2">Evidence:</li>
                      <ul>
                           <li id="norules_h2_l2_h2_l1">Natural consequences are more effective for older children and adolescents
                               who can connect cause and effect.</li>
                           <li id="norules_h2_l2_h2_l2">However, younger children may not link fatigue with staying up late and could experience
                               negative effects like irritability, reduced focus, and weakened immune function.</li>
                      </ul>
                  </ul>
                  <li id="norules_h3"><b>Reduced Stress Around Sleep</b></li>
                  <ul>
                      <li id="norules_h3_l1">Argument: Removing strict bedtime rules may create a relaxed environment, 
                             making it easier for children to fall asleep naturally.</li>
                      <li id="norules_h3_l1_lh2"><b>Evidence:</b></li>
                      <ul>
                          <li id="norules_h3_l1_lh2_l1">Stress and anxiety are known to interfere with sleep onset.</li>
                          <li id="norules_h3_l1_lh2_l2">However, research suggests that structured bedtime routines reduce cortisol
                              levels and promote melatonin release, facilitating better sleep.</li>
                      </ul>
                  </ul>
                  <li id="norules_h4"><b>Parental Responsiveness</b></li>
                  <ul>
                      <li id="norules_h4_l1">Argument: Prioritizing connection and meeting the child's needs (e.g., 
                             through co-sleeping or comforting) can improve emotional security, 
                             reducing sleep resistance.</li>
                      <li id="norules_h4_l2h"><b>Evidence</b></li>
                          <ul>
                              <li id="norules_h4_l2h_l1">Attachment-based approaches can improve sleep quality by addressing
                                  underlying anxieties or fears.</li>
                              <li id="norules_h4_l2h_l2">However, overly permissive approaches without structure may inadvertently 
                                  reinforce avoidance behaviors.</li>
                          </ul>
                  </ul>
            </ol>
            <h3 id="norules_h5">Challenges of No-Rules Parenting for Sleep Refusal</h3>
            <ul>
                <li id="norules_h5_l1">Inconsistent Sleep Patterns: A lack of structure can lead to irregular sleep, 
                       which is associated with behavioral and cognitive challenges.</li>
                <li id="norules_h5_l2">Delayed Sleep Onset: Without a set bedtime, children may stay awake longer, 
                       disrupting their natural sleep-wake cycles.</li>
                <li id="norules_h5_l3">Parental Burnout: Allowing children to dictate bedtime can result in extended
                       negotiations and increased nighttime disruptions.</li>
           </ul>
         </div>
         <LO_SpeechButton 
              id="norules_speech" 
              label="Read Aloud"
              text="Evidence for and Against No-Rules Parenting to Address Sleep Refusal. Child-Led Autonomy. Argument: Allowing children to choose when to sleep can foster autonomy, reducing bedtime power struggles and increasing intrinsic motivation to rest. Evidence: Studies on self-determination theory suggest that giving children choices promotes a sense of control, potentially reducing defiance. However, young children often lack the biological and cognitive maturity to make health-conscious decisions about sleep. Sleep research shows that inconsistent schedules can disrupt circadian rhythms, leading to insufficient or fragmented sleep. Natural Consequences. Argument: Experiencing the effects of insufficient sleep (e.g., feeling tired) could motivate a child to adjust bedtime without external pressure. Evidence: Natural consequences are more effective for older children and adolescents who can connect cause and effect. Younger children may not link fatigue with staying up late and could experience negative effects like irritability, reduced focus, and weakened immune function. Reduced Stress Around Sleep. Argument: Removing strict bedtime rules may create a relaxed environment, making it easier for children to fall asleep naturally. Evidence: Stress and anxiety are known to interfere with sleep onset. However, research suggests that structured bedtime routines reduce cortisol levels and promote melatonin release, facilitating better sleep. Parental Responsiveness. Argument: Prioritizing connection and meeting the child's needs (e.g., through co-sleeping or comforting) can improve emotional security, reducing sleep resistance. Evidence: Attachment-based approaches can improve sleep quality by addressing underlying anxieties or fears. Overly permissive approaches without structure may inadvertently reinforce avoidance behaviors. Challenges of No-Rules Parenting for Sleep Refusal. Inconsistent Sleep Patterns: A lack of structure can lead to irregular sleep, which is associated with behavioral and cognitive challenges. Dlayed Sleep Onset: Without a set bedtime, children may stay awake longer, disrupting their natural sleep-wake cycles. Parental Burnout: Allowing children to dictate bedtime can result in extended negotiations and increased nighttime disruptions."
         />
     </>
    );}

