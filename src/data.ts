export type Service = {
  id: string
  icon: 'business' | 'technology' | 'tracker' | 'senior'
  title: string
  description: string
  href: string
  external?: boolean
}
export type NewsItem = {
  id: string
  category: string
  date: string
  title: string
  copy: string
  image: string
  url?: string
}
export type DestinationItem = {
  id: string
  title: string
  type: string
  image: string
  description?: string
  url?: string
}
export type RestaurantItem = {
  id: string
  name: string
  type: string
  image: string
  location: string
  hours: string
  rating?: number
  url?: string
}
export type JobItem = {
  id: string
  title: string
  department: string
  salary: string
  type: string
  location: string
  openings: number
  postedAt?: string
  deadline?: string
  applyUrl?: string
  applicationInstructions?: string
}
export type CalendarEventItem = {
  id: string
  title: string
  startAt: string
  endAt: string
  isAllDay: boolean
  category: string
  venue?: string
  description?: string
  image?: string
  url?: string
}
export type LocalBusinessItem = {
  id: string
  name: string
  category: string
  image: string
  location: string
  description?: string
  website?: string
  rating?: number
  reviewCount?: number
}
const asset = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

export const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=co.fortistech.bacolodgapp&hl=en'
export const APP_STORE_URL = 'https://apps.apple.com/us/app/bacolod-city-g-app/id6823100596'

export const services: Service[] = [
  {
    id: 'bplo',
    icon: 'business',
    title: 'BPLO',
    description: 'Business permits, renewals, and registrations.',
    href: 'https://permits.bacolodcity.gov.ph/',
  },
  {
    id: 'mitcs',
    icon: 'technology',
    title: 'MITCS Services',
    description: 'Access Bacolod City’s official digital services through the Bacolod G-App.',
    href: '/get-app',
    external: true,
  },
  {
    id: 'case-status-tracker',
    icon: 'tracker',
    title: 'Case Status Tracker',
    description: 'Track the progress and current status of submitted cases and requests.',
    href: '/get-app',
    external: true,
  },
  {
    id: 'senior-citizen-portal',
    icon: 'senior',
    title: 'Senior Citizen Portal',
    description: 'Access digital information and services created for Bacolod’s senior citizens.',
    href: '/get-app',
    external: true,
  },
]

export const news: NewsItem[] = [
  {
    id: '1',
    category: 'Festival',
    date: 'Oct 1, 2026',
    title: 'MassKara Festival 2026',
    copy: 'Celebrate Bacolod’s world-famous festival of smiles with parades and live performances.',
    image: asset('news1.png'),
  },
  {
    id: '2',
    category: 'Health',
    date: 'Nov 5, 2026',
    title: 'Free Health Checkup Caravan',
    copy: 'Participate in the city health and wellness outreach program.',
    image: asset('news2.png'),
  },
  {
    id: '3',
    category: 'Environment',
    date: 'Dec 2, 2026',
    title: 'Clean and Green Bacolod Drive',
    copy: 'Join the citywide cleanup and tree-planting campaign.',
    image: asset('news3.png'),
  },
]

export const jobs: JobItem[] = [
  ['Administrative Aide VI', 'City Mayor’s Office', '₱18,620 / month', 'Permanent'],
  ['Project Development Officer II', 'City Planning Office', '₱33,843 / month', 'Permanent'],
  ['Community Affairs Assistant', 'Public Information Office', '₱22,190 / month', 'Contractual'],
  ['Environmental Management Specialist', 'MENRO', '₱36,619 / month', 'Permanent'],
  ['Computer Programmer II', 'Management Information Technology', '₱31,320 / month', 'Permanent'],
  ['Tourism Operations Officer I', 'City Tourism Office', '₱27,000 / month', 'Contractual'],
  ['Administrative Officer II', 'Human Resource Office', '₱30,531 / month', 'Permanent'],
  ['Civil Engineer I', 'City Engineer’s Office', '₱33,843 / month', 'Permanent'],
  ['Nurse I', 'City Health Office', '₱36,619 / month', 'Permanent'],
].map(([title, department, salary, type], index) => ({
  id: `job-${index + 1}`,
  title,
  department,
  salary,
  type,
  location: 'Bacolod City',
  openings: 1,
}))

export const businesses = [
  ['21 Restaurant', 'Filipino · Fine Dining', 'businessDetail.jpg'],
  ['Aboy’s Restaurant', 'Seafood · Filipino', 'inasal.jpg'],
  ['Manokan Country', 'Chicken Inasal · Local', 'dining.png'],
  ['Calea Pastries & Coffee', 'Cafe · Desserts', 'destination4.jpg'],
  ['Bob’s Restaurant', 'Filipino · Family', 'destination3.jpg'],
  ['The Ruins Garden Café', 'Cafe · Heritage', 'ruins.jpg'],
  ['Quan Delicacies', 'Bacolod delicacies · Pastries', 'dining.png'],
  ['Felicia’s Pastry Café', 'Cafe · Desserts', 'destination4.jpg'],
  ['Chicken House', 'Chicken Inasal · Filipino', 'inasal.jpg'],
]

export const localBusinesses: LocalBusinessItem[] = businesses.map(
  ([name, category, image], index) => ({
    id: `business-${index + 1}`,
    name,
    category,
    image: asset(image),
    location: 'Bacolod City',
  }),
)

export const destinations: DestinationItem[] = [
  ['destination1.png', 'Mambukal Resort', 'Nature'],
  ['destination2.png', 'Campuestohan Highland Resort', 'Adventure'],
  ['destination3.jpg', 'Lakawon Island', 'Beach'],
  ['destination4.jpg', 'Punta Taytay', 'Sunset'],
  ['destination5.png', 'MassKara Festival', 'Festival'],
  ['destination6.png', 'Negros Museum', 'Heritage'],
  ['destination7.jpg', 'The Ruins', 'Landmark'],
].map(([image, title, type], index) => ({
  id: `destination-${index + 1}`,
  image: asset(image),
  title,
  type,
}))

export const restaurants: RestaurantItem[] = businesses
  .slice(0, 5)
  .map(([name, type, image], index) => ({
    id: `restaurant-${index + 1}`,
    name,
    type,
    image: asset(image || 'dining.png'),
    location: 'Bacolod City',
    hours: 'Open today',
    rating: 5,
  }))

export const calendarEvents: CalendarEventItem[] = [
  {
    id: 'event-1',
    title: 'MassKara Festival 2025',
    startAt: '2025-09-22T08:00:00+08:00',
    endAt: '2025-09-22T09:00:00+08:00',
    isAllDay: false,
    category: 'Festival',
  },
  {
    id: 'event-2',
    title: 'Bacolod Food & Flavors Expo',
    startAt: '2025-09-24T11:00:00+08:00',
    endAt: '2025-09-24T12:00:00+08:00',
    isAllDay: false,
    category: 'Food',
  },
  {
    id: 'event-3',
    title: 'Sunset Beats by the Bay',
    startAt: '2025-09-26T14:00:00+08:00',
    endAt: '2025-09-26T15:00:00+08:00',
    isAllDay: false,
    category: 'Music',
  },
  {
    id: 'event-4',
    title: 'Panaad sa Negros Festival',
    startAt: '2025-09-23T16:00:00+08:00',
    endAt: '2025-09-23T17:00:00+08:00',
    isAllDay: false,
    category: 'Festival',
  },
  {
    id: 'event-5',
    title: 'Sounds of the City: Bacolod',
    startAt: '2025-09-26T16:00:00+08:00',
    endAt: '2025-09-26T17:00:00+08:00',
    isAllDay: false,
    category: 'Music',
  },
]
