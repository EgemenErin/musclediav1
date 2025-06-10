/**
 * Returns a greeting based on the current time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

/**
 * Calculate BMI based on height and weight
 * @param height Height in centimeters
 * @param weight Weight in kilograms
 */
export function calculateBMI(height: number, weight: number): number {
  if (!height || !weight) return 0;
  
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // BMI formula: weight (kg) / (height (m) * height (m))
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Round to 1 decimal place
  return Math.round(bmi * 10) / 10;
}

/**
 * Format a date to a readable string
 * @param date Date string or Date object
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Calculate calories burned (very rough estimate)
 * @param activityType Type of activity
 * @param durationMinutes Duration in minutes
 * @param weightKg Weight in kilograms
 */
export function estimateCaloriesBurned(
  activityType: 'walking' | 'running' | 'cycling' | 'strength', 
  durationMinutes: number,
  weightKg: number
): number {
  // MET values (Metabolic Equivalent of Task)
  const metValues = {
    walking: 3.5,
    running: 8,
    cycling: 6,
    strength: 5
  };
  
  // Formula: calories = MET * weight (kg) * duration (hours)
  const durationHours = durationMinutes / 60;
  const calories = metValues[activityType] * weightKg * durationHours;
  
  return Math.round(calories);
}