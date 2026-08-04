import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube, 
  FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay,
  FaChevronRight, FaArrowUp, FaEnvelope, FaLeaf,
  FaTruck, FaShieldAlt, FaStar
} from 'react-icons/fa'
import BrandIcon from './BrandIcon'
import { BRAND_FULL_NAME } from '../data/brand'

const productLinks = [
  'A2 Cow Milk',
  'Country Eggs',
  'Fresh Water Fish',
  'Sea Prawn',
]

const galleryImages = [
  { src: '/product-images/broiler-chicken.jpg', alt: 'Broiler Chicken', title: 'Farm Chicken' },
  { src: '/product-images/white%20egg4.jpg', alt: 'Country eggs', title: 'Country Eggs' },
  { src: '/product-images/curd4.jpg', alt: 'Fresh dairy', title: 'Fresh Dairy' },
  { src: '/product-images/crab3.jpg', alt: 'Fresh seafood', title: 'Fresh Seafood' },
]

// Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 50, damping: 15 } 
  }
}

export default function SiteFooter({ compact = false }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }, 1500)
  }

  return (
    <footer className="relative mt-16 overflow-hidden bg-[#eef7ed] px-4 py-8 sm:px-6 lg:px-8">
      {/* Background Animated Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -right-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-emerald-200/20 blur-[80px] will-change-transform" 
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1] }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -left-[10%] bottom-[0%] h-[600px] w-[600px] rounded-full bg-green-300/10 blur-[100px] will-change-transform" 
        />
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -40, 0], 
              x: [0, i % 2 === 0 ? 30 : -30, 0],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full bg-white/40 blur-[2px] will-change-transform"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="farm-footer-shell relative z-10 mx-auto max-w-7xl rounded-[2rem] p-3 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.55)] sm:p-4"
      >
        <div className="rounded-[1.5rem] bg-[#055205]/95 px-5 py-8 text-white shadow-2xl backdrop-blur-xl sm:px-8 lg:px-12 lg:py-12 border border-white/10">
          

          <div className="grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr] lg:gap-10">
            
            {/* Brand Info & Trust Cards */}
            <motion.div variants={fadeUpVariant} className="col-span-2 max-w-md lg:col-span-1">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 inline-flex focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none rounded-xl"
                tabIndex={0}
              >
                <motion.div 
                  whileHover={{ rotate: 3, scale: 1.08, filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.5))' }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md will-change-transform"
                >
                  <BrandIcon className="h-8 w-8" />
                </motion.div>
                <div>
                  <p className="font-display text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 leading-snug hover:to-emerald-200 transition-all duration-300">
                    {BRAND_FULL_NAME}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                    Village Farm Delivery
                  </p>
                </div>
              </motion.div>
              <p className="mt-6 text-sm font-medium leading-relaxed text-white/75">
                Fresh dairy, fish, prawn, eggs, crab and meat from trusted local suppliers, packed cleanly and delivered fresh across nearby villages.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                <TrustCard icon={<FaLeaf className="mb-2 text-emerald-400" size={18} />} title="Farm Fresh" />
                <TrustCard icon={<FaShieldAlt className="mb-2 text-emerald-400" size={18} />} title="Trusted" />
                <TrustCard icon={<FaTruck className="mb-2 text-emerald-400" size={18} />} title="Fast Delivery" />
              </div>
            </motion.div>

            {/* Products Links */}
            <motion.div variants={fadeUpVariant}>
              <FooterTitle>Products</FooterTitle>
              <div className="flex flex-col gap-3">
                {productLinks.map((product) => (
                  <AnimatedLink key={product} to="/customer/dashboard#featured">{product}</AnimatedLink>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={fadeUpVariant}>
              <FooterTitle>Quick Links</FooterTitle>
              <div className="flex flex-col gap-3">
                <AnimatedLink to="/customer/dashboard#home">Home</AnimatedLink>
                <AnimatedLink to="/customer/dashboard#categories">Categories</AnimatedLink>
                <AnimatedLink to="/customer/dashboard#featured">Featured</AnimatedLink>
                <AnimatedLink to="/customer/dashboard#popular">Popular</AnimatedLink>
                {!compact && (
                  <AnimatedLink to="/customer/dashboard">Dashboard</AnimatedLink>
                )}
              </div>
            </motion.div>

            {/* Gallery */}
            <motion.div variants={fadeUpVariant} className="col-span-2 w-full lg:col-span-1">
              <FooterTitle>Fresh Gallery</FooterTitle>
              <div className="grid w-full grid-cols-2 gap-3 sm:max-w-sm md:max-w-md lg:max-w-[240px]">
                {galleryImages.map((image) => (
                  <motion.div
                    key={image.src}
                    whileHover="hover"
                    className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10 cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                    tabIndex={0}
                  >
                    <motion.img
                      variants={{
                        hover: { scale: 1.1, rotateZ: 2 }
                      }}
                      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover will-change-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                      {image.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeUpVariant} className="mt-12 mb-4 border-t border-white/10 pt-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <SocialIcon icon={<FaFacebookF />} />
                <SocialIcon icon={<FaTwitter />} />
                <SocialIcon icon={<FaInstagram />} />
                <SocialIcon icon={<FaYoutube />} />
              </div>

              {/* Payment Icons */}
              <div className="flex items-center gap-2 text-white/50">
                <PaymentIcon icon={<FaCcVisa size={28} />} />
                <PaymentIcon icon={<FaCcMastercard size={28} />} />
                <PaymentIcon icon={<FaCcPaypal size={28} />} />
                <PaymentIcon icon={<FaApplePay size={28} />} />
              </div>

            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="flex flex-col items-center gap-2 text-center text-xs font-semibold text-white/40 sm:flex-row sm:justify-between sm:text-left">
            <p>© {new Date().getFullYear()} {BRAND_FULL_NAME}. All rights reserved.</p>
            <p className="flex items-center gap-1">Made with <FaStar className="text-yellow-500/70" /> for local farms.</p>
          </motion.div>
        </div>
      </motion.div>


    </footer>
  )
}

function FooterTitle({ children }) {
  return (
    <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-emerald-400/90 relative inline-block">
      {children}
      <span className="absolute -bottom-2 left-0 h-[2px] w-8 bg-emerald-500/50 rounded-full" />
    </h2>
  )
}

function TrustCard({ icon, title }) {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', backgroundColor: 'rgba(255,255,255,0.15)' }}
      className="flex flex-col items-center justify-center rounded-2xl bg-white/5 px-2 py-4 text-center ring-1 ring-white/10 backdrop-blur-sm transition-colors will-change-transform cursor-default"
    >
      {icon}
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/90">{title}</p>
    </motion.div>
  )
}

function AnimatedLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="group relative inline-flex w-fit items-center text-sm font-semibold text-white/70 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none rounded-md px-1 -mx-1"
    >
      <span className="absolute -left-4 text-emerald-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-focus-visible:opacity-100 group-focus-visible:translate-x-1">
        <FaChevronRight size={10} />
      </span>
      <span className="relative transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1">
        {children}
        <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300 group-hover:w-full group-focus-visible:w-full rounded-full" />
      </span>
    </Link>
  )
}

function SocialIcon({ icon }) {
  return (
    <motion.a
      href="#"
      whileHover={{ 
        scale: 1.2, 
        rotate: 360, 
        backgroundColor: 'rgba(16,185,129,0.2)',
        boxShadow: '0 0 15px rgba(16,185,129,0.5)'
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/70 ring-1 ring-white/10 backdrop-blur-md transition-colors hover:text-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none will-change-transform"
    >
      {icon}
    </motion.a>
  )
}

function PaymentIcon({ icon }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.05, filter: 'drop-shadow(0 4px 6px rgba(255,255,255,0.2))' }}
      className="rounded-lg bg-white/5 px-2 py-1 ring-1 ring-white/5 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white hover:ring-white/20 will-change-transform cursor-default"
    >
      {icon}
    </motion.div>
  )
}
