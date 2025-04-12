"use client"

import { useState } from "react"
import type { Contact } from "@/lib/types"
import { formatInTimeZone, getTimeZones } from "@/lib/time-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OptimalTimeDisplayProps {
  optimalTimes: {
    bestTime: Date | null
    alternativeTimes: Date[]
  }
  contacts: Contact[]
}

export function OptimalTimeDisplay({ optimalTimes, contacts }: OptimalTimeDisplayProps) {
  const [showAlternatives, setShowAlternatives] = useState(false)
  const timeZones = getTimeZones()

  if (!optimalTimes.bestTime) {
    return null
  }

  const handleAddToCalendar = () => {
    if (!optimalTimes.bestTime) return

    const startTime = optimalTimes.bestTime
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour meeting

    const startTimeStr = startTime.toISOString().replace(/-|:|\.\d+/g, "")
    const endTimeStr = endTime.toISOString().replace(/-|:|\.\d+/g, "")

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting&dates=${startTimeStr}/${endTimeStr}`
    window.open(calendarUrl, "_blank")
  }

  const handleShare = () => {
    if (!optimalTimes.bestTime) return

    const timeStr = optimalTimes.bestTime.toLocaleString()
    const text = `Let's meet at ${timeStr}`

    if (navigator.share) {
      navigator.share({
        title: "Meeting Time",
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert("Meeting time copied to clipboard!")
    }
  }

  // Find time zone info for display
  const getTimeZoneInfo = (tzId: string) => {
    const tz = timeZones.find((t) => t.id === tzId)
    return tz ? `${tz.location} (${tz.name}, ${tz.offset})` : tzId
  }

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
      <CardHeader>
        <CardTitle className="text-emerald-700 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Best Time to Connect
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-emerald-700">
                {optimalTimes.bestTime.toLocaleString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
              <div className="text-slate-500">UTC: {optimalTimes.bestTime.toISOString()}</div>
            </div>

            <div className="grid gap-2 mt-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-slate-700">
                    {formatInTimeZone(optimalTimes.bestTime!, contact.timeZone)}
                    <span className="text-xs text-slate-500 ml-2">{getTimeZoneInfo(contact.timeZone)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handleAddToCalendar}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add this time to your Google Calendar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this meeting time</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {optimalTimes.alternativeTimes.length > 0 && (
            <div>
              <Button
                variant="link"
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="text-emerald-600"
              >
                {showAlternatives ? "Hide" : "Show"} alternative times ({optimalTimes.alternativeTimes.length})
              </Button>

              {showAlternatives && (
                <div className="mt-2 space-y-2">
                  {optimalTimes.alternativeTimes.map((time, index) => (
                    <div key={index} className="bg-white p-2 rounded border">
                      {time.toLocaleString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
