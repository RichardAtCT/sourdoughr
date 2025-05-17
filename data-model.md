# Data Model Component

## Purpose
The data model component defines the structure for storing and accessing the fermentation data, formulas, and user preferences that power the calculator functionality.

## Core Data Structures

### Fermentation Rate Data
- **Temperature-Time Relationship Data**
  - Array or object mapping temperature ranges to fermentation rate multipliers
  - Data points covering the full temperature spectrum (50°F-95°F/10°C-35°C)
  - Source: scientific studies or empirical testing data
  
- **Starter Percentage Impact Data**
  - Array or object mapping starter percentages to fermentation rate multipliers
  - Coverage for common starter percentages (5%-100%)
  - Baseline reference point (e.g., 20% as 1.0x multiplier)

- **Flour Type Adjustment Factors**
  - Mapping of flour types to fermentation rate modifiers
  - Examples: white flour (1.0x), whole wheat (1.2x), rye (1.4x)
  
- **Other Influencing Factors**
  - Salt percentage impact on fermentation rate
  - Hydration level impact on fermentation rate
  - Ambient humidity considerations

### Calculation Formulas
- **Base Fermentation Time Formula**
  - Mathematical representation of relationship between variables
  - May be linear, exponential, or custom formula based on empirical data
  
- **Adjustment Factors**
  - Combination rules for multiple variables
  - Weighting of different factors

### User Preferences
- **Format Preferences**
  - Temperature unit preference (°F/°C)
  - Time format preference (hours:minutes vs decimal hours)
  
- **Saved Recipes**
  - Structure for storing user-saved recipes
  - Input parameters, calculated results, and user notes

## Data Sources
- **Primary Data Source Options**
  - Embedded JSON data within the application
  - External JSON file loaded at runtime
  - Hardcoded constants within calculation module
  
- **Data Collection Methodology**
  - Scientific literature on sourdough fermentation
  - Empirical testing data from controlled experiments
  - Baker feedback and validation

## Data Access Patterns
- **Initialization**
  - Loading of fermentation data on application start
  - Default values for inputs based on common scenarios
  
- **Lookups and Interpolation**
  - Method for finding values between data points
  - Handling edge cases outside of measured ranges
  
- **State Management**
  - Integration with React state or context
  - Update patterns for real-time calculation

## Extension Points
- **Adding New Variables**
  - Structure for incorporating additional fermentation factors
  - Versioning approach for data model evolution
  
- **User Contributions**
  - Potential for user feedback to refine the model
  - Calibration mechanism for individual environments
