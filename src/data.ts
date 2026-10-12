export type Service = { id: string; icon: string; title: string; description: string; href: string }
export type NewsItem = {
  id: string
  category: string
  date: string
  title: string
  copy: string
  image: string
  url?: string
}
const asset = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

export const services: Service[] = [
  {
    id: 'bplo',
    icon: '▥',
    title: 'BPLO',
    description: 'Business permits, renewals, and registrations.',
    href: '/services/bplo',
  },
  {
    id: 'menro',
    icon: '♻',
    title: 'MENRO',
    description: 'Waste collection, pickup requests, and environmental services.',
    href: '/waste',
  },
  {
    id: 'sanitary',
    icon: '✚',
    title: 'Sanitary',
    description: 'Health clearances, inspections, and sanitary permits.',
    href: '/services?type=sanitary',
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

export const jobs = [
  ['Administrative Aide VI', 'City Mayor’s Office', '₱18,620 / month', 'Permanent'],
  ['Project Development Officer II', 'City Planning Office', '₱33,843 / month', 'Permanent'],
  ['Community Affairs Assistant', 'Public Information Office', '₱22,190 / month', 'Contractual'],
  ['Environmental Management Specialist', 'MENRO', '₱36,619 / month', 'Permanent'],
  ['Computer Programmer II', 'Management Information Technology', '₱31,320 / month', 'Permanent'],
  ['Tourism Operations Officer I', 'City Tourism Office', '₱27,000 / month', 'Contractual'],
]

export const bidItems = [
  [
    'Road Rehabilitation Program — Barangay Mandalagan',
    'BAC-2026-001',
    'Infrastructure',
    'Oct 28, 2026',
  ],
  ['Supply of Medical Equipment for Health Centers', 'BAC-2026-002', 'Goods', 'Nov 4, 2026'],
  ['Public Market Modernization Consultancy', 'BAC-2026-003', 'Consulting', 'Nov 12, 2026'],
  ['Procurement of Waste Collection Vehicles', 'BAC-2026-004', 'Goods', 'Nov 18, 2026'],
]

export const businesses = [
  ['21 Restaurant', 'Filipino · Fine Dining', 'businessDetail.jpg'],
  ['Aboy’s Restaurant', 'Seafood · Filipino', 'inasal.jpg'],
  ['Manokan Country', 'Chicken Inasal · Local', 'dining.png'],
  ['Calea Pastries & Coffee', 'Cafe · Desserts', 'destination4.jpg'],
  ['Bob’s Restaurant', 'Filipino · Family', 'destination3.jpg'],
  ['The Ruins Garden Café', 'Cafe · Heritage', 'ruins.jpg'],
]
