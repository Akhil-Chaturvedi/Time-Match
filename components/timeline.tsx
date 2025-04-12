"use client"

import { useEffect, useRef } from "react"
import type { Contact, TimePreference } from "@/lib/types"
import { getHourDifference } from "@/lib/time-utils"

interface TimelineProps {
  contacts: Contact[]
  timePreference: TimePreference
  optimalTimes: {
    bestTime: Date | null
    alternativeTimes: Date[]
  }
}

export function Timeline({ contacts, timePreference, optimalTimes }: TimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || contacts.length <= 1) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = contacts.length * 60 + 60 // 60px per contact + header

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw timeline
    drawTimeline(ctx, canvas.width, canvas.height, contacts, timePreference, optimalTimes)
  }, [contacts, timePreference, optimalTimes])

  if (contacts.length <= 1) {
    return <div className="text-center py-8 text-slate-500">Add at least one contact to see the timeline</div>
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Time Zone Timeline</h3>

      <div className="relative overflow-x-auto border rounded-lg">
        <canvas ref={canvasRef} className="w-full" style={{ minHeight: `${contacts.length * 60 + 60}px` }} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-200 rounded"></div>
            <span className="text-sm">Awake Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span className="text-sm">Priority Morning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <span className="text-sm">Priority Evening</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm">Optimal Time</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function drawTimeline(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  contacts: Contact[],
  timePreference: TimePreference,
  optimalTimes: { bestTime: Date | null; alternativeTimes: Date[] },
) {
  const hourWidth = width / 24
  const rowHeight = 60
  const now = new Date()

  // Draw hour labels
  ctx.fillStyle = "#64748b"
  ctx.font = "12px sans-serif"
  ctx.textAlign = "center"

  for (let hour = 0; hour < 24; hour++) {
    const x = hour * hourWidth
    ctx.fillText(`${hour}:00`, x + hourWidth / 2, 20)

    // Draw vertical grid lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.beginPath()
    ctx.moveTo(x, 30)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Draw contact timelines
  contacts.forEach((contact, index) => {
    const y = 40 + index * rowHeight

    // Draw contact name
    ctx.fillStyle = "#334155"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(contact.name, 10, y + 15)

    // Calculate time offset
    const hourOffset = getHourDifference(contacts[0].timeZone, contact.timeZone)

    // Draw awake hours
    ctx.fillStyle = "#e2e8f0"
    const awakeStart = (timePreference.awakeStart + hourOffset) % 24
    const awakeEnd = (timePreference.awakeEnd + hourOffset) % 24

    if (awakeStart < awakeEnd) {
      ctx.fillRect(awakeStart * hourWidth, y + 20, (awakeEnd - awakeStart) * hourWidth, 20)
    } else {
      // Handle overnight periods
      ctx.fillRect(awakeStart * hourWidth, y + 20, (24 - awakeStart) * hourWidth, 20)
      ctx.fillRect(0, y + 20, awakeEnd * hourWidth, 20)
    }

    // Draw priority morning hours
    ctx.fillStyle = "#bbf7d0"
    const morningStart = (timePreference.priorityMorningStart + hourOffset) % 24
    const morningEnd = (timePreference.priorityMorningEnd + hourOffset) % 24

    if (morningStart < morningEnd) {
      ctx.fillRect(morningStart * hourWidth, y + 20, (morningEnd - morningStart) * hourWidth, 20)
    } else {
      ctx.fillRect(morningStart * hourWidth, y + 20, (24 - morningStart) * hourWidth, 20)
      ctx.fillRect(0, y + 20, morningEnd * hourWidth, 20)
    }

    // Draw priority evening hours
    ctx.fillStyle = "#bfdbfe"
    const eveningStart = (timePreference.priorityEveningStart + hourOffset) % 24
    const eveningEnd = (timePreference.priorityEveningEnd + hourOffset) % 24

    if (eveningStart < eveningEnd) {
      ctx.fillRect(eveningStart * hourWidth, y + 20, (eveningEnd - eveningStart) * hourWidth, 20)
    } else {
      ctx.fillRect(eveningStart * hourWidth, y + 20, (24 - eveningStart) * hourWidth, 20)
      ctx.fillRect(0, y + 20, eveningEnd * hourWidth, 20)
    }

    // Draw current time indicator
    const currentHour = new Date().getHours() + new Date().getMinutes() / 60
    const adjustedCurrentHour = (currentHour + hourOffset) % 24

    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(adjustedCurrentHour * hourWidth, y + 30, 4, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Draw optimal time if available
  if (optimalTimes.bestTime) {
    const optimalHour = optimalTimes.bestTime.getHours() + optimalTimes.bestTime.getMinutes() / 60

    // Draw vertical line at optimal time
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(optimalHour * hourWidth, 30)
    ctx.lineTo(optimalHour * hourWidth, height)
    ctx.stroke()

    // Draw optimal time label
    ctx.fillStyle = "#10b981"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(
      `Optimal: ${optimalTimes.bestTime.getHours().toString().padStart(2, "0")}:${optimalTimes.bestTime.getMinutes().toString().padStart(2, "0")}`,
      optimalHour * hourWidth,
      height - 10,
    )
  }
}
