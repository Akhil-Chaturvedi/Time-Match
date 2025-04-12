export interface Contact {
  id: string
  name: string
  timeZone: string
  isUser?: boolean
}

export interface TimePreference {
  awakeStart: number // Hour (0-23)
  awakeEnd: number // Hour (0-23)
  priorityMorningStart: number // Hour (0-23)
  priorityMorningEnd: number // Hour (0-23)
  priorityEveningStart: number // Hour (0-23)
  priorityEveningEnd: number // Hour (0-23)
}
