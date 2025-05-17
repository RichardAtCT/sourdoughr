import React from 'react';
import { formatTime, formatTimeForInput, formatTimeOfDay, formatDate } from '../utils/timeUtils';
import './ResultsDisplay.css';

function ResultsDisplay({ results, startTime, setStartTime, completionTime }) {
  const { estimatedTime, minTime, maxTime, warnings } = results;
  
  // Handle start time changes
  const handleStartTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(':');
    const newStartTime = new Date();
    newStartTime.setHours(parseInt(hours, 10));
    newStartTime.setMinutes(parseInt(minutes, 10));
    newStartTime.setSeconds(0);
    setStartTime(newStartTime);
  };
  
  return (
    <div className="results-display">
      <div className="primary-result">
        <h2>Bulk Fermentation Time</h2>
        <div className="time-result">{formatTime(estimatedTime)}</div>
        
        <div className="time-range">
          <span className="range-label">Expected Range:</span>
          <span className="range-values">
            {formatTime(minTime)} - {formatTime(maxTime)}
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
            value={formatTimeForInput(startTime)}
            onChange={handleStartTimeChange}
            aria-label="Start time"
          />
          <button 
            className="use-current-time"
            onClick={() => setStartTime(new Date())}
          >
            Use Current Time
          </button>
        </div>
        
        {completionTime && (
          <div className="completion-time">
            <h4>Estimated Completion:</h4>
            <div className="completion-time-display">
              <span className="time">{formatTimeOfDay(completionTime)}</span>
              <span className="date">{formatDate(completionTime)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsDisplay;