import { z, ZodArray, ZodObject, ZodString } from "zod"

export const FormSchema = z.object({
  tone: z.array(z.string()),
  material_type: z.array(z.string()),
  language: z.array(z.string()),
  source_type: z.array(z.string()),
  sources: z.array(z.string()),
  tags: z.array(z.string()),
  author_type: z.array(z.string()),
  author_age: z.array(z.array(z.number())),
  author_gender: z.array(z.string()),
  author_subscriber_count: z.array(z.number()),
})

export type FormValues = z.infer<typeof FormSchema>
