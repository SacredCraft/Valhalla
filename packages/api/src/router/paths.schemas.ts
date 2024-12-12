import { z } from 'zod'

export const pathsSchema = z
  .array(
    z.object({
      path: z.string().min(1, '路径不能为空'),
      name: z.string().min(1, '名称不能为空'),
    })
  )
  .superRefine((data, form) => {
    const names = data.map((item) => item.name)
    const paths = data.map((item) => item.path)

    if (new Set(names).size !== names.length) {
      form.addIssue({
        code: z.ZodIssueCode.custom,
        message: '名称不能重复',
        path: [],
      })
    }

    if (new Set(paths).size !== paths.length) {
      form.addIssue({
        code: z.ZodIssueCode.custom,
        message: '路径不能重复',
        path: [],
      })
    }
  })
