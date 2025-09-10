import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';

const NAVIGATEID='NAVIGATEID';

export function Feedback_1_to_5({className}) {
  const [state, setState] = useState({'title': '', 'para1': ''});
  const navigation = useComponentSelector(NAVIGATEID, s => s?.navigation ?? '');

  return (
     <ol className={className}>
        <li><p className="tightSpacing">Liam reads a book every night because he earns a sticker for each completed book.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is added (stickers) - Positive</li>
                <li className="tightSpacing">Behavior happens more often (reading a book every night) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Daniel puts away his toys so his parents will stop asking him to clean up.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is being taken away (parents asking him to clean up) - Negative</li>
                <li className="tightSpacing">Behavior happens more often (putting toys away) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Lucas stops touching the hot stove after he accidentally burns his hand.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is added (burning his hand) - Positive</li>
                <li className="tightSpacing">Behavior happens less often (touching the stove) - Punishment</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Nicole avoids showing her homework to her parents because they reduce her screen time when it's incomplete.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is taken away (screen time) - Negative</li>
                <li className="tightSpacing">Behavior happens less often (showing parents homework) - Punishment</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Victoria throws a tantrum at dinner to get out of eating her vegetables.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is taken away (eating her vegetables) - Negative</li>
                <li className="tightSpacing">Behavior happens more often (throwing a tantrum) - Reinforcement</li>
            </ul>
        </li>
     </ol>
    );}

