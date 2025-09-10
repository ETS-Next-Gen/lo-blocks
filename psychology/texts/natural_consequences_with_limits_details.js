import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';


export default function EmpathyAndEmotionalSupportDetails() {
  return (
              <ul> 
                  <li><b>What It Is</b>: Allowing some flexibility in bedtime while enforcing non-negotiable 
                      wake-up times to teach self-regulation.</li> 
                  <li><b>Why It Works</b>: Balances autonomy with accountability, helping older children connect choices with outcomes.</li> 
                  <li><b>Evidence</b>: Works best with children who can understand cause and effect.</li> 
              </ul>
    );}

