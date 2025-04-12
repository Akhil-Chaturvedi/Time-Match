import { format } from "date-fns"

// Get a comprehensive list of time zones with locations
export function getTimeZones(): { id: string; name: string; offset: string; location: string }[] {
  return [
    { id: "UTC+12:00", name: "ANAT", offset: "UTC +12", location: "Anadyr" },
    { id: "UTC+11:00", name: "SBT", offset: "UTC +11", location: "Honiara" },
    { id: "UTC+10:00", name: "AEST", offset: "UTC +10", location: "Melbourne" },
    { id: "UTC+09:00", name: "JST", offset: "UTC +9", location: "Tokyo" },
    { id: "UTC+08:00", name: "CST", offset: "UTC +8", location: "Beijing" },
    { id: "UTC+07:00", name: "WIB", offset: "UTC +7", location: "Jakarta" },
    { id: "UTC+06:00", name: "BST", offset: "UTC +6", location: "Dhaka" },
    { id: "UTC+05:00", name: "UZT", offset: "UTC +5", location: "Tashkent" },
    { id: "UTC+04:00", name: "GST", offset: "UTC +4", location: "Dubai" },
    { id: "UTC+03:00", name: "MSK", offset: "UTC +3", location: "Moscow" },
    { id: "UTC+02:00", name: "CEST", offset: "UTC +2", location: "Brussels" },
    { id: "UTC+01:00", name: "BST", offset: "UTC +1", location: "London" },
    { id: "UTC+00:00", name: "GMT", offset: "UTC +0", location: "Accra" },
    { id: "UTC-01:00", name: "CVT", offset: "UTC -1", location: "Praia" },
    { id: "UTC-02:00", name: "GST", offset: "UTC -2", location: "King Edward Point" },
    { id: "UTC-03:00", name: "ART", offset: "UTC -3", location: "Buenos Aires" },
    { id: "UTC-04:00", name: "EDT", offset: "UTC -4", location: "New York" },
    { id: "UTC-05:00", name: "CDT", offset: "UTC -5", location: "Chicago" },
    { id: "UTC-06:00", name: "CST", offset: "UTC -6", location: "Mexico City" },
    { id: "UTC-07:00", name: "PDT", offset: "UTC -7", location: "Los Angeles" },
    { id: "UTC-08:00", name: "AKDT", offset: "UTC -8", location: "Anchorage" },
    { id: "UTC-09:00", name: "HDT", offset: "UTC -9", location: "Adak" },
    { id: "UTC-10:00", name: "HST", offset: "UTC -10", location: "Honolulu" },
    { id: "UTC-11:00", name: "NUT", offset: "UTC -11", location: "Alofi" },
    { id: "UTC-12:00", name: "AoE", offset: "UTC -12", location: "Baker Island" },
    // Additional one-hour offsets
    { id: "UTC+14:00", name: "LINT", offset: "UTC +14", location: "Kiritimati" },
    { id: "UTC+13:00", name: "TOT", offset: "UTC +13", location: "Nuku'alofa" },
    // Half-hour offsets
    { id: "UTC+10:30", name: "LHST", offset: "UTC +10:30", location: "Lord Howe Island" },
    { id: "UTC+09:30", name: "ACST", offset: "UTC +9:30", location: "Adelaide" },
    { id: "UTC+06:30", name: "MMT", offset: "UTC +6:30", location: "Yangon" },
    { id: "UTC+05:30", name: "IST", offset: "UTC +5:30", location: "New Delhi" },
    { id: "UTC+04:30", name: "AFT", offset: "UTC +4:30", location: "Kabul" },
    { id: "UTC+03:30", name: "IRST", offset: "UTC +3:30", location: "Tehran" },
    { id: "UTC-02:30", name: "NDT", offset: "UTC -2:30", location: "St. John's" },
    { id: "UTC-09:30", name: "MART", offset: "UTC -9:30", location: "Taiohae" },
    // Quarter-hour offsets
    { id: "UTC+12:45", name: "CHAST", offset: "UTC +12:45", location: "Chatham Islands" },
    { id: "UTC+08:45", name: "ACWST", offset: "UTC +8:45", location: "Eucla" },
    { id: "UTC+05:45", name: "NPT", offset: "UTC +5:45", location: "Kathmandu" },
  ]
}

// Detect user's time zone
export function detectTimeZone(): string {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    // Convert IANA time zone to our UTC offset format
    const now = new Date()
    const offset = -now.getTimezoneOffset()
    const hours = Math.floor(Math.abs(offset) / 60)
    const minutes = Math.abs(offset) % 60

    const sign = offset >= 0 ? "+" : "-"
    const formattedHours = hours.toString().padStart(2, "0")
    const formattedMinutes = minutes.toString().padStart(2, "0")

    return `UTC${sign}${formattedHours}:${formattedMinutes}`
  } catch (e) {
    return "UTC+00:00"
  }
}

// Format a date in a specific time zone
export function formatInTimeZone(date: Date, timeZoneId: string): string {
  try {
    // Parse the UTC offset from the timeZoneId
    const match = timeZoneId.match(/UTC([+-])(\d{2}):(\d{2})/)
    if (!match) return format(date, "h:mm a")

    // Get current UTC time
    const utcNow = new Date()
    const utcHours = utcNow.getUTCHours()
    const utcMinutes = utcNow.getUTCMinutes()

    // Calculate target timezone time
    const sign = match[1] === "+" ? 1 : -1
    const tzHours = Number.parseInt(match[2], 10)
    const tzMinutes = Number.parseInt(match[3], 10)

    // Apply offset to get local time in the target timezone
    let localHours = utcHours + sign * tzHours
    let localMinutes = utcMinutes + sign * tzMinutes

    // Handle minute overflow
    if (localMinutes >= 60) {
      localHours += 1
      localMinutes -= 60
    } else if (localMinutes < 0) {
      localHours -= 1
      localMinutes += 60
    }

    // Handle hour overflow
    localHours = (localHours + 24) % 24

    // Format the time in 12-hour format with AM/PM
    const period = localHours >= 12 ? "PM" : "AM"
    const displayHour = localHours % 12 || 12

    return `${displayHour}:${localMinutes.toString().padStart(2, "0")} ${period}`
  } catch (e) {
    return format(date, "h:mm a")
  }
}

// Get hour difference between two time zones
export function getHourDifference(fromTimeZone: string, toTimeZone: string): number {
  try {
    // Parse the UTC offsets
    const fromMatch = fromTimeZone.match(/UTC([+-])(\d{2}):(\d{2})/)
    const toMatch = toTimeZone.match(/UTC([+-])(\d{2}):(\d{2})/)

    if (!fromMatch || !toMatch) return 0

    const fromSign = fromMatch[1] === "+" ? 1 : -1
    const fromHours = Number.parseInt(fromMatch[2], 10)
    const fromMinutes = Number.parseInt(fromMatch[3], 10)
    const fromOffset = fromSign * (fromHours + fromMinutes / 60)

    const toSign = toMatch[1] === "+" ? 1 : -1
    const toHours = Number.parseInt(toMatch[2], 10)
    const toMinutes = Number.parseInt(toMatch[3], 10)
    const toOffset = toSign * (toHours + toMinutes / 60)

    // Calculate the difference
    const diff = toOffset - fromOffset
    return Math.round(diff)
  } catch (e) {
    return 0
  }
}

// Format hour (0-23) to 12-hour format with AM/PM
export function formatHour(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:00 ${period}`
}

// Convert a time from one time zone to another
export function convertTime(date: Date, fromTimeZone: string, toTimeZone: string): Date {
  try {
    // Parse the UTC offsets
    const fromMatch = fromTimeZone.match(/UTC([+-])(\d{2}):(\d{2})/)
    const toMatch = toTimeZone.match(/UTC([+-])(\d{2}):(\d{2})/)

    if (!fromMatch || !toMatch) return date

    const fromSign = fromMatch[1] === "+" ? 1 : -1
    const fromHours = Number.parseInt(fromMatch[2], 10)
    const fromMinutes = Number.parseInt(fromMatch[3], 10)
    const fromOffset = fromSign * (fromHours * 60 + fromMinutes)

    const toSign = toMatch[1] === "+" ? 1 : -1
    const toHours = Number.parseInt(toMatch[2], 10)
    const toMinutes = Number.parseInt(toMatch[3], 10)
    const toOffset = toSign * (toHours * 60 + toMinutes)

    // Calculate the difference in minutes
    const diffMinutes = toOffset - fromOffset

    // Apply the difference
    return new Date(date.getTime() + diffMinutes * 60 * 1000)
  } catch (e) {
    return date
  }
}

// Find a time zone by location name (case-insensitive partial match)
export function findTimeZoneByLocation(location: string): string | undefined {
  const timeZones = getTimeZones()
  const lowercaseLocation = location.toLowerCase()

  const match = timeZones.find((tz) => tz.location.toLowerCase().includes(lowercaseLocation))

  return match?.id
}
