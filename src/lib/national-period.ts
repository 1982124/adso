export const NATIONAL_PERIODS = { "30": 30, "90": 90, "365": 365, all: null } as const;

export function getNationalPeriod(value: string | undefined, now: Date) {
  const key = value && value in NATIONAL_PERIODS ? value as keyof typeof NATIONAL_PERIODS : "90";
  const days = NATIONAL_PERIODS[key];
  const since = days === null ? undefined : new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { key, days, since };
}
