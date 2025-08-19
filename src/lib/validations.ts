import { z } from 'zod'

// =====================
// 🔐 Auth Validation
// =====================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),

  rememberMe: z.boolean().optional(),
})

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(50, 'Name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
      .refine((val) => val.trim().length >= 2, {
        message: 'Name must contain at least 2 non-space characters',
      }),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(
        (val) =>
          /[A-Z]/.test(val) &&
          /[a-z]/.test(val) &&
          /\d/.test(val) &&
          /[@$!%*?&]/.test(val),
        {
          message:
            'Password must include uppercase, lowercase, number, and special character',
        }
      ),

    confirmPassword: z.string(),

    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must agree to the terms and conditions',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// =====================
// 📝 Todo Validation
// =====================

export const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),

  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  priority: z.enum(['low', 'medium', 'high']),

  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),

  dueDate: z.date().optional(),

  tags: z.array(z.string()).default([]),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type TodoFormData = z.infer<typeof todoSchema>
