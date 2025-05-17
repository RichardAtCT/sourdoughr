import React from 'react';
import './RiseTargetSelector.css';

function RiseTargetSelector({ targetRise, setTargetRise }) {
  return (
    <div className="rise-target-selector">
      <label>
        Target Rise
        <span className="tooltip" title="Choose your desired dough volume increase. 75% is typical for many recipes, while 100% would be double the initial volume.">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">?</text>
          </svg>
        </span>
      </label>
      
      <div className="rise-buttons">
        <button
          onClick={() => setTargetRise(75)}
          className={targetRise === 75 ? 'active' : ''}
          aria-pressed={targetRise === 75}
        >
          75% Rise
        </button>
        <button
          onClick={() => setTargetRise(100)}
          className={targetRise === 100 ? 'active' : ''}
          aria-pressed={targetRise === 100}
        >
          100% Rise (Double)
        </button>
      </div>
      
      <div className="input-note">
        <p>Note: 75% rise is typically sufficient for most recipes before shaping.</p>
      </div>
    </div>
  );
}

export default RiseTargetSelector;