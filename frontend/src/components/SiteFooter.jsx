import { Link } from 'react-router-dom'
import BrandIcon from './BrandIcon'
import { BRAND_FULL_NAME } from '../data/brand'

const productLinks = [
  'A2 Cow Milk',
  'Country Eggs',
  'Fresh Water Fish',
  'Sea Prawn',
]

const galleryImages = [
  {
    src: '/product-images/raw-milk-bowl.svg',
    alt: 'Raw milk in bowl',
  },
  {
    src: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=300&q=80',
    alt: 'Country chicken farm',
  },
  {
    src: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=300&q=80',
    alt: 'Fresh eggs',
  },
  {
    src: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80',
    alt: 'Fresh fish',
  },
]

export default function SiteFooter({ compact = false }) {
  return (
    <footer className="mt-12 bg-soil-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-[linear-gradient(135deg,_#8ed8c8_0%,_#43b86b_55%,_#118707_100%)] p-3 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.55)] sm:p-4">
        <div className="rounded-[1.5rem] bg-[#118707]/95 px-5 py-8 text-white sm:px-8 lg:px-12 lg:py-11">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.45fr_0.8fr_0.75fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <BrandIcon className="h-8 w-8" />
              <div>
                <p className="font-display text-lg font-semibold text-white">{BRAND_FULL_NAME}</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-white/78">
              Fresh dairy, fish, prawn, eggs, crab and meat from trusted local suppliers,
              packed cleanly and delivered fresh across nearby villages.
            </p>
          </div>

          <div className="hidden md:block">
            <FooterTitle>Product</FooterTitle>
            <div className="grid gap-3 text-sm font-medium text-white/76">
              {productLinks.map((product) => (
                <a key={product} href="#featured" className="hover:text-white">
                  {product}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <FooterTitle>Links</FooterTitle>
            <div className="grid gap-3 text-sm font-medium text-white/76">
              <a href="#home" className="hover:text-white">Home</a>
              <a href="#categories" className="hover:text-white">Categories</a>
              <a href="#featured" className="hover:text-white">Featured</a>
              <a href="#popular" className="hover:text-white">Popular</a>
              {!compact && (
                <Link to="/customer/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="w-full md:col-span-2 lg:col-span-1">
            <FooterTitle>Gallery</FooterTitle>
            <div className="grid w-full grid-cols-2 gap-3 sm:max-w-sm md:max-w-md lg:max-w-[190px]">
              {galleryImages.map((image) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/3] w-full rounded-sm object-cover shadow-sm shadow-black/20"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
          </div>

          <div className="mt-8 rounded-2xl bg-white/10 px-4 py-4 text-center text-xs font-semibold text-white/70 ring-1 ring-white/10">
            Copyright 2026 by FreshNest Farm Market
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterTitle({ children }) {
  return (
    <h2 className="mb-5 font-display text-base font-semibold text-white">
      {children}
    </h2>
  )
}
