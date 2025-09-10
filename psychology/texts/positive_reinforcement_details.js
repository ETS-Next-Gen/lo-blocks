import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';


export default function PositiveReinforcementDetails() {
  return (
              <ul> 
                  <li><b>What It Is</b>: Rewarding bedtime compliance with incentives like stickers, extra story time, or praise.</li> 
                  <li><b>Why It Works</b>: Reinforcement encourages desired behaviors while minimizing resistance.</li> 
                  <li><b>Evidence</b>: Behavioral interventions, including reward systems, are shown to be effective in managing sleep refusal.</li> 
              </ul>
    );}

