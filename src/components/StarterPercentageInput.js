import React from 'react';
import './StarterPercentageInput.css';

function StarterPercentageInput({ starterPercentage, setStarterPercentage }) {
  // Handle starter percentage changes
  const handlePercentageChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setStarterPercentage(value);
    }
  };
  
  // Create preset buttons
  const presets = [
    { label: '5%', value: 5 },
    { label: '10%', value: 10 },
    { label: '15%', value: 15 },
    { label: '20%', value: 20 }
  ];
  
  return (
    <div className="starter-percentage-input">
      <label htmlFor="starterPercentage">
        Starter Percentage
        <span className="tooltip" title="Starter percentage is calculated as a percentage of total flour weight. For example, in a recipe with 1000g flour, 20% starter would be 200g.">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">?</text>
          </svg>
        </span>
      </label>
      
      <div className="percentage-input-container">
        <input
          id="starterPercentage"
          type="number"
          min="5"
          max="30"
          value={starterPercentage}
          onChange={handlePercentageChange}
          aria-label="Starter percentage"
        />
        <span className="percentage-unit">%</span>
      </div>
      
      <div className="percentage-slider">
        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={starterPercentage}
          onChange={handlePercentageChange}
          aria-label="Starter percentage slider"
        />
        <div className="percentage-range-labels">
          <span>5%</span>
          <span>30%</span>
        </div>
      </div>
      
      <div className="percentage-presets">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setStarterPercentage(preset.value)}
            className={starterPercentage === preset.value ? 'active' : ''}
            aria-pressed={starterPercentage === preset.value}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="input-note">
        <p>Note: Data is most accurate between 5% and 20% starter.</p>
      </div>
    </div>
  );
}

export default StarterPercentageInput;