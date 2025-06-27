export type Participant = {
  id: string
  eventId: string
  name: string
  email: string
  course: 'ADS' | 'GE' | 'GTI' | 'GEMP' | 'MEC' | null
  semester: 'SEM1' | 'SEM2' | 'SEM3' | 'SEM4' | 'SEM5' | 'SEM6' | null
  ra: string | null
  isPresent: boolean
  createdAt: string
  updatedAt: string
}
