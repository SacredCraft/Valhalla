import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, '用户名不能为空'),
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(8, '密码至少8位'),
  role: z.enum(['admin', 'user'], {
    required_error: '角色不能为空',
  }),
})

export const updateUserSchema = createUserSchema.partial().extend({
  image: z.instanceof(File).optional(),
  id: z.string(),
  password: z.string().min(8, '密码至少8位').or(z.literal('')).optional(),
})
