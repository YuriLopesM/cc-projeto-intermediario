export function generatePeriod(hourRaw: string): string {
  const hour = parseInt(hourRaw.split(':')[0], 10)

  if (hour >= 0 && hour < 12) {
    return 'Manhã'
  } else if (hour >= 12 && hour < 18) {
    return 'Tarde'
  } else {
    return 'Noite'
  }
}
