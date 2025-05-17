# Calculation Engine Implementation

## Core Algorithm Design

Based on the empirical data from The Sourdough Journey, I'll outline a detailed implementation of the calculation engine for determining bulk fermentation times.

### Main Calculation Function

```javascript
/**
 * Calculate fermentation time based on temperature and starter percentage
 * @param {number} temperature - Dough temperature in Fahrenheit
 * @param {number} starterPercentage - Starter percentage (5-20%)
 * @param {number} targetRise - Desired rise percentage (75 or 100)
 * @return {Object} - Estimated fermentation time and metadata
 */
function calculateFermentationTime(temperature, starterPercentage, targetRise = 75) {
  // Step 1: Validate inputs and provide warnings
  const warnings = validateInputs(temperature, starterPercentage, targetRise);
  
  // Step 2: Find nearest data points for interpolation
  const dataPoints = findNearestDataPoints(temperature, starterPercentage);
  
  // Step 3: Perform interpolation to get estimated time
  const estimatedTime = interpolateTime(
    dataPoints, 
    temperature, 
    starterPercentage, 
    targetRise
  );
  
  // Step 4: Calculate confidence interval
  const confidenceInterval = calculateConfidenceInterval(
    dataPoints,
    temperature,
    starterPercentage
  );
  
  // Return results with metadata
  return {
    estimatedTime: estimatedTime,
    minTime: estimatedTime - confidenceInterval,
    maxTime: estimatedTime + confidenceInterval,
    warnings: warnings,
    dataPoints: dataPoints // For transparency/debugging
  };
}
```

### Finding Nearest Data Points

```javascript
/**
 * Find the nearest data points for interpolation
 * @param {number} temperature - Dough temperature in Fahrenheit
 * @param {number} starterPercentage - Starter percentage
 * @return {Object} - Nearest data points for interpolation
 */
function findNearestDataPoints(temperature, starterPercentage) {
  // Find nearest temperature points
  const tempPoints = [66, 68, 70, 72, 74];
  const starterPoints = [5, 10, 15, 20];
  
  // Find lower and upper temperature bounds
  let lowerTemp = 66;
  let upperTemp = 74;
  
  for (let i = 0; i < tempPoints.length - 1; i++) {
    if (temperature >= tempPoints[i] && temperature <= tempPoints[i + 1]) {
      lowerTemp = tempPoints[i];
      upperTemp = tempPoints[i + 1];
      break;
    }
  }
  
  // Find lower and upper starter percentage bounds
  let lowerStarter = 5;
  let upperStarter = 20;
  
  for (let i = 0; i < starterPoints.length - 1; i++) {
    if (starterPercentage >= starterPoints[i] && starterPercentage <= starterPoints[i + 1]) {
      lowerStarter = starterPoints[i];
      upperStarter = starterPoints[i + 1];
      break;
    }
  }
  
  // Handle edge cases (extrapolation)
  if (temperature < 66) {
    lowerTemp = 66;
    upperTemp = 68;
  } else if (temperature > 74) {
    lowerTemp = 72;
    upperTemp = 74;
  }
  
  if (starterPercentage < 5) {
    lowerStarter = 5;
    upperStarter = 10;
  } else if (starterPercentage > 20) {
    lowerStarter = 15;
    upperStarter = 20;
  }
  
  return {
    lowerTemp,
    upperTemp,
    lowerStarter,
    upperStarter
  };
}
```

### Bilinear Interpolation

```javascript
/**
 * Interpolate fermentation time using bilinear interpolation
 * @param {Object} dataPoints - Nearest data points for interpolation
 * @param {number} temperature - Target temperature
 * @param {number} starterPercentage - Target starter percentage
 * @param {number} targetRise - Desired rise percentage (75 or 100)
 * @return {number} - Interpolated fermentation time
 */
function interpolateTime(dataPoints, temperature, starterPercentage, targetRise) {
  const { lowerTemp, upperTemp, lowerStarter, upperStarter } = dataPoints;
  const riseKey = targetRise === 100 ? "100%" : "75%";
  
  // Get the four corner values from our dataset
  const q11 = fermentationData[`${lowerStarter}%`][`${lowerTemp}F`][riseKey];
  const q12 = fermentationData[`${lowerStarter}%`][`${upperTemp}F`][riseKey];
  const q21 = fermentationData[`${upperStarter}%`][`${lowerTemp}F`][riseKey];
  const q22 = fermentationData[`${upperStarter}%`][`${upperTemp}F`][riseKey];
  
  // Calculate temperature ratios
  const tempRange = upperTemp - lowerTemp;
  const tempRatio = (temperature - lowerTemp) / tempRange;
  
  // Calculate starter percentage ratios
  const starterRange = upperStarter - lowerStarter;
  const starterRatio = (starterPercentage - lowerStarter) / starterRange;
  
  // Perform bilinear interpolation
  // First interpolate in x-direction (temperature)
  const r1 = q11 * (1 - tempRatio) + q12 * tempRatio;
  const r2 = q21 * (1 - tempRatio) + q22 * tempRatio;
  
  // Then interpolate in y-direction (starter percentage)
  const result = r1 * (1 - starterRatio) + r2 * starterRatio;
  
  return result;
}
```

### Extrapolation Handling

```javascript
/**
 * Calculate confidence interval based on distance from known data points
 * @param {Object} dataPoints - Nearest data points
 * @param {number} temperature - Target temperature
 * @param {number} starterPercentage - Target starter percentage
 * @return {number} - Confidence interval in hours
 */
function calculateConfidenceInterval(dataPoints, temperature, starterPercentage) {
  const { lowerTemp, upperTemp, lowerStarter, upperStarter } = dataPoints;
  
  // Calculate how far we are from known data points
  let tempDistance = 0;
  let starterDistance = 0;
  
  if (temperature < 66) {
    tempDistance = 66 - temperature;
  } else if (temperature > 74) {
    tempDistance = temperature - 74;
  }
  
  if (starterPercentage < 5) {
    starterDistance = 5 - starterPercentage;
  } else if (starterPercentage > 20) {
    starterDistance = starterPercentage - 20;
  }
  
  // Increase confidence interval based on distance from known data
  const baseInterval = 0.5; // 30 minutes within known range
  const tempFactor = 0.25 * tempDistance; // Add 15 minutes per degree outside range
  const starterFactor = 0.2 * starterDistance; // Add 12 minutes per percentage point outside range
  
  return baseInterval + tempFactor + starterFactor;
}
```

### Input Validation

```javascript
/**
 * Validate input parameters and return warnings
 * @param {number} temperature - Dough temperature in Fahrenheit
 * @param {number} starterPercentage - Starter percentage
 * @param {number} targetRise - Desired rise percentage
 * @return {Array} - Array of warning messages
 */
function validateInputs(temperature, starterPercentage, targetRise) {
  const warnings = [];
  
  // Temperature validation
  if (temperature < 66) {
    warnings.push("Temperature below tested range (66°F/19°C). Results may be less accurate.");
  } else if (temperature > 74) {
    warnings.push("Temperature above tested range (74°F/23°C). Results may be less accurate.");
  }
  
  // Starter percentage validation
  if (starterPercentage < 5) {
    warnings.push("Starter percentage below tested range (5%). Results may be less accurate.");
  } else if (starterPercentage > 20) {
    warnings.push("Starter percentage above tested range (20%). Results may be less accurate.");
  }
  
  // Rise target validation
  if (targetRise !== 75 && targetRise !== 100) {
    warnings.push("Only 75% and 100% rise data is available. Using closest match.");
  }
  
  return warnings;
}
```

### Temperature Conversion Utilities

```javascript
/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @return {number} - Temperature in Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

/**
 * Convert Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @return {number} - Temperature in Celsius
 */
function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}
```

### Time Formatting Utility

```javascript
/**
 * Format fermentation time in hours to a human-readable format
 * @param {number} timeInHours - Fermentation time in decimal hours
 * @return {string} - Formatted time string (e.g., "8 hours 30 minutes")
 */
function formatTime(timeInHours) {
  const hours = Math.floor(timeInHours);
  const minutes = Math.round((timeInHours - hours) * 60);
  
  let formattedTime = "";
  
  if (hours > 0) {
    formattedTime += `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  if (minutes > 0) {
    if (hours > 0) formattedTime += " ";
    formattedTime += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return formattedTime;
}
```

## Extended Calculation Features

### Time to Completion Estimate

```javascript
/**
 * Calculate estimated completion time based on start time
 * @param {Date} startTime - Time when fermentation started
 * @param {number} fermentationHours - Estimated fermentation time in hours
 * @return {Date} - Estimated completion time
 */
function calculateCompletionTime(startTime, fermentationHours) {
  const completionTime = new Date(startTime);
  completionTime.setTime(
    completionTime.getTime() + fermentationHours * 60 * 60 * 1000
  );
  return completionTime;
}
```

### Adjustment for Flour Type

```javascript
/**
 * Adjust fermentation time based on flour type
 * @param {number} baseTime - Base fermentation time in hours
 * @param {Object} flourMix - Object with percentages of different flours
 * @return {number} - Adjusted fermentation time
 */
function adjustForFlourType(baseTime, flourMix) {
  // Default values from the test data:
  // 90% bread flour, 10% whole wheat
  
  let wholeGrainFactor = 1.0;
  
  // Increase in whole grain flour speeds up fermentation
  // These factors are estimated and would need refinement
  if (flourMix.wholeWheat > 10) {
    wholeGrainFactor -= (flourMix.wholeWheat - 10) * 0.01;
  }
  
  if (flourMix.rye > 0) {
    wholeGrainFactor -= flourMix.rye * 0.015; // Rye ferments faster
  }
  
  // Protein content factors
  let proteinFactor = 1.0;
  if (flourMix.proteinContent && flourMix.proteinContent !== 12.7) {
    // KA Bread Flour has about 12.7% protein
    proteinFactor += (flourMix.proteinContent - 12.7) * 0.01;
  }
  
  return baseTime * wholeGrainFactor * proteinFactor;
}
```

## Integration with UI

### React Hook Example

```javascript
/**
 * Custom React hook to calculate fermentation time
 */
function useFermentationCalculator() {
  const [temperature, setTemperature] = useState(70);
  const [tempUnit, setTempUnit] = useState('F');
  const [starterPercentage, setStarterPercentage] = useState(20);
  const [targetRise, setTargetRise] = useState(75);
  const [result, setResult] = useState(null);
  
  // Convert temperature if needed
  const tempInF = tempUnit === 'C' ? celsiusToFahrenheit(temperature) : temperature;
  
  // Calculate whenever inputs change
  useEffect(() => {
    const calculationResult = calculateFermentationTime(
      tempInF,
      starterPercentage,
      targetRise
    );
    
    setResult(calculationResult);
  }, [tempInF, starterPercentage, targetRise]);
  
  return {
    temperature,
    setTemperature,
    tempUnit,
    setTempUnit,
    starterPercentage,
    setStarterPercentage,
    targetRise,
    setTargetRise,
    result
  };
}
```

## Performance Optimizations

### Memoization for Repeated Calculations

```javascript
// Create a cache for calculation results
const calculationCache = new Map();

/**
 * Memoized version of calculation function
 */
function memoizedCalculation(temperature, starterPercentage, targetRise) {
  // Create a cache key
  const cacheKey = `${temperature}_${starterPercentage}_${targetRise}`;
  
  // Check if result is in cache
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }
  
  // Calculate if not in cache
  const result = calculateFermentationTime(temperature, starterPercentage, targetRise);
  
  // Store in cache
  calculationCache.set(cacheKey, result);
  
  return result;
}
```

This detailed calculation engine implementation provides all the necessary functionality to accurately estimate bulk fermentation times based on the provided empirical data, with additional features for practical use in a web application.
