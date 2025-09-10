import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';


export default function EnvironmentalAdjustmentsDetails() {
  return (
              <ul> 
                  <li><b>What It Is</b>: Optimizing the sleep environment with dim lighting, white noise, or calming activities like reading.</li> 
                  <li><b>Why It Works</b>: Creates a sensory atmosphere conducive to sleep without relying on strict enforcement.</li> 
                  <li><b>Evidence</b>: Environmental adjustments have been shown to improve sleep quality in both children and adults.</li> 
              </ul>
    );}

