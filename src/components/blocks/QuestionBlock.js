import { Trace } from '@/lib/debug';

export default function QuestionBlock({ prompt, url_name, options = [] }) {
  const optionList = typeof options === 'string' ? options.split(',') : options;

  return (
    <div className="p-4 border rounded">
      <Trace>[QuestionBlock / (url_name: {url_name || 'n/a'})]</Trace>
      <p className="mb-2">{prompt}</p>
      <ul>
        {optionList.map((opt, i) => (
          <li key={i} className="mb-1">
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
              {opt.trim()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
