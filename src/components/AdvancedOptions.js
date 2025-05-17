import React from 'react';
import './AdvancedOptions.css';

function AdvancedOptions({ advancedOptions, setAdvancedOptions }) {
  // Handle flour mix changes
  const handleFlourChange = (type, value) => {
    setAdvancedOptions({
      ...advancedOptions,
      flourMix: {
        ...advancedOptions.flourMix,
        [type]: value
      }
    });
  };
  
  // Handle salt percentage change
  const handleSaltChange = (value) => {
    setAdvancedOptions({
      ...advancedOptions,
      saltPercentage: value
    });
  };
  
  return (
    <div className="advanced-options">
      <h3>Advanced Options</h3>
      
      <div className="options-group">
        <h4>Flour Composition</h4>
        
        <div className="option-row">
          <label htmlFor="wholeWheat">Whole Wheat Flour:</label>
          <div className="option-input">
            <input
              id="wholeWheat"
              type="number"
              min="0"
              max="100"
              value={advancedOptions.flourMix.wholeWheat}
              onChange={(e) => handleFlourChange('wholeWheat', parseFloat(e.target.value))}
              aria-label="Whole wheat flour percentage"
            />
            <span className="percentage-unit">%</span>
          </div>
        </div>
        
        <div className="option-row">
          <label htmlFor="rye">Rye Flour:</label>
          <div className="option-input">
            <input
              id="rye"
              type="number"
              min="0"
              max="100"
              value={advancedOptions.flourMix.rye}
              onChange={(e) => handleFlourChange('rye', parseFloat(e.target.value))}
              aria-label="Rye flour percentage"
            />
            <span className="percentage-unit">%</span>
          </div>
        </div>
        
        <div className="option-row">
          <label htmlFor="proteinContent">Average Protein Content:</label>
          <div className="option-input">
            <input
              id="proteinContent"
              type="number"
              min="8"
              max="16"
              step="0.1"
              value={advancedOptions.flourMix.proteinContent}
              onChange={(e) => handleFlourChange('proteinContent', parseFloat(e.target.value))}
              aria-label="Average protein content percentage"
            />
            <span className="percentage-unit">%</span>
          </div>
        </div>
      </div>
      
      <div className="options-group">
        <h4>Other Ingredients</h4>
        
        <div className="option-row">
          <label htmlFor="saltPercentage">Salt Percentage:</label>
          <div className="option-input">
            <input
              id="saltPercentage"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={advancedOptions.saltPercentage}
              onChange={(e) => handleSaltChange(parseFloat(e.target.value))}
              aria-label="Salt percentage"
            />
            <span className="percentage-unit">%</span>
          </div>
        </div>
      </div>
      
      <div className="advanced-note">
        <p>Note: These advanced options provide approximate adjustments based on general fermentation principles. The base calculations come from testing with 90% bread flour, 10% whole wheat flour, and 2% salt.</p>
      </div>
    </div>
  );
}

export default AdvancedOptions;