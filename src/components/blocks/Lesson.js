import { Trace } from '@/lib/debug';
import { renderXmlTree } from '@/lib/renderXml';

// Lesson gets children which may be XML nodes or real JSX
export default function Lesson({ kids, urlMap, url_name }) {
  const renderedChildren = renderXmlTree(kids, urlMap);

  return (
    <div className="p-6 bg-white rounded shadow-md space-y-4">
      <Trace>[lesson / (url_name: {url_name || 'n/a'})]</Trace>
      {renderedChildren}
    </div>
  );
}
