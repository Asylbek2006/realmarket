import { z } from 'zod'
export const createProductSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  categoryId: z.string().uuid().optional(),
  images: z.array(z.string().url()).max(5).default([]),
})
export const updateProductSchema = createProductSchema.partial()
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
