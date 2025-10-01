// src/components/blocks/_Navigator.jsx
'use client';

import React, { useMemo } from 'react';
import { useReduxState } from '@/lib/state';
import { renderCompiledKids } from '@/lib/render';

// Default preview component for list items
function DefaultPreview({ item, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(item.id)}
      className={`p-3 border-b cursor-pointer transition-all hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="font-medium text-gray-900">{item.title || item.name || item.id}</div>
      {item.subtitle && <div className="text-sm text-gray-600">{item.subtitle}</div>}
      {item.description && (
        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</div>
      )}
    </div>
  );
}

// Default detail component for selected items
function DefaultDetail({ item, onClose }) {
  if (!item) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Select an item to view details
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{item.title || item.name || item.id}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
      
      {item.subtitle && (
        <p className="text-lg text-blue-600 font-medium mb-3">{item.subtitle}</p>
      )}
      
      {item.description && (
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700">{item.description}</p>
        </div>
      )}
      
      {item.details && Object.keys(item.details).length > 0 && (
        <div className="space-y-3">
          {Object.entries(item.details).map(([key, value]) => (
            <div key={key}>
              <h4 className="font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              {Array.isArray(value) ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {value.map((item, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 mt-1">{value}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Component registry for preview/detail components
const COMPONENT_REGISTRY = {
  DefaultPreview,
  DefaultDetail,
  // Add team-specific components
  TeamPreview: ({ item, isSelected, onClick }) => (
    <div
      onClick={() => onClick(item.id)}
      className={`p-3 border-b cursor-pointer transition-all hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          {item.photo ? (
            <img
              src={item.photo}
              alt={item.name}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <span className="text-gray-600 font-medium text-sm" style={{display: item.photo ? 'none' : 'flex'}}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-sm text-gray-600">{item.role}</div>
        </div>
      </div>
    </div>
  ),
  
  TeamDetail: ({ item, onClose }) => {
    if (!item) {
      return (
        <div className="flex items-center justify-center h-48 text-gray-500">
          Select a team member to view details
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            {item.photo ? (
              <img
                src={item.photo}
                alt={item.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span className="text-gray-600 font-medium" style={{display: item.photo ? 'none' : 'flex'}}>
              {item.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                <p className="text-lg text-blue-600 font-medium">{item.role}</p>
                {item.experience && <p className="text-sm text-gray-600 mt-1">{item.experience}</p>}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        
        {item.bio && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Background</h3>
            <p className="text-gray-700">{item.bio}</p>
          </div>
        )}
        
        {item.skills && item.skills.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Key Skills</h3>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
};

function _Navigator(props) {
  const { 
    fields, 
    kids, 
    title = "Navigator",
    preview = "DefaultPreview",
    detail = "DefaultDetail",
    searchable = true
  } = props;
  
  const [selectedItem, setSelectedItem] = useReduxState(props, fields.selectedItem, null);
  const [searchQuery, setSearchQuery] = useReduxState(props, fields.searchQuery, '');
  
  // Parse YAML data from text content
  const items = useMemo(() => {
    if (!kids) return [];
    
    try {
      // Get text content from kids object (parsed by text parser)
      let yamlText = '';
      if (typeof kids === 'string') {
        yamlText = kids;
      } else if (kids.text) {
        yamlText = kids.text;
      } else if (typeof kids === 'object' && kids !== null) {
        // If it's an object with no text property, it might be parsed content
        return Array.isArray(kids) ? kids : [];
      }
      
      if (!yamlText || typeof yamlText !== 'string') return [];
      
      // Simple YAML parsing for our use case
      // Split into items by lines starting with '- '
      const itemBlocks = yamlText.split(/\n(?=- )/).filter(block => block.trim());
      
      return itemBlocks.map((block, index) => {
        const lines = block.split('\n').map(line => line.trim()).filter(line => line);
        const item = { id: `item_${index}` };
        
        lines.forEach(line => {
          if (line.startsWith('- ')) line = line.substring(2);
          
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Handle arrays (simple comma-separated values in brackets)
            if (value.startsWith('[') && value.endsWith(']')) {
              value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
            }
            
            // Handle nested objects (simple key-value pairs with dots)
            if (key.includes('.')) {
              const [mainKey, subKey] = key.split('.');
              if (!item[mainKey]) item[mainKey] = {};
              item[mainKey][subKey] = value;
            } else {
              item[key] = value;
            }
          }
        });
        
        return item;
      });
    } catch (error) {
      console.error('Error parsing navigator data:', error);
      return [];
    }
  }, [kids]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.role && item.role.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

  const selectedItemData = items.find(item => item.id === selectedItem);
  
  const PreviewComponent = COMPONENT_REGISTRY[preview] || COMPONENT_REGISTRY.DefaultPreview;
  const DetailComponent = COMPONENT_REGISTRY[detail] || COMPONENT_REGISTRY.DefaultDetail;

  const handleItemClick = (itemId) => {
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div className="navigator-component border rounded-lg bg-white overflow-hidden">
      {/* Only render child content if kids is an array (compiled blocks) 
          Skip rendering if kids is text content (used for YAML data) */}
      {Array.isArray(props.kids) && renderCompiledKids(props)}
      
      <div className="flex h-96">
        {/* Left Panel - Item List */}
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          <div className="p-4 border-b bg-white">
            <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
            {searchable && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <PreviewComponent
                  key={item.id}
                  item={item}
                  isSelected={selectedItem === item.id}
                  onClick={handleItemClick}
                />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchQuery ? 'No items match your search' : 'No items available'}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel - Detail View */}
        <div className="flex-1 bg-white">
          <DetailComponent
            item={selectedItemData}
            onClose={handleCloseDetail}
          />
        </div>
      </div>
    </div>
  );
}

export default _Navigator;