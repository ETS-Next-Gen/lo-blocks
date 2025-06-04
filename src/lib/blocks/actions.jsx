import { inferRelatedNodes } from './olxdom';
import { COMPONENT_MAP } from '@/components/componentMap';

export function action({ action }) {
  return { action };
}

export function executeNodeActions(props) {
  const ids = inferRelatedNodes( props, {
    selector: n => typeof n.spec?.action === 'function',
    infer: props.infer,
    targets: props.targets
  });
  ids.forEach(targetId => {
    const targetInstance = props.idMap[targetId];
    const targetSpec = COMPONENT_MAP[targetInstance.tag];
    targetSpec.action({
      targetId,
      targetInstance,
      targetSpec,
      props
    });
  });
}
