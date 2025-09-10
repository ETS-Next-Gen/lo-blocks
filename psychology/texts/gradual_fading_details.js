import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';


export default function GradualFadingDetails() {
  return (
              <ul> 
                 <li><b>What It Is</b>: Gradually adjusting bedtime to an earlier time, aligning it with the child's natural sleep patterns.</li> 
                 <li><b>Why It Works:</b> This reduces resistance by aligning with the child's internal clock while transitioning to a more structured bedtime.</li> 
                 <li><b>Evidence</b>: Studies on bedtime fading highlight its effectiveness in addressing sleep resistance and promoting earlier sleep onset.</li> 
              </ul>
    );}

