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
    src: '/product-images/curd4.jpg',
    alt: 'Fresh farm milk',
  },
  {
    src: '/product-images/white%20egg4.jpg',
    alt: 'Country eggs',
  },
  {
    src: '/product-images/crab3.jpg',
    alt: 'Fresh prawns',
  },
  {
    src: '/product-images/sardine4.jpg',
    alt: 'Fresh meat cuts',
  },
]

export default function SiteFooter({ compact = false }) {
  return (
    <footer className="mt-12 bg-[#eef7ed] px-4 py-8 sm:px-6 lg:px-8">
      <div className="farm-footer-shell mx-auto max-w-7xl rounded-[2rem] p-3 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.55)] sm:p-4">
        <div className="rounded-[1.5rem] bg-[#055205]/95 px-5 py-8 text-white sm:px-8 lg:px-12 lg:py-11">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-[1.45fr_0.8fr_0.75fr_1fr] lg:gap-8">
            <div className="col-span-2 max-w-sm lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/15">
                  <BrandIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-white">{BRAND_FULL_NAME}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                    Village Farm Delivery
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm font-medium leading-7 text-white/75">
                Fresh dairy, fish, prawn, eggs, crab and meat from trusted local suppliers,
                packed cleanly and delivered fresh across nearby villages.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <FooterStat title="Farm Fresh" detail="Locally sourced" />
                <FooterStat title="Trusted" detail="Quality products" />
                <FooterStat title="Local Delivery" detail="Closer to home" />
              </div>
            </div>

            <div>
              <FooterTitle>Product</FooterTitle>
              <div className="grid gap-3 text-sm font-semibold text-white/72">
                {productLinks.map((product) => (
                  <Link key={product} to="/customer/dashboard#featured" className="hover:text-white">
                    {product}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <FooterTitle>Links</FooterTitle>
              <div className="grid gap-3 text-sm font-semibold text-white/72">
                <Link to="/customer/dashboard#home" className="hover:text-white">Home</Link>
                <Link to="/customer/dashboard#categories" className="hover:text-white">Categories</Link>
                <Link to="/customer/dashboard#featured" className="hover:text-white">Featured</Link>
                <Link to="/customer/dashboard#popular" className="hover:text-white">Popular</Link>
                {!compact && (
                  <Link to="/customer/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                )}
              </div>
            </div>

            <div className="col-span-2 w-full lg:col-span-1">
              <FooterTitle>Gallery</FooterTitle>
              <div className="grid w-full grid-cols-2 gap-3 sm:max-w-sm md:max-w-md lg:max-w-[220px]">
                {galleryImages.map((image) => (
                  <img
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[4/3] w-full rounded-lg object-cover shadow-sm shadow-black/20 ring-1 ring-white/10"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2 border-t border-white/10 pt-5 text-center text-xs font-semibold text-white/60 sm:flex-row sm:justify-between sm:text-left">
            <p>Copyright 2026 by FreshNest Farm Market</p>
            <p>Fresh from local farms, delivered with care.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterTitle({ children }) {
  return (
    <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-white">
      {children}
    </h2>
  )
}

function FooterStat({ title, detail }) {
  return (
    <div className="rounded-2xl bg-white/10 px-3 py-4 text-center ring-1 ring-white/10">
      <p className="text-xs font-bold text-white">{title}</p>
      <p className="mt-1 text-[11px] font-semibold text-white/55">{detail}</p>
    </div>
  )
}
