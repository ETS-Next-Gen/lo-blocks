import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';

const NAVIGATEID='NAVIGATEID';

export function Feedback_16_to_20({className}) {
  const [state, setState] = useState({'title': '', 'para1': ''});
  const navigation = useComponentSelector(NAVIGATEID, s => s?.navigation ?? '');

  return (
     <ol className={className} start="16">
        <li><p className="tightSpacing">Charlotte organizes her desk because she earns a "Super Organized" badge from her teacher for doing so.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is added (earns a "Super Organized" badge) - Positive</li>
                <li className="tightSpacing">Behavior happens more often (organizes her desk) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Aiden studies for tests to avoid being grounded for poor grades.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is taken away (being grounded for poor grades) - Negative</li>
                <li className="tightSpacing">Behavior happens more often (studying) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Jack refuses to put on his shoes until his parent offers a snack as a bribe.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is added (offering a snack) - Positive</li>
                <li className="tightSpacing">Behavior happens more often (putting on shoes) - Reinforcement</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Chloe stops playing with scissors after being told by her teacher.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is added (being told by her teacher) - Positive</li>
                <li className="tightSpacing">Behavior happens less often (playing with scissors) - Punishment</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Amelia refuses to participate in group activities after being excluded as punishment in the past.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is being taken away (being included) - Negative</li>
                <li className="tightSpacing">Behavior happens less often (participating) - Punishment</li>
            </ul>
        </li>
     </ol>
    );}
