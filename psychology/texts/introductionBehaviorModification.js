import { React } from 'react';
import { LO_SpeechButton } from '../../../lo_components/components.js';

export default function Introduction() {
  return (
        <>
           <h3>Introduction</h3>
           <p>In this module, you will pick up where you left off in helping Annie's friend,
              who babysits for a 6-year-old who has been engaging in sleep refusal.</p>
           <p>During your last session, you learned about parenting techniques and the
              strengths and limitations of AI. Your group decided that positive reinforcement
              would be the best way for Annie's friend to proceed.</p>
           <p>In this session, you will review and apply several concepts from your coursework
              in psychology on behavior modification. Specifically, you will:</p>
           <ul>
            <li><b>Understand the differences between reinforcement and punishment.</b></li>
            <li><b>Identify whether behavior modification techniques are positive or negative.</b></li>
            <li><b>Classify scenarios as being examples of positive reinforcement, negative 
                reinforcement, positive punishment, or negative punishment.</b></li>
           </ul>
           <p>During this session, you will continue to work in the breakout group with the characters 
              Annie, JJ, and Lin, and you will continue to use the embedded AI Assistant to help you.</p>
           <p>Let's begin. Please click NEXT</p><br />
           <LO_SpeechButton 
              id="norules_speech" 
              label="Read Aloud"
              text="Introduction. In this module, you will review and apply several concepts from your coursework \
                    on behavioral modification. Specifically, you will: Read about behavior modification techniques and think about how \
                    they apply to a real-life situation. Understand the differences between reinforcement and punishment. \
                    Identify whether behavior modification techniques are positive or negative. \
                    To complete these parts, you will imagine that you are working in a breakout group with  \
                    classmates named Annie, JJ, and Lin. But keep in mind that this is not an actual breakout \
                    group, and these are not real people. They are characters who will help you as you go along. \ 
                    You will also be able to use an AI assistant that is built into this module. \
                    Let's begin. Please click NEXT"
           />
           <p><i>Note:</i></p>
           <ul>
               <li>This scenario-based assessment is being hosted on a platform with a "retro feel." We are continuing
                   to make updates to this program and platform as this project continues. </li>
               <li>If you need to increase the font size on your screen, remember that you can adjust your "zoom setting"
                   on your web browser.</li>
           </ul>
     </>
    );
}
