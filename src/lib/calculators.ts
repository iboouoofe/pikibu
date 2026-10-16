export function calculateDueDate(lmpDateString: string): { dueDate: Date, currentWeek: number, currentDay: number } {
  // lmpDateString format: YYYY-MM-DD
  const lmpDate = new Date(lmpDateString);
  const dueDate = new Date(lmpDate);
  // Add 280 days (40 weeks) to LMP
  dueDate.setDate(dueDate.getDate() + 280);

  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const currentWeek = Math.floor(diffDays / 7);
  const currentDay = diffDays % 7;

  return { dueDate, currentWeek, currentDay };
}

// 10 leaps array based on wonder weeks (approximate weeks after EDD)
export const LEAP_WEEKS = [5, 8, 12, 19, 26, 37, 46, 55, 64, 75];

export function calculateLeap(dueDateString: string, birthDateString: string): { 
  currentLeap: number | null, 
  daysUntilNextLeap: number | null,
  adjustedAgeWeeks: number
} {
  const edd = new Date(dueDateString);
  const today = new Date();
  
  // Leaps are calculated based on the Estimated Due Date (EDD), not actual birth date
  const diffTime = today.getTime() - edd.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const adjustedAgeWeeks = diffDays / 7;

  if (adjustedAgeWeeks < 0) {
    // Baby is not born yet or hasn't reached EDD
    return { currentLeap: null, daysUntilNextLeap: null, adjustedAgeWeeks: 0 };
  }

  let currentLeap = null;
  let nextLeapWeek = null;

  for (let i = 0; i < LEAP_WEEKS.length; i++) {
    // A leap usually lasts 1-4 weeks before the peak week. 
    // For simplicity, we assume the leap covers from (LeapWeek - 1) to (LeapWeek).
    const leapWeek = LEAP_WEEKS[i];
    if (adjustedAgeWeeks >= (leapWeek - 2) && adjustedAgeWeeks <= leapWeek) {
      currentLeap = i + 1;
    }
    if (adjustedAgeWeeks < (leapWeek - 2) && nextLeapWeek === null) {
      nextLeapWeek = leapWeek;
    }
  }

  let daysUntilNextLeap = null;
  if (nextLeapWeek !== null) {
    const nextLeapDays = (nextLeapWeek - 2) * 7;
    daysUntilNextLeap = Math.ceil(nextLeapDays - diffDays);
  }

  return { currentLeap, daysUntilNextLeap, adjustedAgeWeeks: Math.floor(adjustedAgeWeeks) };
}
