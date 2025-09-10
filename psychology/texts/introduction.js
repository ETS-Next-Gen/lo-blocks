import { React } from 'react';
import { LO_SpeechButton } from '../../../lo_components/components.js';

export default function Introduction() {
  return (
        <>
           <h3>Introduction</h3>
           <p>In this module, you will review and apply several concepts from your coursework
              on behavioral modification. Specifically, you will:</p>
           <ul>
            <li>Read about behavior modification techniques and think about how
                they apply to a real-life situation.</li>
            <li>Understand the differences between reinforcement and punishment.</li>
            <li>Identify whether behavior modification techniques are positive or negative.</li>
           </ul>
           <p>To complete these parts, you will imagine that you are working in a breakout group with 
              classmates named Annie, JJ, and Lin. But keep in mind that this is not an actual breakout
              group, and these are not real people. They are characters who will help you as you go along. 
              You will also be able to use an AI assistant that is built into this module.</p>
           <p>Let's begin. Please click NEXT</p>
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
     </>
    );
}
