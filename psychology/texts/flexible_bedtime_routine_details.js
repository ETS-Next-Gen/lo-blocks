import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';


export default function FlexibleBedtimeRoutinesDetails() {
  return (
              <ul>
                  <li><b>What It Is</b>: Establish a routine with consistent elements (e.g., bath, story, lights out) 
                      while allowing minor variations, like choosing the story or bedtime music.</li>
                  <li><b>Why It Works</b>: Predictable routines help regulate circadian rhythms, and offering
                      small choices fosters autonomy.</li>
                  <li><b>Evidence</b>: Research consistently supports bedtime routines as critical for improving 
                      sleep duration and quality in children.</li> 
              </ul>
    );}

