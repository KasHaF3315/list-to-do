'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { loginSchema, LoginFormData } from '@/lib/validations'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onSwitchToSignup: () => void
  onGuestAccess: () => void
}

const LoginForm = ({ onSwitchToSignup, onGuestAccess }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, setLoading, isLoading } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Validate on change
  })

  // Preserve react-hook-form handlers when adding custom onChange
  const emailRegister = register('email')
  const passwordRegister = register('password')

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)

      const result = await api.auth.login({ email: data.email, password: data.password })
      const { user, token } = result
      login({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date(user.createdAt),
      }, token)

      toast.success('Welcome back!')
      router.push('/dashboard')

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
            <Input
              {...emailRegister}
              type="email"
              placeholder="Enter your email"
              className="pl-10"
              error={errors.email?.message}
              onChange={async (e) => {
                // forward change to RHF
                emailRegister.onChange(e)
                // Trigger validation after a short delay to check email format
                setTimeout(() => {
                  trigger('email')
                }, 300)
                // Immediately clear the "Email is required" message when user types
                clearErrors('email')
              }}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
            <Input
              {...passwordRegister}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="pl-10 pr-10"
              error={errors.password?.message}
              onChange={() => clearErrors('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-secondary-400 hover:text-secondary-600 touch-manipulation"
            >
              {showPassword ? <EyeOff size={18} className="sm:w-4 sm:h-4" /> : <Eye size={18} className="sm:w-4 sm:h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-secondary-600 dark:text-secondary-400">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300 dark:border-secondary-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-500">
                Or continue as
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={onGuestAccess}
            className="w-full"
          >
            Guest User
          </Button>
        </div>

                  <p className="text-center text-sm text-secondary-600 dark:text-secondary-400">
            Don&apos;t have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign up
            </button>
          </p>
      </Card>
    </motion.div>
  )
}

export default LoginForm
