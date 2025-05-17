import React, { useState, useEffect } from 'react';
import Header from './Header';
import CalculatorForm from './CalculatorForm';
import ResultsDisplay from './ResultsDisplay';
import FermentationTimeline from './FermentationTimeline';
import EducationalContent from './EducationalContent';
import { calculateFermentationTime } from '../utils/calculationEngine';
import { calculateCompletionTime } from '../utils/timeUtils';
import './App.css';

function App() {
  // State for input values
  const [temperature, setTemperature] = useState(70);
  const [tempUnit, setTempUnit] = useState('F');
  const [starterPercentage, setStarterPercentage] = useState(15);
  const [targetRise, setTargetRise] = useState(75);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    flourMix: {
      wholeWheat: 10,
      rye: 0,
      proteinContent: 12.7
    },
    saltPercentage: 2,
  });
  
  // State for calculation results
  const [results, setResults] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [completionTime, setCompletionTime] = useState(null);
  
  // Calculate fermentation time whenever inputs change
  useEffect(() => {
    // Convert temperature if needed
    const tempInF = tempUnit === 'C' 
      ? ((temperature * 9/5) + 32) 
      : temperature;
    
    const calculationResult = calculateFermentationTime(
      tempInF,
      starterPercentage,
      targetRise,
      advancedOptions
    );
    
    setResults(calculationResult);
    
    // Calculate completion time
    if (calculationResult) {
      setCompletionTime(calculateCompletionTime(startTime, calculationResult.estimatedTime));
    }
  }, [temperature, tempUnit, starterPercentage, targetRise, advancedOptions, startTime]);
  
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
              completionTime={completionTime}
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
        <p>Data source: <a href="https://thesourdoughjourney.com" target="_blank" rel="noopener noreferrer">The Sourdough Journey</a></p>
        <p>Based on empirical testing with 90% King Arthur Bread Flour, 10% King Arthur Whole Wheat Flour, 2% Salt</p>
      </footer>
    </div>
  );
}

export default App;