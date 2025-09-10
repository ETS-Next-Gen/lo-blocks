import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';

const NAVIGATEID='NAVIGATEID';

export function Feedback_6_to_10({className}) {
  const [state, setState] = useState({'title': '', 'para1': ''});
  const navigation = useComponentSelector(NAVIGATEID, s => s?.navigation ?? '');

  return (
     <ol className={className} start="6">
        <li><p className="tightSpacing">Mia whines at the store because her parents give her candy to quiet her.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is added (parents give her candy) - Positive</li>
                <li className="tightSpacing">Behavior happens more often (whining at store) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Matthew makes his bed every morning so his mom doesn't get upset.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is taken away (mom being upset) - Negative</li>
                <li className="tightSpacing">Behavior happens more often (making bed every morning) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Noah practices the piano daily because his parents cheer him on after each session.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is added (his parents cheer him on after each session) - Positive</li>
                <li className="tightSpacing">Behavior happens more often (practices the piano daily) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Layla scribbles on walls because her sibling laughs and calls her "an artist."</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is added (sibling laughing and calling her "an artist") - Positive</li>
                <li className="tightSpacing">Behavior happens more often (scribbles on walls) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">William follows playground rules so he doesn't lose recess time.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is taken away (losing recess time) - Negative</li>
                <li className="tightSpacing">Behavior happens more often (follows playground rules) - Reinforcement</li>
            </ul>
        </li>
     </ol>
    );}
