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
  body?: string
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
  hours?: string
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

export const destinations: DestinationItem[] = [
  {
    id: 'mambukal-resort',
    title: 'Mambukal Resort',
    type: 'Nature',
    image: asset('destination1.png'),
    description:
      'Discover mountain scenery, refreshing springs, and outdoor adventures near Bacolod.',
  },
  {
    id: 'campuestohan-highland-resort',
    title: 'Campuestohan Highland Resort',
    type: 'Adventure',
    image: asset('destination2.png'),
    description: 'Enjoy family attractions and panoramic highland views in Talisay City.',
  },
  {
    id: 'lakawon-island',
    title: 'Lakawon Island',
    type: 'Beach',
    image: asset('destination3.jpg'),
    description: 'Relax beside clear waters and soft sand at this popular island destination.',
  },
  {
    id: 'punta-taytay',
    title: 'Punta Taytay',
    type: 'Sunset',
    image: asset('destination4.jpg'),
    description: 'Experience coastal dining and beautiful sunset views close to the city.',
  },
  {
    id: 'masskara-festival',
    title: 'MassKara Festival',
    type: 'Festival',
    image: asset('destination5.png'),
    description: 'Celebrate Bacolod’s colorful culture through music, dance, and smiling masks.',
  },
  {
    id: 'negros-museum',
    title: 'Negros Museum',
    type: 'Heritage',
    image: asset('destination6.png'),
    description: 'Explore stories, art, and artifacts that preserve the heritage of Negros Island.',
  },
  {
    id: 'the-ruins',
    title: 'The Ruins',
    type: 'Landmark',
    image: asset('destination7.jpg'),
    description: 'Visit the iconic remains of a grand ancestral mansion surrounded by gardens.',
  },
]
