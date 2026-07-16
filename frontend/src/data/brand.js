export const BRAND_NAME = 'FreshNest'
export const BRAND_TAGLINE = 'Farm Market'
export const BRAND_FULL_NAME = `${BRAND_NAME} ${BRAND_TAGLINE}`

export const heroSlides = [
  {
    title: 'Morning dairy from local farms',
    badge: 'Fresh dairy',
    headline: 'Pure farm milk delivered every morning',
    detail: 'Order cow milk, curd and goat milk packed fresh from trusted nearby farms.',
    image:
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1600&q=85',
  },
  {
    title: 'Fresh seafood packed on order',
    badge: 'Fresh seafood',
    headline: 'Clean fish and prawns packed on order',
    detail: 'Choose fresh water fish, sea fish, crab and prawns cleaned for daily cooking.',
    image:
      'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1600&q=85',
  },
  {
    title: 'Country eggs and clean meat',
    badge: 'Daily essentials',
    headline: 'Country eggs and clean meat for home meals',
    detail: 'Get eggs, chicken and meat from local suppliers with same-day freshness.',
    image:
      'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=1600&q=85',
  },
]

const imageByName = {
  'Milk & Dairy':
    '/product-images/raw-milk-bowl.svg',
  'Goat Farm':
    'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=1000&q=85',
  'Chicken Farm':
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=85',
  Eggs:
    'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=1000&q=85',
  'Fresh Water Fish':
    'https://commons.wikimedia.org/wiki/Special:FilePath/Labeo_rohita_at_traditional_holiday_market.jpg?width=900',
  'Sea Fish':
    'https://www.dishthefish.com.sg/cdn/shop/products/image_a3df6a6f-e813-4ef5-8e63-8139fcfba1b5.jpg?v=1555680484&width=1000',
  'Fresh Water Prawn':
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1000&q=85',
  'Sea Prawn':
    'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1000&q=85',
  Crab:
    'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1000&q=85',
  Meat:
    'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1000&q=85',
  'A2 Cow Milk':
    '/product-images/raw-milk-bowl.svg',
  'Fresh Cow Milk':
    'https://images.unsplash.com/photo-1578270289606-e54db2b29e13?auto=format&fit=crop&w=1000&q=85',
  'Cow Milk':
    'https://images.unsplash.com/photo-1578270289606-e54db2b29e13?auto=format&fit=crop&w=1000&q=85',
  'Buffalo Curd':
    'https://www.freeimageslive.co.uk/files/images010/sour_cream.preview.jpg',
  'Goat Milk':
    'https://milkup.co.id/cdn/shop/products/rawgoatmilk1.jpg?v=1670659240&width=1000',
  'Goat Meat Curry Cut':
    'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1000&q=85',
  'Country Chicken':
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1000&q=85',
  'Broiler Chicken':
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=1000&q=85',
  'Country Eggs':
    'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=1000&q=85',
  'White Eggs':
    'https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?auto=format&fit=crop&w=1000&q=85',
  'Rohu Fish':
    'https://commons.wikimedia.org/wiki/Special:FilePath/Rohu_at_Giant_Hypermarket_Kota_Damansara_20230203_105829.jpg?width=900',
  'Catla Fish':
    'https://commons.wikimedia.org/wiki/Special:FilePath/Catla_catla.JPG?width=900',
  'Seer Fish':
    'https://www.dishthefish.com.sg/cdn/shop/products/image_a3df6a6f-e813-4ef5-8e63-8139fcfba1b5.jpg?v=1555680484&width=1000',
  Sardine:
    'https://www.seriouseats.com/thmb/79N_67i2RPJ-Ug4g7Be-kU_886U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2018__01__20170117-how-to-clean-sardines-vicky-wasik1-13fbba78ebbd4f78acc258f27d1d471b.jpg',
  'Live Mud Crab':
    'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1000&q=85',
  'Mutton Curry Cut':
    'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=1000&q=85',
}

export function categoryImage(category) {
  return imageByName[category?.category_name] || category?.category_image
}

export function productImage(product) {
  return imageByName[product?.product_name] || product?.product_image
}
