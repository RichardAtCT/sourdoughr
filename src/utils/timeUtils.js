/**
 * Time-related utility functions
 */

/**
 * Format time in hours to human readable format
 * @param {number} timeInHours - Time in decimal hours
 * @returns {string} - Formatted time string (e.g. "4 hours 30 minutes")
 */
export function formatTime(timeInHours) {
  if (timeInHours === null || timeInHours === undefined) return "";
  
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
  
  if (formattedTime === "") {
    formattedTime = "0 minutes";
  }
  
  return formattedTime;
}

/**
 * Format time for time input field
 * @param {Date} date - Date object
 * @returns {string} - Time string in format "HH:MM"
 */
export function formatTimeForInput(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/**
 * Format time for display
 * @param {Date} date - Date object
 * @returns {string} - Formatted time (e.g. "2:30 PM")
 */
export function formatTimeOfDay(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format date for display
 * @param {Date} date - Date object
 * @returns {string} - Formatted date (e.g. "Monday, Jan 1")
 */
export function formatDate(date) {
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

/**
 * Calculate completion time based on start time and duration
 * @param {Date} startTime - Start time
 * @param {number} durationHours - Duration in hours
 * @returns {Date} - Completion time
 */
export function calculateCompletionTime(startTime, durationHours) {
  const completionTime = new Date(startTime);
  completionTime.setTime(
    completionTime.getTime() + (durationHours * 60 * 60 * 1000)
  );
  return completionTime;
}