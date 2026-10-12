const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')

initializeApp()

const asText = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
const asIsoDate = (value) => {
  const date = value?.toDate?.()
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : ''
}

exports.getLatestNews = onCall({ region: 'asia-southeast1', cors: true, maxInstances: 10 }, async () => {
  const snapshot = await getFirestore().collection('news').orderBy('createdAt', 'desc').limit(25).get()
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
})

exports.submitServiceRequest = onCall({ region: 'asia-southeast1', cors: true }, async (request) => {
  const { service, name, email, details } = request.data || {}
  if (![service, name, email, details].every((value) => typeof value === 'string' && value.trim())) {
    throw new HttpsError('invalid-argument', 'All request fields are required.')
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || name.length > 120 || details.length > 3000) {
    throw new HttpsError('invalid-argument', 'Request details are invalid.')
  }
  const reference = `BCD-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  await getFirestore().collection('serviceRequests').add({
    service: service.trim(), name: name.trim(), email: email.trim().toLowerCase(), details: details.trim(),
    reference, status: 'received', createdAt: FieldValue.serverTimestamp(),
  })
  return { reference }
})
