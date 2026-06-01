import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// bcryptjs does not have a default export — use require
const bcrypt = require('bcryptjs') as typeof import('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: { name: 'Electronics', slug: 'electronics' },
    }),
    prisma.category.upsert({
      where: { slug: 'clothing' },
      update: {},
      create: { name: 'Clothing', slug: 'clothing' },
    }),
    prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: { name: 'Books', slug: 'books' },
    }),
    prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: { name: 'Home & Garden', slug: 'home-garden' },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: { name: 'Sports', slug: 'sports' },
    }),
  ])

  const [electronics, clothing, books, homeGarden, sports] = categories
  console.log('Created categories:', categories.map((c) => c.name).join(', '))

  // Admin user
  const adminHash = await bcrypt.hash('Admin1234', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@realmarket.com' },
    update: {},
    create: {
      email: 'admin@realmarket.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      name: 'Admin',
    },
  })
  console.log('Created admin user:', admin.email)

  // Seller user
  const sellerHash = await bcrypt.hash('Seller1234', 10)
  const seller = await prisma.user.upsert({
    where: { email: 'seller@realmarket.com' },
    update: {},
    create: {
      email: 'seller@realmarket.com',
      passwordHash: sellerHash,
      role: 'SELLER',
      name: 'John Smith',
    },
  })
  console.log('Created seller user:', seller.email)

  // Products
  const productsData = [
    {
      title: 'Wireless Noise-Cancelling Headphones',
      description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
      price: 299.99,
      stock: 25,
      categoryId: electronics.id,
    },
    {
      title: 'Mechanical Keyboard',
      description: 'Compact TKL mechanical keyboard with Cherry MX switches, RGB backlighting, and aluminum frame.',
      price: 149.99,
      stock: 40,
      categoryId: electronics.id,
    },
    {
      title: 'Running Sneakers',
      description: 'Lightweight and breathable running shoes with responsive foam cushioning. Available in multiple sizes.',
      price: 89.99,
      stock: 50,
      categoryId: clothing.id,
    },
    {
      title: 'Classic Denim Jacket',
      description: 'Timeless denim jacket with a relaxed fit, chest pockets, and durable stitching. Unisex design.',
      price: 59.99,
      stock: 30,
      categoryId: clothing.id,
    },
    {
      title: 'Clean Code by Robert C. Martin',
      description: 'A handbook of agile software craftsmanship. Essential reading for every software developer.',
      price: 34.99,
      stock: 20,
      categoryId: books.id,
    },
    {
      title: 'The Pragmatic Programmer',
      description: 'From journeyman to master — a timeless guide to software craftsmanship and engineering excellence.',
      price: 39.99,
      stock: 15,
      categoryId: books.id,
    },
    {
      title: 'Indoor Plant Collection (Set of 3)',
      description: 'Curated set of low-maintenance indoor plants including pothos, snake plant, and peace lily. Perfect for home offices.',
      price: 49.99,
      stock: 10,
      categoryId: homeGarden.id,
    },
    {
      title: 'Adjustable Dumbbell Set',
      description: 'Space-saving adjustable dumbbell set ranging from 5 to 52.5 lbs. Ideal for home workouts.',
      price: 349.99,
      stock: 8,
      categoryId: sports.id,
    },
  ]

  for (const productData of productsData) {
    await prisma.product.create({
      data: {
        ...productData,
        price: productData.price,
        images: [],
        sellerId: seller.id,
      },
    })
  }

  console.log(`Created ${productsData.length} products`)
  console.log('Seeding complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
