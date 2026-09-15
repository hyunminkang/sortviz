import React from 'react';
import { BarChart3, Info } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="app-header glass-panel">
      <div className="brand-section">
        <div className="logo-badge">
          <BarChart3 size={24} color="#ffffff" />
        </div>
        <div>
          <h1 className="brand-title">
            SortViz
          </h1>
          <p className="brand-subtitle">
            Synchronized comparison of comparison-based sorting algorithms
          </p>
        </div>
      </div>

      <div className="header-links">
        <a
          href="https://www.toptal.com/developers/sorting-algorithms"
          target="_blank"
          rel="noreferrer"
          className="link-button"
        >
          <Info size={14} />
          Inspired by Toptal
        </a>
      </div>
    </header>
  );
};
