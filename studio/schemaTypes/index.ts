import { localeString, localeText, localeHeading, brandImage } from "./locale";
import {
  category,
  product,
  galleryItem,
  companyValue,
  testimonial,
  jobOpening,
  award,
  credentialScan,
} from "./collections";
import {
  seo,
  pageHero,
  ctaBlock,
  siteSettings,
  homePage,
  aboutPage,
  productsPage,
  facilityPage,
  galleryPage,
  careersPage,
  contactPage,
} from "./pages";

export const schemaTypes = [
  // Reusable field types
  localeString,
  localeText,
  localeHeading,
  brandImage,
  seo,
  pageHero,
  ctaBlock,

  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  productsPage,
  facilityPage,
  galleryPage,
  careersPage,
  contactPage,

  // Collections
  product,
  category,
  galleryItem,
  companyValue,
  testimonial,
  jobOpening,
  award,
  credentialScan,
];

/** Documents that must exist exactly once. Drives the desk structure. */
export const SINGLETONS = [
  { id: "siteSettings", title: "Company information", icon: "🏭" },
  { id: "homePage", title: "Home page", icon: "🏠" },
  { id: "aboutPage", title: "About page", icon: "📖" },
  { id: "productsPage", title: "Products page", icon: "📦" },
  { id: "facilityPage", title: "Facility page", icon: "⚙️" },
  { id: "galleryPage", title: "Gallery page", icon: "🖼️" },
  { id: "careersPage", title: "Careers page", icon: "💼" },
  { id: "contactPage", title: "Contact page", icon: "✉️" },
] as const;
