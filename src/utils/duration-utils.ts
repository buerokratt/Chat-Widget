// chatActiveDuration and TIM sessionLength are measured in minutes.
export const DEFAULT_CHAT_ACTIVE_MINUTES = 30;
export function chatActiveMinutes(value: unknown): number {
  const minutes = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
  return Number.isSafeInteger(minutes) && minutes > 0 ? minutes : DEFAULT_CHAT_ACTIVE_MINUTES;
}
