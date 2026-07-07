import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SmoothScroll from "./lib/SmoothScroll";
import ScrollToTop from "./lib/ScrollToTop";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Factory = lazy(() => import("./pages/Factory"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <div className="grain relative">
      <SmoothScroll />
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Suspense fallback={<div className="min-h-[100dvh] bg-ink" aria-hidden />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/factory" element={<Factory />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
