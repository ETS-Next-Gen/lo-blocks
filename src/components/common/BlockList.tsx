// src/components/common/BlockList.tsx
//
// Shared block list component used by /docs page and Studio sidebar.
// Displays blocks grouped by category with collapsible sections.
//
'use client';

import { useState, useMemo, useEffect } from 'react';
import { getCategory, sortCategories } from '@/lib/docs';
import './BlockList.css';

export interface BlockItem {
  name: string;
  description?: string | null;
  category?: string | null;
  source?: string;
  readme?: string | null;
  examples?: Array<{ path: string; gitStatus?: string }>;
  gitStatus?: string;
  readmeGitStatus?: string;
  internal?: boolean;
  _isGrammar?: boolean;
  extension?: string;
  hasPreview?: boolean;
  exampleCount?: number;
}

// =============================================================================
// ElementsInFile - Shows elements used in the current file with expandable docs
// =============================================================================

interface ElementsInFileProps {
  elements: string[];
  blockDocs: Record<string, BlockItem>;
  className?: string;
}

export function ElementsInFile({ elements, blockDocs, className = '' }: ElementsInFileProps) {
  if (elements.length === 0) return null;

  return (
    <div className={`elements-in-file ${className}`}>
      <div className="elements-in-file__header">Elements in file</div>
      <div className="elements-in-file__list">
        {elements.map(tag => (
          <ElementDocItem key={tag} tag={tag} block={blockDocs[tag]} />
        ))}
      </div>
    </div>
  );
}

// Expandable element doc item - shows description and fetches examples on expand
function ElementDocItem({ tag, block }: { tag: string; block?: BlockItem }) {
  const [expanded, setExpanded] = useState(false);
  const [detailedDocs, setDetailedDocs] = useState<{
    readme?: { content: string };
    examples?: Array<{ filename: string; content: string }>;
  } | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Fetch detailed docs when expanded
  useEffect(() => {
    if (expanded && block && !detailedDocs && !loadingDocs) {
      setLoadingDocs(true);
      fetch(`/api/docs/${encodeURIComponent(tag)}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            setDetailedDocs({
              readme: data.block.readme,
              examples: data.block.examples,
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoadingDocs(false));
    }
  }, [expanded, block, tag, detailedDocs, loadingDocs]);

  const firstExample = detailedDocs?.examples?.[0];

  return (
    <div className="element-doc-item">
      <button className="element-doc-item__header" onClick={() => setExpanded(!expanded)}>
        <span className="element-doc-item__toggle">{expanded ? '▼' : '▶'}</span>
        <span className="element-doc-item__tag">{tag}</span>
        {block?.description && (
          <span className="element-doc-item__desc">{block.description}</span>
        )}
      </button>
      {expanded && (
        <div className="element-doc-item__content">
          {loadingDocs && <div className="element-doc-item__loading">Loading...</div>}
          {firstExample && (
            <pre className="element-doc-item__example">{firstExample.content}</pre>
          )}
          {!loadingDocs && !firstExample && block?.description && (
            <div className="element-doc-item__desc-full">{block.description}</div>
          )}
          <a href={`/docs#${tag}`} target="_blank" className="element-doc-item__link">
            Full docs →
          </a>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// BlockList - Categorized list of all blocks
// =============================================================================

interface BlockListProps {
  blocks: BlockItem[];
  selectedBlock?: string | null;
  onSelectBlock?: (name: string, isGrammar?: boolean) => void;
  searchQuery?: string;
  showGitStatus?: boolean;
  className?: string;
}

export function BlockList({
  blocks,
  selectedBlock,
  onSelectBlock,
  searchQuery = '',
  showGitStatus = false,
  className = '',
}: BlockListProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>(() => {
    // Start with all categories collapsed
    const collapsed: Record<string, boolean> = {};
    blocks.forEach(block => {
      const cat = getCategory(block);
      collapsed[cat] = true;
    });
    return collapsed;
  });
  const [hoveredBlock, setHoveredBlock] = useState<BlockItem | null>(null);

  // Group blocks by category
  const categorizedBlocks = useMemo(() => {
    const groups: Record<string, BlockItem[]> = {};
    blocks.forEach(block => {
      const category = getCategory(block);
      if (!groups[category]) groups[category] = [];
      groups[category].push(block);
    });
    return groups;
  }, [blocks]);

  // Filter by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categorizedBlocks;
    const query = searchQuery.toLowerCase();
    const filtered: Record<string, BlockItem[]> = {};
    Object.entries(categorizedBlocks).forEach(([category, items]) => {
      const matching = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        (item._isGrammar && item.extension?.toLowerCase().includes(query))
      );
      if (matching.length) filtered[category] = matching;
    });
    return filtered;
  }, [categorizedBlocks, searchQuery]);

  const sortedCategories = sortCategories(Object.keys(filteredCategories));

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className={`block-list ${className}`}>
      {sortedCategories.map(category => {
        const items = filteredCategories[category];
        const isCollapsed = collapsedCategories[category];

        return (
          <div key={category} className="block-list__category">
            <button
              className="block-list__category-header"
              onClick={() => toggleCategory(category)}
            >
              <span className="block-list__category-icon">
                {isCollapsed ? '▶' : '▼'}
              </span>
              <span className="block-list__category-name">{category}</span>
              <span className="block-list__category-count">{items.length}</span>
            </button>

            {!isCollapsed && (
              <div className="block-list__items">
                {items.map(block => {
                  const isSelected = selectedBlock === block.name;
                  const blockUncommitted = showGitStatus && block.gitStatus && block.gitStatus !== 'committed';
                  const docsUncommitted = showGitStatus && block.readmeGitStatus && block.readmeGitStatus !== 'committed';
                  const examplesUncommitted = showGitStatus && block.examples?.some(e => e.gitStatus && e.gitStatus !== 'committed');
                  const anyUncommitted = blockUncommitted || docsUncommitted || examplesUncommitted;

                  return (
                    <div
                      key={block.name}
                      className="block-list__item-wrapper"
                      onMouseEnter={() => setHoveredBlock(block)}
                      onMouseLeave={() => setHoveredBlock(null)}
                    >
                      {onSelectBlock ? (
                        <button
                          className={`block-list__item ${isSelected ? 'block-list__item--selected' : ''} ${anyUncommitted ? 'block-list__item--uncommitted' : ''}`}
                          onClick={() => onSelectBlock(block.name, block._isGrammar)}
                        >
                          <span className={`block-list__item-name ${blockUncommitted ? 'block-list__item-name--italic' : ''}`}>
                            {block.name}
                            {block._isGrammar && block.extension && (
                              <span className="block-list__item-ext">.{block.extension}</span>
                            )}
                          </span>
                          <span className="block-list__item-indicators">
                            {block._isGrammar ? (
                              block.hasPreview && (
                                <span className="block-list__indicator block-list__indicator--preview" title="Has preview" />
                              )
                            ) : (
                              block.readme && (
                                <span
                                  className={`block-list__indicator ${docsUncommitted ? 'block-list__indicator--uncommitted' : 'block-list__indicator--readme'}`}
                                  title={docsUncommitted ? `README (${block.readmeGitStatus})` : 'README'}
                                />
                              )
                            )}
                            {(block.examples?.length || block.exampleCount) && (
                              <span
                                className={`block-list__indicator ${examplesUncommitted ? 'block-list__indicator--uncommitted' : 'block-list__indicator--examples'}`}
                                title={examplesUncommitted ? 'Examples (uncommitted)' : 'Examples'}
                              />
                            )}
                          </span>
                        </button>
                      ) : (
                        <a
                          href={`/docs#${block.name}`}
                          target="_blank"
                          className={`block-list__item ${isSelected ? 'block-list__item--selected' : ''}`}
                        >
                          <span className="block-list__item-name">{block.name}</span>
                        </a>
                      )}

                      {/* Hover tooltip */}
                      {hoveredBlock === block && block.description && (
                        <div className="block-list__tooltip">
                          {block.description}
                          {showGitStatus && anyUncommitted && (
                            <div className="block-list__tooltip-status">
                              {blockUncommitted && <div>Block: {block.gitStatus}</div>}
                              {docsUncommitted && <div>README: {block.readmeGitStatus}</div>}
                              {examplesUncommitted && <div>Examples: uncommitted</div>}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
