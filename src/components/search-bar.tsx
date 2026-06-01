'use client'

import { Suspense, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function SearchBar() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const currentSearch = searchParams.get('search') ?? ''

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const value = (form.elements.namedItem('search') as HTMLInputElement).value.trim()
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.delete('page')
    router.push('/products?' + params.toString())
  }

  function handleClear() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    params.delete('page')
    router.push('/products?' + params.toString())
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full max-w-lg">
      <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        name="search"
        defaultValue={currentSearch}
        placeholder="Search products..."
        className="pl-9 pr-8"
      />
      {currentSearch && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  )
}

export function SearchBarWrapper() {
  return (
    <Suspense
      fallback={
        <div className="relative flex items-center w-full max-w-lg">
          <Search className="absolute left-2.5 size-4 text-muted-foreground pointer-events-none" />
          <Input placeholder="Search products..." className="pl-9" disabled />
        </div>
      }
    >
      <SearchBar />
    </Suspense>
  )
}
