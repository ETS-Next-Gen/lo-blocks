// src/components/blocks/Course/_Course.jsx
'use client';

import React from 'react';
import { useReduxState } from '@/lib/state';
import { render } from '@/lib/render';

function _Course(props) {
  const { kids = {}, fields, title = 'Course', ...otherProps } = props;
  const { chapters = [] } = kids;

  const [selectedChild, setSelectedChild] = useReduxState(props, fields.selectedChild, 
    chapters[0]?.children[0]?.id || null);
  const [expandedChapter, setExpandedChapter] = useReduxState(props, fields.expandedChapter, 
    chapters[0]?.id || null);

  const handleChapterClick = (chapterId) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const handleChildClick = (childId) => {
    setSelectedChild(childId);
  };

  // Find the currently selected child to render
  let selectedChildNode = null;
  for (const chapter of chapters) {
    const found = chapter.children.find(child => child.id === selectedChild);
    if (found) {
      selectedChildNode = found;
      break;
    }
  }

  return (
    <div className="course-container flex h-full">
      {/* Left Navigation Accordion */}
      <div className="course-navigation w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        
        <div className="p-2">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="mb-2">
              {/* Chapter Header */}
              <button
                onClick={() => handleChapterClick(chapter.id)}
                className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{chapter.title}</span>
                  <span className="text-gray-500">
                    {expandedChapter === chapter.id ? '▼' : '▶'}
                  </span>
                </div>
              </button>

              {/* Chapter Children */}
              {expandedChapter === chapter.id && (
                <div className="ml-4 mt-2 space-y-1">
                  {chapter.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleChildClick(child.id)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        selectedChild === child.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {child.attributes?.title || child.tag || child.id}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="course-content flex-1 overflow-y-auto">
        {selectedChildNode ? (
          <div className="p-6">
            {render({ 
              node: selectedChildNode, 
              idMap: props.idMap, 
              nodeInfo: props.nodeInfo,
              componentMap: props.componentMap,
              idPrefix: props.idPrefix
            })}
          </div>
        ) : (
          <div className="p-6 text-gray-500">
            <p>Select a section from the navigation to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default _Course;