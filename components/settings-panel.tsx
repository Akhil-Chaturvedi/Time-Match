"use client"

import type { TimePreference } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTimeZones, formatHour } from "@/lib/time-utils"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from "lucide-react"

interface SettingsPanelProps {
  timePreference: TimePreference
  onUpdateTimePreference: (newPreference: Partial<TimePreference>) => void
  userTimeZone: string
  onUpdateUserTimeZone: (timeZone: string) => void
}

export function SettingsPanel({
  timePreference,
  onUpdateTimePreference,
  userTimeZone,
  onUpdateUserTimeZone,
}: SettingsPanelProps) {
  const timeZones = getTimeZones()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter time zones based on search query
  const filteredTimeZones = searchQuery
    ? timeZones.filter(
        (tz) =>
          tz.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tz.offset.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : timeZones

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Time Zone</h3>

        <div className="grid gap-2">
          <Label htmlFor="location-search">Search Location</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="location-search"
              placeholder="Search by city or country"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Select value={userTimeZone} onValueChange={onUpdateUserTimeZone}>
          <SelectTrigger>
            <SelectValue placeholder="Select time zone" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {filteredTimeZones.map((tz) => (
              <SelectItem key={tz.id} value={tz.id}>
                {tz.location} ({tz.name}, {tz.offset})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Awake Hours</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Awake Start</Label>
              <span className="text-sm text-slate-500">{formatHour(timePreference.awakeStart)}</span>
            </div>
            <Slider
              value={[timePreference.awakeStart]}
              min={0}
              max={23}
              step={1}
              onValueChange={(value) => onUpdateTimePreference({ awakeStart: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Awake End</Label>
              <span className="text-sm text-slate-500">{formatHour(timePreference.awakeEnd)}</span>
            </div>
            <Slider
              value={[timePreference.awakeEnd]}
              min={0}
              max={23}
              step={1}
              onValueChange={(value) => onUpdateTimePreference({ awakeEnd: value[0] })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Priority Morning Hours</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Morning Start</Label>
              <span className="text-sm text-slate-500">{formatHour(timePreference.priorityMorningStart)}</span>
            </div>
            <Slider
              value={[timePreference.priorityMorningStart]}
              min={0}
              max={23}
              step={1}
              onValueChange={(value) => onUpdateTimePreference({ priorityMorningStart: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Morning End</Label>
              <span className="text-sm text-slate-500">{formatHour(timePreference.priorityMorningEnd)}</span>
            </div>
            <Slider
              value={[timePreference.priorityMorningEnd]}
              min={0}
              max={23}
              step={1}
              onValueChange={(value) => onUpdateTimePreference({ priorityMorningEnd: value[0] })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Priority Evening Hours</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Evening Start</Label>
              <span className="text-sm text-slate-500">{formatHour(timePreference.priorityEveningStart)}</span>
            </div>
            <Slider
              value={[timePreference.priorityEveningStart]}
              min={0}
              max={23}
              step={1}
              onValueChange={(value) => onUpdateTimePreference({ priorityEveningStart: value[0] })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Evening End</Label>
              <span className="text-sm text-slate-500">{formatHour(timePreference.priorityEveningEnd)}</span>
            </div>
            <Slider
              value={[timePreference.priorityEveningEnd]}
              min={0}
              max={23}
              step={1}
              onValueChange={(value) => onUpdateTimePreference({ priorityEveningEnd: value[0] })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
