"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Contact } from "@/lib/types"
import { getTimeZones, formatInTimeZone, findTimeZoneByLocation } from "@/lib/time-utils"
import { X, Clock, Search } from "lucide-react"
import { v4 as uuidv4 } from "@/lib/uuid"

interface ContactListProps {
  contacts: Contact[]
  userTimeZone: string
  onAddContact: (contact: Contact) => void
  onRemoveContact: (id: string) => void
}

export function ContactList({ contacts, userTimeZone, onAddContact, onRemoveContact }: ContactListProps) {
  const [newContactName, setNewContactName] = useState("")
  const [newContactTimeZone, setNewContactTimeZone] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const timeZones = getTimeZones()
  const now = new Date()

  // Filter time zones based on search query
  const filteredTimeZones = searchQuery
    ? timeZones.filter(
        (tz) =>
          tz.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tz.offset.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : timeZones

  const handleAddContact = () => {
    if (newContactName && newContactTimeZone) {
      onAddContact({
        id: uuidv4(),
        name: newContactName,
        timeZone: newContactTimeZone,
        isUser: false,
      })
      setNewContactName("")
      setNewContactTimeZone("")
      setSearchQuery("")
    }
  }

  // Handle location search and auto-select time zone
  const handleLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 2) {
      const matchedTimeZone = findTimeZoneByLocation(query)
      if (matchedTimeZone) {
        setNewContactTimeZone(matchedTimeZone)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Contacts</h3>

        {contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-slate-500">
                    {timeZones.find((tz) => tz.id === contact.timeZone)?.offset || contact.timeZone}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatInTimeZone(now, contact.timeZone)}
                  </div>
                </div>
                {!contact.isUser && (
                  <Button variant="ghost" size="sm" onClick={() => onRemoveContact(contact.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-slate-500">No contacts added yet</div>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Add New Contact</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Contact name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="location"
                placeholder="Search by city or country"
                value={searchQuery}
                onChange={handleLocationSearch}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timezone">Time Zone</Label>
            <Select value={newContactTimeZone} onValueChange={setNewContactTimeZone}>
              <SelectTrigger id="timezone">
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

          <Button onClick={handleAddContact} disabled={!newContactName || !newContactTimeZone}>
            Add Contact
          </Button>
        </div>
      </div>
    </div>
  )
}
