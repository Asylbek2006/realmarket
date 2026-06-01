import Link from 'next/link'

const categories = [
  { label: 'Electronics', emoji: '💻', slug: 'electronics' },
  { label: 'Clothing', emoji: '👕', slug: 'clothing' },
  { label: 'Books', emoji: '📚', slug: 'books' },
  { label: 'Home', emoji: '🏠', slug: 'home' },
  { label: 'Sports', emoji: '🏃', slug: 'sports' },
  { label: 'Other', emoji: '📦', slug: 'other' },
]

const howItWorks = [
  {
    title: 'Find',
    description: 'Browse millions of listings from verified sellers across every category.',
  },
  {
    title: 'Connect',
    description: 'Message sellers directly, ask questions, and negotiate pricing with ease.',
  },
  {
    title: 'Buy',
    description: 'Checkout securely and get your items delivered fast with buyer protection.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-zinc-950 text-white py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-zinc-400 uppercase text-xs tracking-widest mb-4">
            The modern marketplace
          </p>
          <h1 className="text-5xl font-bold mb-4">Buy and sell anything</h1>
          <p className="text-zinc-400 text-lg mt-4 mb-10">
            Millions of listings from verified sellers
          </p>

          {/* Hero Search */}
          <form
            action="/products"
            method="GET"
            className="flex items-center bg-white rounded-full overflow-hidden max-w-xl mx-auto mb-8"
          >
            <input
              type="text"
              name="search"
              placeholder="What are you looking for?"
              className="flex-1 px-6 py-3 text-zinc-900 outline-none bg-transparent text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-r-full hover:bg-zinc-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/products"
              className="border border-white rounded-full px-6 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Browse listings
            </Link>
            <Link
              href="/sell"
              className="bg-white text-zinc-900 rounded-full px-6 py-2 text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Start selling
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="border rounded-xl p-6 text-center hover:border-zinc-400 transition-colors"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="text-sm font-medium">{cat.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-zinc-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            How RealMarket works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.title} className="text-center">
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
