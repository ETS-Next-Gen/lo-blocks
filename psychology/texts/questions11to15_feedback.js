import { React, useState, useRef, useEffect,useCallback } from 'react';
import { useComponentSelector } from '../../../lo_components/utils.js';
import { LO_SpeechButton } from '../../../lo_components/components.js';

const NAVIGATEID='NAVIGATEID';

export function Feedback_11_to_15({className}) {
  const [state, setState] = useState({'title': '', 'para1': ''});
  const navigation = useComponentSelector(NAVIGATEID, s => s?.navigation ?? '');

  return (
     <ol className={className} start="11">
        <li><p className="tightSpacing">Michael stays seated during meals after his father frowns and glares at him every time he stands up.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is added (father frowning and glaring at him) - Positive</li>
                <li className="tightSpacing">Behavior happens less often (standing up) - Punishment</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Luna stops asking questions in class because her teacher never calls on her to speak.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is taken away (teacher never calling on her to speak) -  Negative</li>
                <li className="tightSpacing">Behavior happens less often (asking questions in class) - Punishment</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Benjamin stops throwing toys after being told firmly that it's unacceptable.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is added (being told firmly that it’s unacceptable) - Positive</li>
                <li className="tightSpacing">Behavior happens less often (throwing toys) - Punishment</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Nathan stops interrupting when his teacher starts making him sit in a "quiet corner."</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something undesirable is added - making him sit in a "quiet corner" - Positive</li>
                <li className="tightSpacing">Behavior happens less often (interrupting) - Punishment</li>
            </ul>
        </li>
        <li><p className="tightSpacing">Jackson doesn't try new foods because his favorite dessert was once removed for refusing broccoli.</p>
            <p className="tightSpacing"><b>Explanation:</b></p>
            <ul>
                <li className="tightSpacing">Something desirable is taken away (his favorite dessert) - Negative</li>
                <li className="tightSpacing">Behavior happens less often (trying new foods) - Punishment</li>
            </ul>
        </li>
     </ol>
    );}




