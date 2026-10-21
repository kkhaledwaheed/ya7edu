/**
 * Utility functions for exam scheduling and result embargo management.
 * Enforces the rule that exam results remain strictly hidden (embargoed)
 * until the official end date and time of the exam expires.
 */

export interface ExamTimeFields {
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  durationMinutes?: number;
  hideResultUntilDurationEnds?: boolean;
}

export interface AttemptTimeFields {
  startedAt?: string;
  submittedAt?: string;
  isUnlocked?: boolean;
}

/**
 * Returns the exact millisecond timestamp when the exam officially ends.
 * If endDate/endTime are specified, uses that deadline.
 * Otherwise, falls back to student start time + durationMinutes.
 */
export function getExamEndDeadlineMs(
  exam: ExamTimeFields,
  attemptStartedAt?: string
): number {
  if (exam.endDate && exam.endDate.trim()) {
    const rawTime = exam.endTime && exam.endTime.trim() ? exam.endTime.trim() : '23:59';
    // Format to HH:mm:00
    const timeFormatted = rawTime.length === 5 ? `${rawTime}:00` : rawTime;
    const dateStr = `${exam.endDate.trim()}T${timeFormatted}`;
    const parsed = new Date(dateStr).getTime();
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  // Fallback if no specific endDate is configured:
  const durationMs = (exam.durationMinutes || 30) * 60 * 1000;
  if (attemptStartedAt) {
    const startMs = new Date(attemptStartedAt).getTime();
    if (!isNaN(startMs)) {
      return startMs + durationMs;
    }
  }

  return Date.now() + durationMs;
}

/**
 * Checks if a submitted exam attempt's result must remain hidden (embargoed).
 * The result remains hidden until the current time surpasses the exam's end date and time.
 */
export function isExamResultEmbargoed(
  exam: ExamTimeFields,
  attempt?: AttemptTimeFields | null,
  currentTimeMs: number = Date.now()
): boolean {
  if (!attempt || !attempt.submittedAt) {
    return false; // not submitted yet
  }
  if (attempt.isUnlocked) {
    return false; // already unlocked
  }

  const deadlineMs = getExamEndDeadlineMs(exam, attempt.startedAt);
  return currentTimeMs < deadlineMs;
}

/**
 * Formats remaining seconds into structured countdown parts and readable Arabic text.
 */
export function formatEmbargoCountdown(totalSeconds: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formattedText: string;
  digital: string;
} {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  let formattedText = '';
  if (days > 0) {
    formattedText = `${days} يوم و ${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
  } else if (hours > 0) {
    formattedText = `${hours} ساعة و ${minutes} دقيقة و ${seconds} ثانية`;
  } else {
    formattedText = `${minutes} دقيقة و ${seconds} ثانية`;
  }

  let digital = '';
  if (days > 0) {
    digital = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    digital = `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return { days, hours, minutes, seconds, formattedText, digital };
}

/**
 * Converts 24h time string (e.g. "14:30") to Arabic 12h format (e.g. "02:30 م")
 */
export function formatArabicTime(timeStr?: string): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;

  let hour = parseInt(parts[0], 10);
  const min = parts[1];
  if (isNaN(hour)) return timeStr;

  const isPm = hour >= 12;
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;

  const amPm = isPm ? 'م' : 'ص';
  return `${hour.toString().padStart(2, '0')}:${min} ${amPm}`;
}
