import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import BidsPage from './pages/Bids'
import ContactPage from './pages/Contact'
import GetAppPage from './pages/GetApp'
import Home from './pages/Home'
import JobsPage from './pages/Jobs'
import BusinessPage, { BusinessDetail } from './pages/LocalBusiness'
import NotFound from './pages/NotFound'
import ServicesPage, { BploPage, RequirementsPage } from './pages/OnlineServices'
import ResourcesPage from './pages/Resources'
import TourismPage from './pages/Tourism'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/bplo" element={<BploPage />} />
        <Route path="/services/bplo/requirements" element={<RequirementsPage />} />
        <Route path="/services/bplo/apply" element={<Navigate to="/get-app" replace />} />
        <Route path="/tourism" element={<TourismPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobListing" element={<JobsPage />} />
        <Route path="/bids" element={<BidsPage />} />
        <Route path="/allBids" element={<BidsPage />} />
        <Route path="/procurement" element={<BidsPage procurement />} />
        <Route path="/local-business" element={<BusinessPage />} />
        <Route path="/localBusiness" element={<BusinessPage />} />
        <Route path="/local-business/21-restaurant" element={<BusinessDetail />} />
        <Route path="/civic" element={<ResourcesPage />} />
        <Route path="/civicEngagement" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/get-app" element={<GetAppPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
