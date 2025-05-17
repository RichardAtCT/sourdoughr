# Working Prototype Implementation

Let's create a functional prototype of the Sourdough Bulk Fermentation Calculator using React. This implementation includes the core functionality based on the empirical data from The Sourdough Journey.

```jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SourdoughCalculator = () => {
  // State for input values
  const [temperature, setTemperature] = useState(70);
  const [tempUnit, setTempUnit] = useState('F');
  const [starterPercentage, setStarterPercentage] = useState(15);
  const [targetRise, setTargetRise] = useState(75);
  
  // State for calculation results
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [timeRange, setTimeRange] = useState({ min: null, max: null });
  const [warnings, setWarnings] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [completionTime, setCompletionTime] = useState(null);
  
  // Data from The Sourdough Journey
  const fermentationData = {
    "5%": {
      "66F": { "75%": 18.5, "100%": 20.0 },
      "68F": { "75%": 18.0, "100%": 19.5 },
      "70F": { "75%": 17.5, "100%": 19.0 },
      "72F": { "75%": 16.5, "100%": 17.5 },
      "74F": { "75%": 14.0, "100%": 15.5 }
    },
    "10%": {
      "66F": { "75%": 17.0, "100%": 18.5 },
      "68F": { "75%": 15.5, "100%": 17.5 },
      "70F": { "75%": 15.0, "100%": 17.0 },
      "72F": { "75%": 14.0, "100%": 15.0 },
      "74F": { "75%": 12.5, "100%": 14.0 }
    },
    "15%": {
      "66F": { "75%": 14.5, "100%": 16.5 },
      "68F": { "75%": 13.5, "100%": 15.5 },
      "70F": { "75%": 13.0, "100%": 15.0 },
      "72F": { "75%": 12.5, "100%": 13.5 },
      "74F": { "75%": 10.5, "100%": 11.5 }
    },
    "20%": {
      "66F": { "75%": 13.0, "100%": 14.5 },
      "68F": { "75%": 12.0, "100%": 14.0 },
      "70F": { "75%": 11.5, "100%": 13.0 },
      "72F": { "75%": 10.5, "100%": 11.5 },
      "74F": { "75%": 8.5, "100%": 9.5 }
    }
  };
  
  // Temperature utility functions
  const celsiusToFahrenheit = (celsius) => (celsius * 9/5) + 32;
  const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;
  
  // Format time in hours to a readable string
  const formatTime = (timeInHours) => {
    if (timeInHours === null) return '';
    
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    
    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    if (minutes > 0) {
      if (hours > 0) result += ' ';
      result += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    
    return result;
  };
  
  // Find nearest data points and interpolate
  const calculateFermentationTime = () => {
    // Convert to Fahrenheit if needed
    const tempF = tempUnit === 'C' ? celsiusToFahrenheit(temperature) : temperature;
    const starterKey = `${starterPercentage}%`;
    const riseKey = `${targetRise}%`;
    
    // Reset warnings
    const newWarnings = [];
    
    // Check if temperature is outside our data range
    if (tempF < 66) {
      newWarnings.push("Temperature is below the tested range (66°F/19°C). Results may be less accurate.");
    } else if (tempF > 74) {
      newWarnings.push("Temperature is above the tested range (74°F/23°C). Results may be less accurate.");
    }
    
    // Check if starter percentage exists in our data
    let useStarterKey = null;
    if (starterPercentage === 5) useStarterKey = "5%";
    else if (starterPercentage === 10) useStarterKey = "10%";
    else if (starterPercentage === 15) useStarterKey = "15%";
    else if (starterPercentage === 20) useStarterKey = "20%";
    else {
      // Interpolate between starter percentages
      if (starterPercentage < 5) {
        newWarnings.push("Starter percentage is below the tested range (5%). Results may be less accurate.");
        useStarterKey = "5%";
      } else if (starterPercentage > 20) {
        newWarnings.push("Starter percentage is above the tested range (20%). Results may be less accurate.");
        useStarterKey = "20%";
      } else {
        // Find the nearest starter percentages
        const starterValues = [5, 10, 15, 20];
        const lowerStarter = Math.max(...starterValues.filter(s => s <= starterPercentage));
        const upperStarter = Math.min(...starterValues.filter(s => s >= starterPercentage));
        
        // Interpolate between known percentages
        const lowerStarterKey = `${lowerStarter}%`;
        const upperStarterKey = `${upperStarter}%`;
        
        // Find temperature values
        const lowerTempF = Math.floor(tempF / 2) * 2;
        const upperTempF = Math.ceil(tempF / 2) * 2;
        
        // Ensure we're within our data range
        const minTempF = 66;
        const maxTempF = 74;
        const lowerBoundedTempF = Math.max(minTempF, Math.min(maxTempF, lowerTempF));
        const upperBoundedTempF = Math.max(minTempF, Math.min(maxTempF, upperTempF));
        
        const lowerTempKey = `${lowerBoundedTempF}F`;
        const upperTempKey = `${upperBoundedTempF}F`;
        
        // Calculate interpolation weights
        const starterWeight = (starterPercentage - lowerStarter) / (upperStarter - lowerStarter);
        const tempWeight = (tempF - lowerBoundedTempF) / (upperBoundedTempF - lowerBoundedTempF);
        
        // Get the four data points for bilinear interpolation
        const q11 = fermentationData[lowerStarterKey][lowerTempKey][riseKey];
        const q12 = fermentationData[lowerStarterKey][upperTempKey][riseKey];
        const q21 = fermentationData[upperStarterKey][lowerTempKey][riseKey];
        const q22 = fermentationData[upperStarterKey][upperTempKey][riseKey];
        
        // Bilinear interpolation formula
        const lowerInterp = q11 * (1 - tempWeight) + q12 * tempWeight;
        const upperInterp = q21 * (1 - tempWeight) + q22 * tempWeight;
        const result = lowerInterp * (1 - starterWeight) + upperInterp * starterWeight;
        
        setEstimatedTime(result);
        
        // Calculate time range (±10% as a simple confidence interval)
        const minTime = result * 0.9;
        const maxTime = result * 1.1;
        setTimeRange({ min: minTime, max: maxTime });
        
        // Calculate completion time
        const completionDate = new Date(startTime);
        completionDate.setTime(completionDate.getTime() + (result * 60 * 60 * 1000));
        setCompletionTime(completionDate);
        
        setWarnings(newWarnings);
        return;
      }
    }
    
    // If we're using exact starter percentage values
    // Find temperature keys
    const lowerTempF = Math.floor(tempF / 2) * 2;
    const upperTempF = Math.ceil(tempF / 2) * 2;
    
    // Ensure we're within our data range
    const minTempF = 66;
    const maxTempF = 74;
    const lowerBoundedTempF = Math.max(minTempF, Math.min(maxTempF, lowerTempF));
    const upperBoundedTempF = Math.max(minTempF, Math.min(maxTempF, upperTempF));
    
    const lowerTempKey = `${lowerBoundedTempF}F`;
    const upperTempKey = `${upperBoundedTempF}F`;
    
    // Linear interpolation between temperatures
    const tempWeight = (tempF - lowerBoundedTempF) / (upperBoundedTempF - lowerBoundedTempF);
    
    // Get the two data points for linear interpolation
    const lowerTime = fermentationData[useStarterKey][lowerTempKey][riseKey];
    const upperTime = fermentationData[useStarterKey][upperTempKey][riseKey];
    
    // Linear interpolation formula
    const result = lowerTime * (1 - tempWeight) + upperTime * tempWeight;
    
    setEstimatedTime(result);
    
    // Calculate time range (±10% as a simple confidence interval)
    const minTime = result * 0.9;
    const maxTime = result * 1.1;
    setTimeRange({ min: minTime, max: maxTime });
    
    // Calculate completion time
    const completionDate = new Date(startTime);
    completionDate.setTime(completionDate.getTime() + (result * 60 * 60 * 1000));
    setCompletionTime(completionDate);
    
    setWarnings(newWarnings);
  };
  
  // Generate data for visualization
  const generateChartData = () => {
    const data = [];
    
    // Generate data points for each starter percentage
    [5, 10, 15, 20].forEach(starter => {
      for (let temp = 66; temp <= 74; temp += 2) {
        data.push({
          temperature: temp,
          [`${starter}% Starter`]: fermentationData[`${starter}%`][`${temp}F`][`${targetRise}%`]
        });
      }
    });
    
    return data;
  };
  
  // Format time for display
  const formatTimeOfDay = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculate fermentation time whenever inputs change
  useEffect(() => {
    calculateFermentationTime();
  }, [temperature, tempUnit, starterPercentage, targetRise, startTime]);
  
  // Handle start time change
  const handleStartTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const newStartTime = new Date();
    newStartTime.setHours(parseInt(hours));
    newStartTime.setMinutes(parseInt(minutes));
    setStartTime(newStartTime);
  };
  
  // Format start time for input
  const formatTimeForInput = (date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  return (
    <div className="sourdough-calculator">
      <div className="calculator-header">
        <h1>Sourdough Bulk Fermentation Calculator</h1>
        <p>Calculate fermentation times based on empirical data from The Sourdough Journey</p>
      </div>
      
      <div className="calculator-grid">
        <div className="input-panel">
          <div className="input-section">
            <h2>Input Parameters</h2>
            
            {/* Temperature Input */}
            <div className="input-group">
              <label>Dough Temperature</label>
              <div className="temperature-input">
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  min={tempUnit === 'F' ? 50 : 10}
                  max={tempUnit === 'F' ? 85 : 30}
                />
                <div className="unit-toggle">
                  <button 
                    className={tempUnit === 'F' ? 'active' : ''}
                    onClick={() => {
                      if (tempUnit === 'C') {
                        setTemperature(Math.round(celsiusToFahrenheit(temperature)));
                        setTempUnit('F');
                      }
                    }}
                  >
                    °F
                  </button>
                  <button 
                    className={tempUnit === 'C' ? 'active' : ''}
                    onClick={() => {
                      if (tempUnit === 'F') {
                        setTemperature(Math.round(fahrenheitToCelsius(temperature)));
                        setTempUnit('C');
                      }
                    }}
                  >
                    °C
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={tempUnit === 'F' ? 60 : 15}
                max={tempUnit === 'F' ? 80 : 27}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="temp-slider"
              />
              <div className="input-note">
                Tested range: {tempUnit === 'F' ? '66-74°F' : '19-23°C'}
              </div>
            </div>
            
            {/* Starter Percentage Input */}
            <div className="input-group">
              <label>Starter Percentage</label>
              <div className="starter-input">
                <input
                  type="number"
                  value={starterPercentage}
                  onChange={(e) => setStarterPercentage(parseFloat(e.target.value))}
                  min={5}
                  max={25}
                />
                <span className="input-suffix">%</span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                value={starterPercentage}
                onChange={(e) => setStarterPercentage(parseFloat(e.target.value))}
                className="starter-slider"
              />
              <div className="preset-buttons">
                {[5, 10, 15, 20].map(percent => (
                  <button
                    key={percent}
                    className={starterPercentage === percent ? 'active' : ''}
                    onClick={() => setStarterPercentage(percent)}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
              <div className="input-note">
                Tested range: 5-20%
              </div>
            </div>
            
            {/* Rise Target Selection */}
            <div className="input-group">
              <label>Target Rise</label>
              <div className="rise-selector">
                <button
                  className={targetRise === 75 ? 'active' : ''}
                  onClick={() => setTargetRise(75)}
                >
                  75% Rise
                </button>
                <button
                  className={targetRise === 100 ? 'active' : ''}
                  onClick={() => setTargetRise(100)}
                >
                  100% Rise
                </button>
              </div>
            </div>
            
            {/* Start Time Input */}
            <div className="input-group">
              <label>Start Time</label>
              <div className="time-input">
                <input
                  type="time"
                  value={formatTimeForInput(startTime)}
                  onChange={handleStartTimeChange}
                />
                <button
                  onClick={() => setStartTime(new Date())}
                >
                  Use Current Time
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="results-panel">
          <div className="results-section">
            <h2>Fermentation Time</h2>
            
            {estimatedTime !== null && (
              <>
                <div className="primary-result">
                  {formatTime(estimatedTime)}
                </div>
                
                <div className="time-range">
                  Expected range: {formatTime(timeRange.min)} - {formatTime(timeRange.max)}
                </div>
                
                {warnings.length > 0 && (
                  <div className="warnings">
                    {warnings.map((warning, index) => (
                      <div key={index} className="warning-message">
                        ⚠️ {warning}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="completion-time">
                  <h3>Estimated Completion</h3>
                  <div className="completion-display">
                    {completionTime && (
                      <>
                        <div className="completion-time-value">
                          {formatTimeOfDay(completionTime)}
                        </div>
                        <div className="completion-date">
                          {completionTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="chart-section">
            <h3>Fermentation Time Chart</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="temperature" 
                    label={{ value: 'Temperature (°F)', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'Fermentation Time (hours)', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip formatter={(value) => [`${value} hours`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="5% Starter" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="10% Starter" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="15% Starter" stroke="#ffc658" />
                  <Line type="monotone" dataKey="20% Starter" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      <div className="info-section">
        <h2>About this Calculator</h2>
        <p>
          This calculator is based on empirical data from The Sourdough Journey, who conducted over 60 tests with high levels of repeatability.
        </p>
        <h3>Recipe Used for Testing:</h3>
        <p>
          100g flour weight batches: 90% King Arthur Bread Flour, 10% King Arthur Whole Wheat Flour, 2% Salt, with starter percentages of 5%, 10%, 15%, and 20%. 
          Starter was fed 1:2:2 approximately 4-6 hours prior to mixing and generally used at or near peak volume.
        </p>
        <h3>Notes:</h3>
        <p>
          Everyone's starter is different. Your starter strength may produce different results, but the results should be relatively consistent. 
          For example, if your initial tests show faster rise times, it is likely that all of your results will be faster in a consistent proportion to the estimates.
        </p>
        <div className="data-attribution">
          Data source: <a href="https://thesourdoughjourney.com" target="_blank" rel="noopener noreferrer">The Sourdough Journey</a> (V1.0 Dec 2022)
        </div>
      </div>
    </div>
  );
};

export default SourdoughCalculator;
```

## Styling for the Application

```css
/* Main container styles */
.sourdough-calculator {
  font-family: 'Open Sans', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
  background-color: #f9f5f0;
}

/* Header styles */
.calculator-header {
  text-align: center;
  margin-bottom: 30px;
}

.calculator-header h1 {
  font-family: 'Merriweather', serif;
  color: #754c24;
  margin-bottom: 10px;
}

.calculator-header p {
  color: #5c4c3a;
  font-size: 1.1rem;
}

/* Grid layout */
.calculator-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

@media (min-width: 768px) {
  .calculator-grid {
    grid-template-columns: 1fr 1.5fr;
  }
}

/* Panel styles */
.input-panel, .results-panel {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

/* Section headings */
.input-section h2, .results-section h2, .chart-section h3, .info-section h2, .info-section h3 {
  font-family: 'Merriweather', serif;
  color: #754c24;
  margin-bottom: 20px;
}

/* Input groups */
.input-group {
  margin-bottom: 25px;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #5c4c3a;
}

/* Input styles */
input[type="number"], input[type="time"] {
  padding: 10px;
  border: 1px solid #d6c8b6;
  border-radius: 5px;
  font-size: 1rem;
  width: 120px;
}

input[type="range"] {
  width: 100%;
  margin: 15px 0;
}

/* Unit toggle and preset buttons */
.unit-toggle, .preset-buttons, .rise-selector {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  background-color: #f5f0e8;
  border: 1px solid #d6c8b6;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background-color: #e0d6c8;
}

button.active {
  background-color: #c8b6a2;
  color: white;
}

/* Input containers */
.temperature-input, .starter-input, .time-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-suffix {
  font-size: 1rem;
  color: #5c4c3a;
}

.input-note {
  font-size: 0.9rem;
  color: #8c7c6a;
  margin-top: 8px;
}

/* Results styling */
.primary-result {
  font-size: 3rem;
  font-weight: bold;
  color: #1e3a8a;
  text-align: center;
  margin: 20px 0;
}

.time-range {
  text-align: center;
  font-size: 1.1rem;
  color: #5c4c3a;
  margin-bottom: 20px;
}

/* Warnings */
.warnings {
  margin: 20px 0;
  padding: 15px;
  background-color: #fff8e6;
  border-left: 4px solid #ffd166;
  border-radius: 0 5px 5px 0;
}

.warning-message {
  margin: 5px 0;
  color: #7d6c00;
}

/* Completion time */
.completion-time {
  margin: 25px 0;
  text-align: center;
  padding: 15px;
  background-color: #f0f7ff;
  border-radius: 8px;
}

.completion-time h3 {
  color: #1e3a8a;
  margin-bottom: 10px;
}

.completion-display {
  font-size: 1.2rem;
}

.completion-time-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1e3a8a;
}

.completion-date {
  color: #4a5568;
}

/* Chart section */
.chart-section {
  margin-top: 30px;
}

.chart-container {
  margin-top: 20px;
  border: 1px solid #e0d6c8;
  border-radius: 8px;
  padding: 10px;
  background-color: #fff;
}

/* Info section */
.info-section {
  margin-top: 40px;
  padding: 25px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.info-section p {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #5c4c3a;
}

.data-attribution {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #e0d6c8;
  text-align: center;
  font-size: 0.9rem;
  color: #8c7c6a;
}

.data-attribution a {
  color: #754c24;
  text-decoration: none;
}

.data-attribution a:hover {
  text-decoration: underline;
}
```

## Usage Instructions

To use this prototype:

1. Create a new React application:
   ```
   npx create-react-app sourdough-calculator
   cd sourdough-calculator
   ```

2. Install required dependencies:
   ```
   npm install recharts
   ```

3. Replace the content of `src/App.js` with the React component code above.

4. Create a file `src/App.css` and add the CSS code provided.

5. Update `src/index.js` to import and use the component:
   ```jsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import './index.css';
   import SourdoughCalculator from './App';

   const root = ReactDOM.createRoot(document.getElementById('root'));
   root.render(
     <React.StrictMode>
       <SourdoughCalculator />
     </React.StrictMode>
   );
   ```

6. Start the development server:
   ```
   npm start
   ```

This prototype includes:

1. **Accurate Data Implementation** - Using the exact data from The Sourdough Journey's empirical testing
2. **Bilinear Interpolation** - For values between the tested data points
3. **Temperature Unit Conversion** - Toggle between Fahrenheit and Celsius
4. **Visual Chart** - Showing the relationship between temperature, starter percentage, and fermentation time
5. **Time Calculations** - Both fermentation duration and expected completion time
6. **Responsive Design** - Works on both desktop and mobile devices
7. **Proper Attribution** - Credit to the original data source

The application allows users to input their dough temperature, starter percentage, and choose between 75% and 100% rise targets to calculate the expected bulk fermentation time.
