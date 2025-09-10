import { React } from 'react';
import { LO_SpeechButton } from '../../../lo_components/components.js';

export default function Introduction() {
  return (
        <>
           <h3>Introduction</h3>
           <p>As we have been discussing in class, the psychological concepts you are learning can be used to help
              you solve problems that you may face in the real world. Today, we are going to help another college
              student address a problem they are facing.</p>
           <p>As you complete this activity, you will learn, review, and apply several concepts from your 
              coursework. Specifically, you will:</p>
           <ul>
            <li>Learn about different ways that parents/adults approach child misbehavior.</li>
            <li>Learn about the strengths and weaknesses associated with AI use. </li>
            <li>Practice applying information from the course textbook, as well as from scientific research, to real-life scenarios.</li>
           </ul>
           <p>While you are completing this activity, imagine you are working in a breakout group with classmates
              named Annie, JJ, and Lin. But, keep in mind that this is not an actual breakout group, and these
              are not real people. They are characters who will assist you as you progress through this activity.
              You will also have access to an AI assistant built into this module.</p>
           <p>Let's begin. Please click NEXT</p><br />
           <LO_SpeechButton 
              id="norules_speech" 
              label="Read Aloud"
              text="Introduction. As we have been discussing in class, the psychological concepts you are learning \
                    can be used to help you solve problems that you may face in the real world. Today, we are going \
                    to help another college student address a problem they are facing. As you complete this activity, \
                    you will learn, review, and apply several concepts from your coursework. Specifically, you will: \
                    Learn about different ways that parents/adults approach child misbehavior. \
                    Learn about the strengths and weaknesses associated with AI use. \
                    Identify whether behavior modification techniques are positive or negative. \
                    While you are completing this activity, imagine you are working in a breakout group with classmates \
                    named Annie, JJ, and Lin. But, keep in mind that this is not an actual breakout group, and these \
                    are not real people. They are characters who will assist you as you progress through this activity. \
                    You will also have access to an AI assistant built into this module. Let's begin. Please click NEXT"
           />
           <p><i>Notes:</i></p>
           <ul style={{"listStyleType":"circle"}}>
              <li>This scenario-based assessment is being hosted on a platform with a 'retro feel.' 
                  We will continue to make updates to this program and platform as this project continues. </li>
              <li>If you need to increase the font size on your screen, remember that you can adjust your
                  'zoom setting' on your web browser.</li>
           </ul>
           <br />
     </>
    );
}
