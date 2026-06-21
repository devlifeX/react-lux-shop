export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
}

export const categories = [
  { id: "all", name: "All", icon: "Grid3X3" },
  { id: "timepieces", name: "Timepieces", icon: "Clock" },
  { id: "jewelry", name: "Jewelry", icon: "Gem" },
  { id: "leather", name: "Leather Goods", icon: "BaggageClaim" },
  { id: "fragrance", name: "Fragrance", icon: "SprayCan" },
] as const

export const products: Product[] = [
  {
    id: "p1",
    name: "Aventurine Chronograph",
    description:
      "Swiss-made automatic movement with aventurine dial, featuring 18k gold indices and a sapphire crystal case back. Water resistant to 100 meters.",
    price: 12500,
    originalPrice: 14500,
    category: "timepieces",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
    ],
    rating: 4.9,
    reviewCount: 124,
    inStock: true,
    featured: true,
  },
  {
    id: "p2",
    name: "Celestial Gold Pendant",
    description:
      "Handcrafted 18k gold pendant with a 0.5 carat diamond at its center. The celestial-inspired design features intricate filigree work.",
    price: 8900,
    category: "jewelry",
    image:
      "https://images.unsplash.com/photo-1515562141589-677c7cb0b859?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1515562141589-677c7cb0b859?w=600&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
    ],
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    featured: true,
  },
  {
    id: "p3",
    name: "Heritage Weekender Bag",
    description:
      "Full-grain Italian leather weekender bag with brass hardware. Features a padded laptop compartment and removable shoulder strap.",
    price: 3200,
    originalPrice: 3800,
    category: "leather",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
    ],
    rating: 4.7,
    reviewCount: 56,
    inStock: true,
    featured: true,
  },
  {
    id: "p4",
    name: "Noir Oud Parfum",
    description:
      "An exclusive blend of rare Oud, bergamot, and amber. Notes of leather and tobacco create a sophisticated, long-lasting fragrance.",
    price: 480,
    category: "fragrance",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80",
    ],
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
    featured: true,
  },
  {
    id: "p5",
    name: "Skeleton Open-Heart Automatic",
    description:
      "An open-heart skeleton dial reveals the intricate automatic movement beneath. Rose gold case with alligator leather strap.",
    price: 9800,
    category: "timepieces",
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
    ],
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    featured: false,
  },
  {
    id: "p6",
    name: "Diamond Eternity Band",
    description:
      "A continuous band of brilliant-cut diamonds set in platinum. Each diamond is graded D-F in color and VVS1-VVS2 in clarity.",
    price: 15600,
    category: "jewelry",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      "https://images.unsplash.com/photo-1515562141589-677c7cb0b859?w=600&q=80",
    ],
    rating: 5.0,
    reviewCount: 34,
    inStock: true,
    featured: false,
  },
  {
    id: "p7",
    name: "Argentum Card Holder",
    description:
      "Slim card holder crafted from premium Argentum leather with RFID-blocking technology. Holds up to 6 cards.",
    price: 450,
    category: "leather",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    ],
    rating: 4.5,
    reviewCount: 112,
    inStock: true,
    featured: false,
  },
  {
    id: "p8",
    name: "Ambre Nuit Eau de Parfum",
    description:
      "A warm, sensual blend of amber, vanilla, and rose. Hints of bergamot and patchouli create an unforgettable signature scent.",
    price: 320,
    originalPrice: 380,
    category: "fragrance",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
    ],
    rating: 4.7,
    reviewCount: 178,
    inStock: true,
    featured: false,
  },
]
