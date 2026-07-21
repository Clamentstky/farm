export const BRAND_NAME = 'FreshNest'
export const BRAND_TAGLINE = 'Farm Market'
export const BRAND_FULL_NAME = `${BRAND_NAME} ${BRAND_TAGLINE}`

export const heroSlides = [
  {
    title: 'Morning dairy from local farms',
    badge: 'Fresh dairy',
    headline: 'Pure farm milk delivered every morning',
    detail: 'Order cow milk, curd and goat milk packed fresh from trusted nearby farms.',
    image: '/product-images/banner1.png',
  },
  {
    title: 'Fresh seafood packed on order',
    badge: 'Fresh seafood',
    headline: 'Clean fish and prawns packed on order',
    detail: 'Choose fresh water fish, sea fish, crab and prawns cleaned for daily cooking.',
    image: '/product-images/banner2.png',
  },
  {
    title: 'Country eggs and clean meat',
    badge: 'Daily essentials',
    headline: 'Country eggs and clean meat for home meals',
    detail: 'Get eggs, chicken and meat from local suppliers with same-day freshness.',
    image: '/product-images/banner3.png',
  },
]

export const FALLBACK_IMAGE = '/product-images/fresh-cow-milk4.jpg'

export const CATEGORY_ORDER = [
  'Milk & Dairy',
  'Goat Farm',
  'Chicken Farm',
  'Eggs',
  'Fresh Water Fish',
  'Sea Fish',
  'Fresh Water Prawn',
  'Sea Prawn',
  'Crab',
  'Meat',
]

const categoryOrderIndex = new Map(
  CATEGORY_ORDER.map((categoryName, index) => [categoryName.toLowerCase(), index])
)

const categoryImageByName = {
  'Milk & Dairy': '/product-images/milk1.jpg',
  'Goat Farm': '/product-images/goat%20farm.jpg',
  'Chicken Farm': '/product-images/chicken3.jpg',
  Eggs: '/product-images/eggs2.jpg',
  'Fresh Water Fish': '/product-images/fresh%20water%20fish.jpg',
  'Sea Fish': '/product-images/sea%20fish.jpg',
  'Fresh Water Prawn': '/product-images/fresh%20water%20prawn.jpg',
  'Sea Prawn': '/product-images/sea%20prawn.jpg',
  Crab: '/product-images/crab.jpg',
  Meat: '/product-images/meat.jpg',
}

const generatedImageSetProducts = new Set([
  'Sea Tiger Prawn',
  'Medium Sea Prawn',
  'Jumbo Sea Prawn',
  'Catla Fish',
  'Fresh Catla Slices',
  'Tender Goat Curry Cut',
  'Chicken Curry Cut',
  'Duck Eggs',
  'Jumbo Fresh Water Prawn',
  'River Prawn',
  'Blue Crab',
  'Crab Claws',
  'Boneless Mutton',
  'Mutton Curry Cut',
])

const generatedImageNameByProduct = {
  'Country Chicken': 'country chicken',
  'Fresh Cow Milk': 'fresh-cow-milk',
}

function productImagePath(imageName) {
  return `/product-images/${encodeURIComponent(imageName)}.jpg`
}

function generatedProductImages(productName) {
  if (productName === 'Live Mud Crab') {
    return [1, 2, 3].map((imageNumber) => {
      const imageName = imageNumber === 1 ? productName.toLowerCase() : productName
      return productImagePath(`${imageName}${imageNumber}`)
    })
  }

  if (productName === 'Meat Curry Mix') {
    return [
      productImagePath('Meat Curry Mix1'),
      productImagePath('Meat Curry Mix2'),
      productImagePath('mutton1'),
    ]
  }

  const generatedImageName = generatedImageNameByProduct[productName]
  if (generatedImageName) {
    return [1, 2, 3].map((imageNumber) => productImagePath(`${generatedImageName}${imageNumber}`))
  }

  if (!generatedImageSetProducts.has(productName)) return null

  const imageName = encodeURIComponent(productName)
  return [1, 2, 3].map((imageNumber) => `/product-images/${imageName}${imageNumber}.jpg`)
}

export function orderedCategories(categories = []) {
  return [...categories]
    .filter((category) => categoryOrderIndex.has(category?.category_name?.toLowerCase()))
    .sort((first, second) => (
      categoryOrderIndex.get(first.category_name.toLowerCase()) -
      categoryOrderIndex.get(second.category_name.toLowerCase())
    ))
}

export function categoryImage(category) {
  return categoryImageByName[category?.category_name] || category?.category_image || FALLBACK_IMAGE
}

export function productImage(product) {
  return generatedProductImages(product?.product_name)?.[0] || product?.product_image || product?.images?.[0] || FALLBACK_IMAGE
}

export function productImages(product) {
  const overrideImages = generatedProductImages(product?.product_name)
  if (overrideImages) return overrideImages

  const suppliedImages = Array.isArray(product?.images) ? product.images : []

  return [...new Set([productImage(product), ...suppliedImages].filter(Boolean))]
    .slice(0, 3)
}
