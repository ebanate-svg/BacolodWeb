const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')

initializeApp()

const asText = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
const asIsoDate = (value) => {
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
  }
  const date = value?.toDate?.()
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : ''
}
const asNumber = (value, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback
const firstImageUrl = (record) => {
  const images = Array.isArray(record.images) ? record.images : []
  const firstImage = images.find(
    (image) => typeof image === 'string' || (image && typeof image === 'object'),
  )

  return asText(
    record.logoURL ||
      record.logoUrl ||
      record.photoUrl ||
      record.photoURL ||
      record.imageUrl ||
      record.image ||
      (typeof firstImage === 'string' ? firstImage : firstImage?.url),
    2000,
  )
}
const isPublic = (record) => {
  const status = asText(record.status, 30).toLowerCase()
  const visibility = asText(record.visibility, 30).toLowerCase()
  const approvalStatus = asText(record.approvalStatus, 30).toLowerCase()
  return (
    (!approvalStatus || approvalStatus === 'approved') &&
    ![
      'draft',
      'pending',
      'rejected',
      'inactive',
      'hidden',
      'deleted',
      'closed',
      'expired',
      'archived',
    ].includes(status) &&
    !['private', 'hidden'].includes(visibility)
  )
}
const timestampMillis = (value) => value?.toMillis?.() || value?.toDate?.()?.getTime?.() || 0
const formatSalary = (salary) => {
  if (!salary || typeof salary !== 'object') return 'Salary not disclosed'
  const type = asText(salary.type, 30).toLowerCase()
  if (type === 'fixed') return asText(salary.salaryPrice, 60) || 'Salary not disclosed'
  if (type === 'range' || type === 'negotiable') {
    const minimum = asText(salary.minSalary, 60)
    const maximum = asText(salary.maxSalary, 60)
    return minimum && maximum ? `${minimum} – ${maximum}` : 'Negotiable'
  }
  return asText(salary.salaryPrice, 60) || 'Salary not disclosed'
}
const publicCallableOptions = {
  region: 'asia-southeast1',
  cors: true,
  maxInstances: 10,
  timeoutSeconds: 30,
}

const BIDS_SOURCE_URL = 'https://bacolodcity.gov.ph/bids-and-awards/'
const BIDS_CACHE_TTL_MS = 15 * 60 * 1000
let bidsCache = { expiresAt: 0, items: [] }

const decodeHtml = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&hellip;/gi, '…')

const stripHtml = (value) =>
  decodeHtml(value.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()

const isBidDocumentUrl = (value) => {
  try {
    const url = new URL(value, BIDS_SOURCE_URL)
    return (
      url.hostname === 'bacolodcity.gov.ph' && /\.(?:pdf|docx?|xlsx?)(?:$|[?#])/i.test(url.href)
    )
  } catch {
    return false
  }
}

const inferBidCategory = (title) => {
  const normalized = title.toLowerCase()
  if (
    /road|building|construction|concret|drainage|rehab|repair|improvement|facility/.test(normalized)
  ) {
    return 'Infrastructure'
  }
  if (/consult|study|design|survey|professional service/.test(normalized)) return 'Consulting'
  if (
    /vehicle|equipment|supply|material|computer|printer|food|fuel|kit|medicine/.test(normalized)
  ) {
    return 'Goods'
  }
  return 'Invitation to Bid'
}

const parseOfficialBids = (html) => {
  const markerPrefix = '__BAC_BID_DOCUMENT__'
  const content = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (match, href, label) => {
      let absoluteUrl
      try {
        absoluteUrl = new URL(decodeHtml(href), BIDS_SOURCE_URL).href
      } catch {
        return ` ${stripHtml(label)} `
      }
      if (!isBidDocumentUrl(absoluteUrl)) return ` ${stripHtml(label)} `
      const marker = Buffer.from(
        JSON.stringify({ url: absoluteUrl, label: stripHtml(label) }),
      ).toString('base64url')
      return `\n${markerPrefix}${marker}\n`
    })
    .replace(/<\/(?:p|div|h[1-6]|li|section|article|tr)>/gi, '\n')
    .replace(/<br\s*\/?\s*>/gi, '\n')

  const lines = decodeHtml(content.replace(/<[^>]*>/g, ' '))
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  const byUrl = new Map()

  lines.forEach((line, index) => {
    if (!line.startsWith(markerPrefix)) return

    let document
    try {
      document = JSON.parse(Buffer.from(line.slice(markerPrefix.length), 'base64url').toString())
    } catch {
      return
    }

    const nearbyLines = Array.from({ length: 15 }, (_, nearbyIndex) => nearbyIndex - 7)
      .filter((offset) => offset !== 0 && lines[index + offset])
      .map((offset) => ({ offset, text: lines[index + offset] }))
      .filter(({ text }) => !text.startsWith(markerPrefix))
      .sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset) || a.offset - b.offset)
    const titleCandidate = nearbyLines.find(({ text }) =>
      /invitation\s+(?:to|for)|project\s*:/i.test(text),
    )?.text
    const labelIsUseful = document.label && !/^(?:download|view|open)$/i.test(document.label)
    const labelIsTitle =
      labelIsUseful && /invitation\s+(?:to|for)|project\s*:/i.test(document.label)
    const title = asText(
      (labelIsTitle ? document.label : titleCandidate) ||
        (labelIsUseful ? document.label : '') ||
        'Bacolod City invitation to bid',
      300,
    )
    const dateText = nearbyLines.find(({ text }) =>
      /(?:date posted\s*:\s*)?[a-z]+\s+\d{1,2},\s+\d{4}/i.test(text),
    )?.text
    const dateMatch = dateText?.match(/([a-z]+\s+\d{1,2},\s+\d{4})/i)
    const parsedDate = dateMatch ? new Date(dateMatch[1]) : null
    const fileName = decodeURIComponent(new URL(document.url).pathname.split('/').pop() || '')
      .replace(/\.(?:pdf|docx?|xlsx?)$/i, '')
      .replace(/[-_]+/g, ' ')
      .trim()
    const item = {
      id: Buffer.from(document.url).toString('base64url').slice(0, 80),
      title,
      reference:
        asText(labelIsUseful && !labelIsTitle ? document.label : fileName, 120) || 'Bid document',
      category: inferBidCategory(title),
      postedAt: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : '',
      documentUrl: document.url,
      sourceUrl: BIDS_SOURCE_URL,
    }
    const existing = byUrl.get(document.url)
    if (
      !existing ||
      (!existing.postedAt && item.postedAt) ||
      existing.title.length < item.title.length
    ) {
      byUrl.set(document.url, item)
    }
  })

  return [...byUrl.values()].sort((a, b) => {
    const dateDifference = Date.parse(b.postedAt || 0) - Date.parse(a.postedAt || 0)
    return dateDifference || a.title.localeCompare(b.title)
  })
}

exports.getBids = onCall(publicCallableOptions, async (request) => {
  const requestedLimit = Math.round(asNumber(request.data?.limit, 50))
  const limit = Math.max(1, Math.min(100, requestedLimit))

  if (bidsCache.expiresAt <= Date.now()) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)
    try {
      const response = await fetch(BIDS_SOURCE_URL, {
        headers: { 'user-agent': 'Bacolod-eGov-Portal/1.0 (+public bids feed)' },
        signal: controller.signal,
      })
      if (!response.ok) throw new Error(`Official bids page returned HTTP ${response.status}.`)
      const items = parseOfficialBids(await response.text())
      if (!items.length) throw new Error('No bid documents were found on the official page.')
      bidsCache = { expiresAt: Date.now() + BIDS_CACHE_TTL_MS, items }
    } catch (error) {
      console.error('Unable to load the official Bacolod bids page.', error)
      throw new HttpsError('unavailable', 'The official bids feed is temporarily unavailable.')
    } finally {
      clearTimeout(timeout)
    }
  }

  return {
    items: bidsCache.items.slice(0, limit),
    sourceUrl: BIDS_SOURCE_URL,
    fetchedAt: new Date(bidsCache.expiresAt - BIDS_CACHE_TTL_MS).toISOString(),
  }
})

exports.getLatestNews = onCall(
  { region: 'asia-southeast1', cors: true, maxInstances: 10 },
  async () => {
    const snapshot = await getFirestore()
      .collection('news')
      .orderBy('createdAt', 'desc')
      .limit(25)
      .get()
    const items = snapshot.docs
      .map((document) => {
        const news = document.data() || {}
        return {
          id: document.id,
          category: asText(news.category, 60) || 'News',
          date: asIsoDate(news.publishedAt) || asIsoDate(news.createdAt),
          title: asText(news.title, 180),
          copy: asText(news.body || news.description, 360),
          image: asText(news.photoUrl, 2000),
          url: asText(news.url || news.linkUrl, 2000),
          visibility: asText(news.visibility, 30).toLowerCase(),
          status: asText(news.status, 30).toLowerCase(),
        }
      })
      .filter((item) => item.title && item.visibility !== 'private' && item.status !== 'draft')
      .slice(0, 3)
      .map(({ visibility, status, ...item }) => item)

    return { items }
  },
)

exports.getTopDestinations = onCall(publicCallableOptions, async () => {
  const snapshot = await getFirestore().collection('tourist_spots').limit(50).get()
  const items = snapshot.docs
    .map((document) => {
      const spot = document.data() || {}
      return {
        id: document.id,
        title: asText(spot.name || spot.title, 160),
        type: asText(spot.category || spot.type, 80) || 'Destination',
        image: firstImageUrl(spot),
        description: asText(spot.description, 360),
        url: asText(spot.website || spot.url, 2000),
        featured: Boolean(spot.featured || spot.isFeatured),
        rating: asNumber(spot.rating),
        updatedAt: timestampMillis(spot.updatedAt || spot.createdAt || spot.dateAdded),
        public: isPublic(spot),
      }
    })
    .filter((item) => item.public && item.title && item.image)
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || b.rating - a.rating || b.updatedAt - a.updatedAt,
    )
    .slice(0, 7)
    .map(({ featured, rating, updatedAt, public: isPublicItem, ...item }) => item)

  return { items }
})

exports.getTopRestaurants = onCall(publicCallableOptions, async () => {
  const snapshot = await getFirestore().collection('local_businesses').limit(100).get()
  const diningTerms = [
    'restaurant',
    'dining',
    'food',
    'cafe',
    'café',
    'bakery',
    'dessert',
    'inasal',
  ]
  const items = snapshot.docs
    .map((document) => {
      const business = document.data() || {}
      const category = asText(business.category || business.type, 100)
      const hours = business.businessHours || {}
      const open = asText(hours.open, 30)
      const close = asText(hours.close, 30)
      return {
        id: document.id,
        name: asText(business.name, 160),
        type: category || 'Restaurant',
        image: firstImageUrl(business),
        location: asText(business.location || business.address, 240) || 'Bacolod City',
        hours: open && close ? `${open} – ${close}` : 'Open today',
        rating: Math.max(1, Math.min(5, asNumber(business.rating, 5))),
        url: asText(business.website || business.url, 2000),
        featured: Boolean(business.featured || business.isFeatured),
        updatedAt: timestampMillis(business.updatedAt || business.createdAt || business.dateAdded),
        public: isPublic(business),
        dining: diningTerms.some((term) => category.toLowerCase().includes(term)),
      }
    })
    .filter((item) => item.public && item.dining && item.name && item.image)
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) || b.rating - a.rating || b.updatedAt - a.updatedAt,
    )
    .slice(0, 5)
    .map(({ featured, updatedAt, public: isPublicItem, dining, ...item }) => item)

  return { items }
})

async function getPublicJobs() {
  const database = getFirestore()
  const snapshot = await database.collectionGroup('job_listings').limit(100).get()
  const businessIds = [
    ...new Set(
      snapshot.docs
        .map(
          (document) => document.ref.parent.parent?.id || asText(document.data()?.businessId, 160),
        )
        .filter((id) => typeof id === 'string' && id.length > 0),
    ),
  ]
  const businessDocuments = businessIds.length
    ? await database.getAll(
        ...businessIds.map((id) => database.collection('local_businesses').doc(id)),
      )
    : []
  const businessNames = new Map(
    businessDocuments.map((document) => [
      document.id,
      asText(document.data()?.name, 160) || 'Local Business',
    ]),
  )
  const now = Date.now()

  return snapshot.docs
    .map((document) => {
      const job = document.data() || {}
      const businessId = document.ref.parent.parent?.id || asText(job.businessId, 160)
      const deadlineMillis = timestampMillis(job.deadline)
      return {
        id: `${businessId || 'city'}-${document.id}`,
        title: asText(job.jobTitle || job.title || job.position, 180),
        department:
          asText(job.department || job.office || job.agency, 160) ||
          businessNames.get(businessId) ||
          'City Government of Bacolod',
        salary: formatSalary(job.salary),
        type: asText(job.employmentType || job.type, 80) || 'Open position',
        location: asText(job.location, 180) || 'Bacolod City',
        openings: Math.max(1, Math.round(asNumber(job.numberOfOpenings, 1))),
        postedAt: asIsoDate(job.datePosted || job.createdAt),
        deadline: asIsoDate(job.deadline),
        applyUrl: asText(job.applicationUrl || job.applyUrl, 2000),
        postedMillis: timestampMillis(job.datePosted || job.createdAt),
        deadlineMillis,
        public: isPublic(job),
      }
    })
    .filter(
      (item) => item.public && item.title && (!item.deadlineMillis || item.deadlineMillis >= now),
    )
    .sort((a, b) => b.postedMillis - a.postedMillis)
}

exports.getLatestJobs = onCall(publicCallableOptions, async () => {
  const jobs = await getPublicJobs()
  const items = jobs
    .slice(0, 9)
    .map(({ postedMillis, deadlineMillis, public: isPublicItem, ...job }) => job)
  return { items }
})

exports.getJobDepartments = onCall(publicCallableOptions, async () => {
  const jobs = await getPublicJobs()
  const items = [...new Set(jobs.map((job) => job.department))].sort((a, b) => a.localeCompare(b))
  return { items }
})

exports.getCalendarEvents = onCall(publicCallableOptions, async () => {
  const snapshot = await getFirestore().collection('events').limit(100).get()
  const items = snapshot.docs
    .map((document) => {
      const event = document.data() || {}
      const startAt = asIsoDate(event.startAt || event.startDate || event.eventDate)
      const endAt = asIsoDate(event.endAt || event.endDate) || startAt
      return {
        id: document.id,
        title: asText(event.title || event.eventTitle, 180),
        startAt,
        endAt,
        isAllDay: Boolean(event.isAllDay),
        category: asText(event.category, 80) || 'City Event',
        venue: asText(event.venue || event.location, 180),
        description: asText(event.description, 500),
        image: firstImageUrl(event),
        url: asText(event.registrationUrl || event.url, 2000),
        startMillis: startAt ? new Date(startAt).getTime() : 0,
        public: isPublic(event),
      }
    })
    .filter((event) => event.public && event.title && event.startAt)
    .sort((a, b) => a.startMillis - b.startMillis)
    .map(({ startMillis, public: isPublicItem, ...event }) => event)

  return { items }
})

exports.getLocalBusinesses = onCall(publicCallableOptions, async (request) => {
  const cursor = asText(request.data?.cursor, 200)
  const search = asText(request.data?.query, 100).toLowerCase()
  const selectedCategory = asText(request.data?.category, 100)
  const snapshot = await getFirestore().collection('local_businesses').limit(200).get()
  const allBusinesses = snapshot.docs
    .map((document) => {
      const business = document.data() || {}
      const categoryValue = business.category
      const category = Array.isArray(categoryValue)
        ? categoryValue
            .map((value) => asText(value, 80))
            .filter(Boolean)
            .join(' · ')
        : asText(categoryValue || business.type, 160)
      return {
        document,
        id: document.id,
        name: asText(business.name, 160),
        category: category || 'Local Business',
        image: firstImageUrl(business),
        location: asText(business.location || business.address, 240) || 'Bacolod City',
        description: asText(business.description, 500),
        website: asText(business.website || business.url, 2000),
        aggregateRating: asNumber(business.averageRating || business.rating),
        aggregateReviewCount: Math.max(
          0,
          Math.round(asNumber(business.reviewCount || business.reviewsCount)),
        ),
        public: isPublic(business),
      }
    })
    .filter(
      (business) =>
        business.public &&
        business.name &&
        (!search ||
          `${business.name} ${business.category} ${business.description}`
            .toLowerCase()
            .includes(search)) &&
        (!selectedCategory ||
          selectedCategory === 'All Categories' ||
          business.category.toLowerCase().includes(selectedCategory.toLowerCase())),
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  const categories = [
    ...new Set(
      snapshot.docs
        .filter((document) => isPublic(document.data() || {}))
        .flatMap((document) => {
          const value = document.data()?.category
          return Array.isArray(value) ? value : [value]
        })
        .map((value) => asText(value, 80))
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b))
  const cursorIndex = cursor ? allBusinesses.findIndex((business) => business.id === cursor) + 1 : 0
  const start = Math.max(0, cursorIndex)
  const page = allBusinesses.slice(start, start + 9)
  const items = await Promise.all(
    page.map(async (business) => {
      let rating = business.aggregateRating
      let reviewCount = business.aggregateReviewCount

      if (!reviewCount) {
        const reviews = await business.document.ref.collection('reviews').limit(200).get()
        const ratings = reviews.docs
          .map((document) => document.data() || {})
          .filter((review) => isPublic(review))
          .map((review) => asNumber(review.rating || review.stars))
          .filter((value) => value >= 1 && value <= 5)
        reviewCount = ratings.length
        rating = reviewCount ? ratings.reduce((total, value) => total + value, 0) / reviewCount : 0
      }

      const {
        document,
        aggregateRating,
        aggregateReviewCount,
        public: isPublicBusiness,
        ...item
      } = business
      return reviewCount ? { ...item, rating, reviewCount } : item
    }),
  )

  return {
    items,
    nextCursor: start + 9 < allBusinesses.length ? page.at(-1)?.id || null : null,
    total: allBusinesses.length,
    categories,
  }
})

exports.submitServiceRequest = onCall(
  { region: 'asia-southeast1', cors: true },
  async (request) => {
    const { service, name, email, details } = request.data || {}
    if (
      ![service, name, email, details].every((value) => typeof value === 'string' && value.trim())
    ) {
      throw new HttpsError('invalid-argument', 'All request fields are required.')
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || name.length > 120 || details.length > 3000) {
      throw new HttpsError('invalid-argument', 'Request details are invalid.')
    }
    const reference = `BCD-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    await getFirestore().collection('serviceRequests').add({
      service: service.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      details: details.trim(),
      reference,
      status: 'received',
      createdAt: FieldValue.serverTimestamp(),
    })
    return { reference }
  },
)
