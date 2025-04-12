import type { Contact, TimePreference } from "@/lib/types"
import { convertTime } from "@/lib/time-utils"

export function findOptimalTime(
  contacts: Contact[],
  timePreference: TimePreference,
): { bestTime: Date | null; alternativeTimes: Date[] } {
  if (contacts.length <= 1) {
    return { bestTime: null, alternativeTimes: [] }
  }

  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Create a scoring system for each hour in the next 48 hours
  const timeScores: { time: Date; score: number }[] = []

  // Reference time zone (user's time zone)
  const referenceTimeZone = contacts[0].timeZone

  // Check each hour in the next 48 hours
  for (let hour = 0; hour < 48; hour++) {
    const checkTime = new Date(now)
    checkTime.setHours(now.getHours() + hour, 0, 0, 0)

    let score = 0
    let allAwake = true

    // Check if this time works for all contacts
    for (const contact of contacts) {
      // Convert the check time to the contact's time zone
      const contactLocalTime = convertTime(checkTime, referenceTimeZone, contact.timeZone)

      const contactHour = contactLocalTime.getHours()

      // Check if within awake hours
      if (isHourInRange(contactHour, timePreference.awakeStart, timePreference.awakeEnd)) {
        // Base score for being awake
        score += 1

        // Bonus for priority morning hours
        if (isHourInRange(contactHour, timePreference.priorityMorningStart, timePreference.priorityMorningEnd)) {
          score += 2
        }

        // Bonus for priority evening hours
        if (isHourInRange(contactHour, timePreference.priorityEveningStart, timePreference.priorityEveningEnd)) {
          score += 3
        }
      } else {
        // Not awake, this time doesn't work
        allAwake = false
        break
      }
    }

    // Only consider times when everyone is awake
    if (allAwake) {
      timeScores.push({ time: new Date(checkTime), score })
    }
  }

  // Sort by score (highest first)
  timeScores.sort((a, b) => b.score - a.score)

  // Return the best time and alternatives
  return {
    bestTime: timeScores.length > 0 ? timeScores[0].time : null,
    alternativeTimes: timeScores.slice(1, 4).map((item) => item.time),
  }
}

// Helper function to check if an hour is within a range (handles overnight ranges)
function isHourInRange(hour: number, start: number, end: number): boolean {
  if (start <= end) {
    return hour >= start && hour < end
  } else {
    // Overnight range (e.g., 22-6)
    return hour >= start || hour < end
  }
}
