# Data Implementation Plan

## Overview of Available Fermentation Data

Based on the provided data from The Sourdough Journey, we have a comprehensive timetable of bulk fermentation times with the following variables:

### Variables in Dataset
- **Starter Percentages**: 5%, 10%, 15%, 20%
- **Temperature Ranges**: 66°F/19°C to 74°F/23°C (in 2°F increments)
- **Fermentation Stages**: 75% Rise and 100% Rise times in hours

### Recipe Specifications in Test Data
- 100g flour weight batches
- 90% King Arthur Bread Flour, 10% King Arthur Whole Wheat Flour
- 2% Salt
- Starter fed 1:2:2 approximately 4-6 hours prior to mixing
- Starter used at or near peak volume

## Data Structure Implementation

### Primary Data Model
```javascript
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
}
```

### Alternative Data Structure (Array-based)
```javascript
const fermentationDataArray = [
  { starter: 5, temp_f: 66, temp_c: 19, rise_75: 18.5, rise_100: 20.0 },
  { starter: 5, temp_f: 68, temp_c: 20, rise_75: 18.0, rise_100: 19.5 },
  { starter: 5, temp_f: 70, temp_c: 21, rise_75: 17.5, rise_100: 19.0 },
  // ... and so on for all data points
];
```

## Interpolation Strategy

Since the data only provides specific temperature points (66°F, 68°F, 70°F, 72°F, 74°F) and starter percentages (5%, 10%, 15%, 20%), we'll need interpolation to estimate fermentation times for values between these points.

### Temperature Interpolation
```javascript
function interpolateTemperature(lowerTemp, upperTemp, lowerTime, upperTime, targetTemp) {
  const ratio = (targetTemp - lowerTemp) / (upperTemp - lowerTemp);
  return lowerTime + ratio * (upperTime - lowerTime);
}
```

### Starter Percentage Interpolation
```javascript
function interpolateStarter(lowerPercent, upperPercent, lowerTime, upperTime, targetPercent) {
  const ratio = (targetPercent - lowerPercent) / (upperPercent - lowerPercent);
  return lowerTime + ratio * (upperTime - lowerTime);
}
```

### Combined Interpolation (Bilinear)
For temperatures and starter percentages that fall between the provided data points, we'll implement bilinear interpolation to estimate the fermentation time.

## Extrapolation Strategy

For values outside the data range (below 66°F or above 74°F, or starter percentages below 5% or above 20%), we'll need an extrapolation strategy.

### Temperature Extrapolation
Based on the pattern in the data, we can observe that:
- Every 2°F increase reduces fermentation time by approximately 8-15%
- This relationship appears somewhat exponential rather than linear

### Starter Percentage Extrapolation
- Every 5% increase in starter reduces fermentation time by approximately 10-20%
- This relationship also appears non-linear

## Data Validation

We'll include validation to warn users when they're entering values outside the tested range:

```javascript
function validateInputs(temperature, starterPercentage) {
  const warnings = [];
  
  if (temperature < 66) {
    warnings.push("Temperature below tested range (66°F/19°C). Estimates may be less accurate.");
  } else if (temperature > 74) {
    warnings.push("Temperature above tested range (74°F/23°C). Estimates may be less accurate.");
  }
  
  if (starterPercentage < 5) {
    warnings.push("Starter percentage below tested range (5%). Estimates may be less accurate.");
  } else if (starterPercentage > 20) {
    warnings.push("Starter percentage above tested range (20%). Estimates may be less accurate.");
  }
  
  return warnings;
}
```

## Extended Data Considerations

The original dataset is based on a specific flour mix (90% bread flour, 10% whole wheat) with 2% salt. For a more comprehensive calculator, we could add adjustment factors for:

- Different flour ratios (higher whole grain percentages typically ferment faster)
- Different salt percentages (higher salt typically slows fermentation)
- Hydration levels
- Ambient humidity

These adjustments would be based on general fermentation principles since specific test data isn't available.

## Data Source Attribution

We'll include proper attribution in the application:
- Credit to "The Sourdough Journey" as the source of fermentation data
- Link to original source: thesourdoughjourney.com
- Version of data being used (V1.0 Dec 2022)
