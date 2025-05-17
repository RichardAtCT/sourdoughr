import React from 'react';
import TemperatureInput from './TemperatureInput';
import StarterPercentageInput from './StarterPercentageInput';
import RiseTargetSelector from './RiseTargetSelector';
import AdvancedOptions from './AdvancedOptions';
import './CalculatorForm.css';

function CalculatorForm({
  temperature,
  setTemperature,
  tempUnit,
  setTempUnit,
  starterPercentage,
  setStarterPercentage,
  targetRise,
  setTargetRise,
  showAdvanced,
  setShowAdvanced,
  advancedOptions,
  setAdvancedOptions
}) {
  return (
    <div className="calculator-form">
      <div className="form-section">
        <h2>Input Parameters</h2>
        <p className="form-intro">
          Enter your dough temperature and starter percentage to calculate the estimated bulk fermentation time.
        </p>
      </div>
      
      <div className="form-section">
        <TemperatureInput
          temperature={temperature}
          setTemperature={setTemperature}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
        />
      </div>
      
      <div className="form-section">
        <StarterPercentageInput
          starterPercentage={starterPercentage}
          setStarterPercentage={setStarterPercentage}
        />
      </div>
      
      <div className="form-section">
        <RiseTargetSelector
          targetRise={targetRise}
          setTargetRise={setTargetRise}
        />
      </div>
      
      <div className="form-section advanced-toggle">
        <button 
          className="advanced-button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>
        
        {showAdvanced && (
          <AdvancedOptions
            advancedOptions={advancedOptions}
            setAdvancedOptions={setAdvancedOptions}
          />
        )}
      </div>
    </div>
  );
}

export default CalculatorForm;