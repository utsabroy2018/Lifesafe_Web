import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import LoadingState from './components/LoadingState';
import Branch from './pages/Branch';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const OurMission = lazy(() => import('./pages/OurMission'));
const OurVision = lazy(() => import('./pages/OurVision'));
const MedTech = lazy(() => import('./pages/MedTech'));
const BME = lazy(() => import('./pages/BME'));
const Catalog = lazy(() => import('./pages/ProductCatalog'));
const Listing = lazy(() => import('./pages/ProductListing'));
const Details = lazy(() => import('./pages/ProductDetails'));
const Services = lazy(() => import('./pages/Services'));
const Customers = lazy(() => import('./pages/Customers'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/EmployeeLogin'));

export default function App() {
  return <Suspense fallback={<LoadingState fullPage />}><Routes><Route element={<SiteLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/our-mission" element={<OurMission />} />
    <Route path="/our-vision" element={<OurVision />} />
    <Route path="/modern-medical-technology" element={<MedTech />} />
    <Route path="/biomedical-engineering" element={<BME />} />
    <Route path="/branch" element={<Branch />} />
    <Route path="/products" element={<Catalog />} /><Route path="/products/:categorySlug" element={<Listing />} />
    <Route path="/product/:productSlug" element={<Details />} /><Route path="/services" element={<Services />} />
    <Route path="/customer-list" element={<Customers />} /><Route path="/contact" element={<Contact />} />
  </Route><Route path="/employee-login" element={<Login />} /></Routes></Suspense>;
}
