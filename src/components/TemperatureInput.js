import React from 'react';
import { getTemperatureRanges, getTemperaturePresets, celsiusToFahrenheit, fahrenheitToCelsius, roundTemperature } from '../utils/temperatureUtils';
import './TemperatureInput.css';

function TemperatureInput({ temperature, setTemperature, tempUnit, setTempUnit }) {
  // Get temperature ranges based on current unit
  const ranges = getTemperatureRanges(tempUnit);
  
  // Handle temperature input changes
  const handleTempChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setTemperature(value);
    }
  };
  
  // Handle temperature unit toggle
  const handleUnitToggle = () => {
    if (tempUnit === 'F') {
      // Convert F to C
      setTemperature(roundTemperature(fahrenheitToCelsius(temperature)));
      setTempUnit('C');
    } else {
      // Convert C to F
      setTemperature(roundTemperature(celsiusToFahrenheit(temperature)));
      setTempUnit('F');
    }
  };
  
  // Get temperature presets based on current unit
  const presets = getTemperaturePresets(tempUnit);
  
  return (
    <div className="temperature-input">
      <label htmlFor="temperature">
        Dough Temperature
        <span className="tooltip" title="This is the temperature of your dough after mixing, not the ambient temperature.">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">?</text>
          </svg>
        </span>
      </label>
      
      <div className="temp-input-container">
        <input
          id="temperature"
          type="number"
          min={ranges.min}
          max={ranges.max}
          value={temperature}
          onChange={handleTempChange}
          aria-label={`Temperature in degrees ${tempUnit === 'F' ? 'Fahrenheit' : 'Celsius'}`}
        />
        <span className="temp-unit">°{tempUnit}</span>
        <button 
          className="unit-toggle" 
          onClick={handleUnitToggle}
          aria-label={`Switch to degrees ${tempUnit === 'F' ? 'Celsius' : 'Fahrenheit'}`}
        >
          Switch to °{tempUnit === 'F' ? 'C' : 'F'}
        </button>
      </div>
      
      <div className="temp-slider">
        <input
          type="range"
          min={ranges.min}
          max={ranges.max}
          value={temperature}
          onChange={handleTempChange}
          aria-label="Temperature slider"
        />
        <div className="temp-range-labels">
          <span>{ranges.min}°{tempUnit}</span>
          <span>{ranges.max}°{tempUnit}</span>
        </div>
      </div>
      
      <div className="temp-presets">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setTemperature(preset.value)}
            className={temperature === preset.value ? 'active' : ''}
            aria-pressed={temperature === preset.value}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="input-note">
        <p>Note: Data is most accurate between {tempUnit === 'F' ? '66-74°F' : '19-23°C'}.</p>
      </div>
    </div>
  );
}

export default TemperatureInput;