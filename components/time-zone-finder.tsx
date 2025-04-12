"use client"

import { useState, useEffect } from "react"
import { ContactList } from "@/components/contact-list"
import { Timeline } from "@/components/timeline"
import { SettingsPanel } from "@/components/settings-panel"
import { OptimalTimeDisplay } from "@/components/optimal-time-display"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import type { Contact, TimePreference } from "@/lib/types"
import { findOptimalTime } from "@/lib/time-calculator"
import { detectTimeZone } from "@/lib/time-utils"

export function TimeZoneFinder() {
  const [userTimeZone, setUserTimeZone] = useState<string>("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [timePreference, setTimePreference] = useState<TimePreference>({
    awakeStart: 8, // 8 AM
    awakeEnd: 22, // 10 PM
    priorityEveningStart: 18, // 6 PM
    priorityEveningEnd: 22, // 10 PM
    priorityMorningStart: 7, // 7 AM
    priorityMorningEnd: 9, // 9 AM
  })
  const [optimalTimes, setOptimalTimes] = useState<{
    bestTime: Date | null
    alternativeTimes: Date[]
  }>({ bestTime: null, alternativeTimes: [] })
  const [activeTab, setActiveTab] = useState("contacts")

  // Detect user's time zone on component mount
  useEffect(() => {
    const timezone = detectTimeZone()
    setUserTimeZone(timezone)

    // Add the user as the first contact
    setContacts([
      {
        id: "user",
        name: "You",
        timeZone: timezone,
        isUser: true,
      },
    ])
  }, [])

  // Calculate optimal times whenever contacts or preferences change
  useEffect(() => {
    if (contacts.length > 1) {
      const result = findOptimalTime(contacts, timePreference)
      setOptimalTimes(result)
    }
  }, [contacts, timePreference])

  const handleAddContact = (contact: Contact) => {
    setContacts([...contacts, contact])
  }

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  const handleUpdateTimePreference = (newPreference: Partial<TimePreference>) => {
    setTimePreference({ ...timePreference, ...newPreference })
  }

  return (
    <div className="space-y-6">
      {optimalTimes.bestTime && <OptimalTimeDisplay optimalTimes={optimalTimes} contacts={contacts} />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ContactList
                contacts={contacts}
                userTimeZone={userTimeZone}
                onAddContact={handleAddContact}
                onRemoveContact={handleRemoveContact}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Timeline contacts={contacts} timePreference={timePreference} optimalTimes={optimalTimes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <SettingsPanel
                timePreference={timePreference}
                onUpdateTimePreference={handleUpdateTimePreference}
                userTimeZone={userTimeZone}
                onUpdateUserTimeZone={setUserTimeZone}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {contacts.length <= 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
          <p className="text-center">Add contacts with their time zones to find the best time to connect</p>
        </div>
      )}
    </div>
  )
}
