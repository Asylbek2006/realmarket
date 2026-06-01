'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SelectRootProps } from '@base-ui/react/select'

const MAX_IMAGES = 5

type Category = {
  id: string
  name: string
}

type SelectChangeHandler = NonNullable<SelectRootProps<string>['onValueChange']>

export default function NewProductPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([''])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.categories ?? data))
      .catch(() => {})
  }, [])

  const handleImageChange = (index: number, value: string) => {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)))
  }

  const addImageField = () => {
    if (imageUrls.length < MAX_IMAGES) {
      setImageUrls((prev) => [...prev, ''])
    }
  }

  const removeImageField = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCategoryChange: SelectChangeHandler = (v) => {
    if (v !== null) setCategoryId(v)
  }

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const images = imageUrls.filter(Boolean)

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryId: categoryId || undefined,
        images,
      }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setError(data.error ?? 'Failed to create listing')
          return
        }
        toast.success('Listing created!')
        router.push('/sell')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.push('/sell')}
          className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          &larr; Back to my listings
        </button>
        <h1 className="text-3xl font-bold mt-3">New Listing</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sony WH-1000XM5 Headphones"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item in detail..."
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category (optional)" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Image URLs (max {MAX_IMAGES})</Label>

          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`https://example.com/image-${index + 1}.jpg`}
              />
              {imageUrls.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImageField(index)}
                  className="shrink-0"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

          {imageUrls.length < MAX_IMAGES && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImageField}
            >
              + Add image URL
            </Button>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create listing'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/sell')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
