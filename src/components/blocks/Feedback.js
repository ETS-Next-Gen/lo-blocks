// src/components/blocks/Feedback.js
import { dev } from '@/lib/blocks';
import * as parsers from '@/lib/content/parsers';
import _Hidden from './_Hidden';
import _Noop from './_Noop';

const Feedback = dev({
  ...parsers.blocks(),
  name: 'Feedback',
  description: 'Metadata container for choice feedback; not rendered directly',
  component: (props) => {
    const visible = props.visible === true || props.visible === 'true';
    const Component = visible ? _Noop : _Hidden;
    return <Component {...props} />;
  },
});

export default Feedback;
