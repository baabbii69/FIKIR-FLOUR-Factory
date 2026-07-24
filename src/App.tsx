import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Loader from "./components/Loader";
import PageTransition from "./components/PageTransition";
import SmoothScroll from "./lib/SmoothScroll";

// Route-level code splitting: each page ships as its own chunk so the first
// load only pulls the shell + the landing route, not the whole site. Matters
// most on mobile / slower connections.
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Facility = lazy(() => import("./pages/Facility"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Below-the-fold, not needed for first paint.
const ChatWidget = lazy(() => import("./components/ChatWidget"));

// Reserve vertical space while a route chunk resolves so the footer doesn't
// jump up — no spinner, which would fight the page's own entrance animations.
function RouteFallback() {
  return <div aria-hidden className="min-h-[80vh]" />;
}

export default function App() {
  return (
    <div className="grain relative">
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <ErrorBoundary>
          {/* Delayed-location page transition drives what the routes render;
              scroll reset + ScrollTrigger refresh happen mid-transition. */}
          <PageTransition>
            {(loc) => (
              <Suspense fallback={<RouteFallback />}>
                <Routes location={loc}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/facility" element={<Facility />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            )}
          </PageTransition>
        </ErrorBoundary>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
      <Loader />
    </div>
  );
}
