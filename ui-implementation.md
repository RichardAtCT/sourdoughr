# UI Implementation

Based on the provided sourdough fermentation data from The Sourdough Journey, I'll outline a detailed implementation plan for the user interface of the sourdough bulk fermentation calculator.

## React Component Structure

```
App
├── Header
├── CalculatorForm
│   ├── TemperatureInput
│   ├── StarterPercentageInput
│   ├── RiseTargetSelector
│   └── AdvancedOptionsToggle
│       └── AdvancedOptions (conditional)
├── ResultsDisplay
│   ├── TimePrediction
│   ├── ConfidenceInterval
│   ├── CompletionTimeCalculator
│   └── WarningMessages
├── FermentationTimeline
└── EducationalContent
    ├── FermentationBasics
    ├── TemperatureEffects
    └── StarterInfo
```

## Main App Component

```jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import FermentationTimeline from './components/FermentationTimeline';
import EducationalContent from './components/EducationalContent';
import { calculateFermentationTime } from './utils/calculationEngine';
import './App.css';

function App() {
  // State for input values
  const [temperature, setTemperature] = useState(70);
  const [tempUnit, setTempUnit] = useState('F');
  const [starterPercentage, setStarterPercentage] = useState(15);
  const [targetRise, setTargetRise] = useState(75);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    flourType: 'standard', // standard = 90% bread flour, 10% whole wheat
    saltPercentage: 2,
    starterActivity: 'normal',
  });
  
  // State for calculation results
  const [results, setResults] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  
  // Calculate fermentation time whenever inputs change
  useEffect(() => {
    // Convert temperature if needed
    const tempInF = tempUnit === 'C' 
      ? (temperature * 9/5) + 32 
      : temperature;
    
    const calculationResult = calculateFermentationTime(
      tempInF,
      starterPercentage,
      targetRise,
      advancedOptions
    );
    
    setResults(calculationResult);
  }, [temperature, tempUnit, starterPercentage, targetRise, advancedOptions]);
  
  return (
    <div className="app-container">
      <Header />
      
      <main className="calculator-container">
        <CalculatorForm
          temperature={temperature}
          setTemperature={setTemperature}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
          starterPercentage={starterPercentage}
          setStarterPercentage={setStarterPercentage}
          targetRise={targetRise}
          setTargetRise={setTargetRise}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          advancedOptions={advancedOptions}
          setAdvancedOptions={setAdvancedOptions}
        />
        
        {results && (
          <>
            <ResultsDisplay
              results={results}
              startTime={startTime}
              setStartTime={setStartTime}
            />
            
            <FermentationTimeline
              estimatedTime={results.estimatedTime}
              minTime={results.minTime}
              maxTime={results.maxTime}
              startTime={startTime}
            />
          </>
        )}
      </main>
      
      <EducationalContent />
      
      <footer className="app-footer">
        <p>Data source: <a href="https://thesourdoughjourney.com">The Sourdough Journey</a> V1.0 Dec 2022</p>
        <p>Based on empirical testing with 90% King Arthur Bread Flour, 10% King Arthur Whole Wheat Flour, 2% Salt</p>
      </footer>
    </div>
  );
}

export default App;
```

## Calculator Form Component

```jsx
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
        <h2>Bulk Fermentation Calculator</h2>
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
```

## Temperature Input Component

```jsx
import React from 'react';
import './TemperatureInput.css';

function TemperatureInput({ temperature, setTemperature, tempUnit, setTempUnit }) {
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
      setTemperature(Math.round((temperature - 32) * 5 / 9));
      setTempUnit('C');
    } else {
      // Convert C to F
      setTemperature(Math.round((temperature * 9 / 5) + 32));
      setTempUnit('F');
    }
  };
  
  // Get min/max values based on unit
  const minTemp = tempUnit === 'F' ? 50 : 10;
  const maxTemp = tempUnit === 'F' ? 85 : 30;
  
  // Create temperature preset buttons
  const presets = tempUnit === 'F' 
    ? [
        { label: 'Cool Room (65°F)', value: 65 },
        { label: 'Room Temp (70°F)', value: 70 },
        { label: 'Warm Room (75°F)', value: 75 }
      ]
    : [
        { label: 'Cool Room (18°C)', value: 18 },
        { label: 'Room Temp (21°C)', value: 21 },
        { label: 'Warm Room (24°C)', value: 24 }
      ];
  
  return (
    <div className="temperature-input">
      <label htmlFor="temperature">Dough Temperature</label>
      
      <div className="temp-input-container">
        <input
          id="temperature"
          type="number"
          min={minTemp}
          max={maxTemp}
          value={temperature}
          onChange={handleTempChange}
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
          min={minTemp}
          max={maxTemp}
          value={temperature}
          onChange={handleTempChange}
        />
        <div className="temp-range-labels">
          <span>{minTemp}°{tempUnit}</span>
          <span>{maxTemp}°{tempUnit}</span>
        </div>
      </div>
      
      <div className="temp-presets">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setTemperature(preset.value)}
            className={temperature === preset.value ? 'active' : ''}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="input-note">
        <p>Data is most accurate between {tempUnit === 'F' ? '66-74°F' : '19-23°C'}.</p>
      </div>
    </div>
  );
}

export default TemperatureInput;
```

## Starter Percentage Input Component

```jsx
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
        <span className="tooltip" title="Starter percentage is the amount of starter relative to flour weight. For example, in a recipe with 1000g flour, 20% starter would be 200g.">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
            <text x="12" y="16" textAnchor="middle" fontSize="12">?</text>
          </svg>
        </span>
      </label>
      
      <div className="percentage-input-container">
        <input
          id="starterPercentage"
          type="number"
          min="5"
          max="25"
          value={starterPercentage}
          onChange={handlePercentageChange}
        />
        <span className="percentage-unit">%</span>
      </div>
      
      <div className="percentage-slider">
        <input
          type="range"
          min="5"
          max="25"
          step="1"
          value={starterPercentage}
          onChange={handlePercentageChange}
        />
        <div className="percentage-range-labels">
          <span>5%</span>
          <span>25%</span>
        </div>
      </div>
      
      <div className="percentage-presets">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setStarterPercentage(preset.value)}
            className={starterPercentage === preset.value ? 'active' : ''}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="input-note">
        <p>Data is available for starter percentages between 5% and 20%.</p>
      </div>
    </div>
  );
}

export default StarterPercentageInput;
```

## Results Display Component

```jsx
import React from 'react';
import { formatTime } from '../utils/timeUtils';
import './ResultsDisplay.css';

function ResultsDisplay({ results, startTime, setStartTime }) {
  const { estimatedTime, minTime, maxTime, warnings } = results;
  
  // Format the results for display
  const formattedTime = formatTime(estimatedTime);
  const formattedMinTime = formatTime(minTime);
  const formattedMaxTime = formatTime(maxTime);
  
  // Calculate estimated completion time
  const completionTime = new Date(startTime);
  completionTime.setTime(completionTime.getTime() + (estimatedTime * 60 * 60 * 1000));
  
  // Format times for display
  const formatTimeString = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDateString = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  // Handle start time changes
  const handleStartTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const newStartTime = new Date();
    newStartTime.setHours(parseInt(hours, 10));
    newStartTime.setMinutes(parseInt(minutes, 10));
    newStartTime.setSeconds(0);
    setStartTime(newStartTime);
  };
  
  const now = new Date();
  const startTimeString = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`;
  
  return (
    <div className="results-display">
      <div className="primary-result">
        <h2>Bulk Fermentation Time</h2>
        <div className="time-result">{formattedTime}</div>
        
        <div className="time-range">
          <span className="range-label">Expected Range:</span>
          <span className="range-values">
            {formattedMinTime} - {formattedMaxTime}
          </span>
        </div>
      </div>
      
      {warnings.length > 0 && (
        <div className="warning-messages">
          <h3>Notes:</h3>
          <ul>
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="completion-calculator">
        <h3>Calculate Completion Time</h3>
        
        <div className="start-time-selector">
          <label htmlFor="startTime">Start Time:</label>
          <input
            id="startTime"
            type="time"
            value={startTimeString}
            onChange={handleStartTimeChange}
          />
          <button 
            className="use-current-time"
            onClick={() => setStartTime(new Date())}
          >
            Use Current Time
          </button>
        </div>
        
        <div className="completion-time">
          <h4>Estimated Completion:</h4>
          <div className="completion-time-display">
            <span className="time">{formatTimeString(completionTime)}</span>
            <span className="date">{formatDateString(completionTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;
```

## Fermentation Timeline Component

```jsx
import React, { useEffect, useRef } from 'react';
import './FermentationTimeline.css';

function FermentationTimeline({ estimatedTime, minTime, maxTime, startTime }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Timeline configuration
    const timelineY = canvas.height / 2;
    const timelineStartX = 50;
    const timelineEndX = canvas.width - 50;
    const timelineLength = timelineEndX - timelineStartX;
    
    // Draw the base timeline
    ctx.beginPath();
    ctx.moveTo(timelineStartX, timelineY);
    ctx.lineTo(timelineEndX, timelineY);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Calculate positions
    const maxTimelineHours = Math.ceil(maxTime * 1.2); // Allow some extra space
    const pixelsPerHour = timelineLength / maxTimelineHours;
    
    // Draw time markers
    for (let i = 0; i <= maxTimelineHours; i += 2) {
      const x = timelineStartX + i * pixelsPerHour;
      
      ctx.beginPath();
      ctx.moveTo(x, timelineY - 5);
      ctx.lineTo(x, timelineY + 5);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.fillStyle = '#666';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${i}h`, x, timelineY + 20);
    }
    
    // Draw the range (min to max time)
    const minX = timelineStartX + minTime * pixelsPerHour;
    const maxX = timelineStartX + maxTime * pixelsPerHour;
    
    ctx.beginPath();
    ctx.moveTo(minX, timelineY);
    ctx.lineTo(maxX, timelineY);
    ctx.strokeStyle = '#5b9bd5';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    // Draw the estimated time marker
    const estimatedX = timelineStartX + estimatedTime * pixelsPerHour;
    
    ctx.beginPath();
    ctx.arc(estimatedX, timelineY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e3a8a';
    ctx.fill();
    
    // Draw current progress if fermentation has started
    const now = new Date();
    const hoursElapsed = (now - startTime) / (1000 * 60 * 60);
    
    if (hoursElapsed > 0) {
      const progressX = timelineStartX + Math.min(hoursElapsed, maxTimelineHours) * pixelsPerHour;
      
      // Draw progress line
      ctx.beginPath();
      ctx.moveTo(timelineStartX, timelineY);
      ctx.lineTo(progressX, timelineY);
      ctx.strokeStyle = '#38b2ac';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw current time marker
      ctx.beginPath();
      ctx.arc(progressX, timelineY, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#38b2ac';
      ctx.fill();
      
      // Add "Now" label
      ctx.fillStyle = '#38b2ac';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Now', progressX, timelineY - 15);
    }
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Estimated: ${estimatedTime.toFixed(1)} hours`, estimatedX, timelineY - 25);
    
  }, [estimatedTime, minTime, maxTime, startTime]);
  
  return (
    <div className="fermentation-timeline">
      <h3>Fermentation Timeline</h3>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={150}
        className="timeline-canvas"
      />
    </div>
  );
}

export default FermentationTimeline;
```

## CSS Implementation (App.css)

```css
/* Basic Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Open Sans', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f5f0;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Header Styles */
header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0d6c8;
}

header h1 {
  font-family: 'Merriweather', serif;
  color: #754c24;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

header p {
  color: #5c4c3a;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Main Calculator Container */
.calculator-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

@media (min-width: 768px) {
  .calculator-container {
    grid-template-columns: 1fr 1fr;
  }
}

/* Form Styles */
.calculator-form {
  background-color: #fff;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-section {
  margin-bottom: 20px;
}

.form-section h2 {
  font-family: 'Merriweather', serif;
  color: #754c24;
  margin-bottom: 15px;
}

.form-intro {
  margin-bottom: 20px;
  color: #5c4c3a;
}

/* Results Display */
.results-display {
  background-color: #fff;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.primary-result {
  text-align: center;
  margin-bottom: 25px;
}

.primary-result h2 {
  font-family: 'Merriweather', serif;
  color: #754c24;
  margin-bottom: 15px;
}

.time-result {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 10px;
}

.time-range {
  font-size: 1.1rem;
  color: #5c4c3a;
}

/* Buttons & Inputs */
button {
  background-color: #f5f0e8;
  border: 1px solid #d6c8b6;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

button:hover {
  background-color: #e0d6c8;
}

button.active {
  background-color: #c8b6a2;
  color: #fff;
}

input[type="number"],
input[type="time"] {
  border: 1px solid #d6c8b6;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 1rem;
  width: 100%;
}

input[type="range"] {
  width: 100%;
  margin: 10px 0;
}

/* Footer */
.app-footer {
  text-align: center;
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #e0d6c8;
  color: #8c7c6a;
  font-size: 0.9rem;
}

.app-footer a {
  color: #754c24;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}
```

## Responsive Design Considerations

The UI has been designed with responsiveness in mind:

1. **Mobile-First Approach**:
   - Single column layout for small screens
   - Grid layout for larger screens
   - Appropriate touch targets for mobile users

2. **Flexible Components**:
   - Percentage-based widths
   - Min/max constraints to prevent elements from becoming too large or small
   - Media queries for layout changes at different breakpoints

3. **Typography Scaling**:
   - Relative font sizes (rem)
   - Readable text at all screen sizes
   - Proper line heights for readability

4. **Input Controls**:
   - Large, touch-friendly buttons and sliders
   - Clear visual feedback for active states
   - Simplified interface on smaller screens

This UI implementation provides a clean, intuitive interface for the sourdough bulk fermentation calculator, focusing on ease of use while incorporating the empirical data from The Sourdough Journey.
