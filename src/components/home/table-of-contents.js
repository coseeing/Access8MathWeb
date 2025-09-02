import React from 'react';

export default function TableOfContents({ headers, onHeaderClick }) {
  if (!headers || headers.length === 0) {
    return null;
  }

  return (
    <nav
      className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
      role="navigation"
      aria-label="文件目錄"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-3" id="toc-heading">
        目錄
      </h3>
      <ul className="space-y-2" role="list" aria-labelledby="toc-heading">
        {headers.map((header, index) => (
          <li key={index} role="listitem">
            <button
              onClick={() => onHeaderClick(header.line)}
              className="text-left w-full text-cyan hover:text-cyan-dark hover:bg-gray-50 px-2 py-1 rounded transition-colors duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-offset-1"
              aria-label={`跳轉到：${header.title}`}
              type="button"
            >
              {header.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
