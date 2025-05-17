/**
 * Temperature-related utility functions
 */

/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} - Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

/**
 * Convert Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} - Temperature in Celsius
 */
export function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}

/**
 * Round temperature to nearest whole number
 * @param {number} temperature - Temperature value
 * @returns {number} - Rounded temperature
 */
export function roundTemperature(temperature) {
  return Math.round(temperature);
}

/**
 * Get valid temperature ranges for the given unit
 * @param {string} unit - Temperature unit ('F' or 'C')
 * @returns {Object} - Object with min, max, and tested ranges
 */
export function getTemperatureRanges(unit) {
  if (unit === 'F') {
    return {
      min: 50,
      max: 85,
      testedMin: 66,
      testedMax: 74
    };
  } else {
    return {
      min: 10,
      max: 30,
      testedMin: 19,
      testedMax: 23
    };
  }
}

/**
 * Get common temperature presets
 * @param {string} unit - Temperature unit ('F' or 'C')
 * @returns {Array} - Array of preset objects with label and value
 */
export function getTemperaturePresets(unit) {
  if (unit === 'F') {
    return [
      { label: 'Cool Room (65°F)', value: 65 },
      { label: 'Room Temp (70°F)', value: 70 },
      { label: 'Warm Room (75°F)', value: 75 }
    ];
  } else {
    return [
      { label: 'Cool Room (18°C)', value: 18 },
      { label: 'Room Temp (21°C)', value: 21 },
      { label: 'Warm Room (24°C)', value: 24 }
    ];
  }
}