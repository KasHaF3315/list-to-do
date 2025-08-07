'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { signupSchema, SignupFormData } from '@/lib/validations'
import { useAuthStore } from '@/store/authStore'
import { getPasswordStrength } from '@/lib/utils'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'

interface SignupFormProps {
  onSwitchToLogin: () => void
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const { login, setLoading, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange', // Validate on change
  })

  const watchedPassword = watch('password', '')
  const passwordStrength = getPasswordStrength(watchedPassword)

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock successful signup
      const mockUser = {
        id: '1',
        email: data.email,
        name: data.name,
        createdAt: new Date(),
      }

      const mockToken = 'mock-jwt-token'

      login(mockUser, mockToken)
      toast.success('Account created successfully! Welcome!')

    } catch (error) {
      toast.error('Failed to create account. Please try again.')
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
            Create Account
          </h2>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Join us to start organizing your tasks
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
            <Input
              {...register('name')}
              type="text"
              placeholder="Enter your full name"
              className="pl-10"
              error={errors.name?.message}
              onChange={() => clearErrors('name')}
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className="pl-10"
              error={errors.email?.message}
              onChange={async (e) => {
                // Trigger validation after a short delay to check email format
                setTimeout(() => {
                  trigger('email')
                }, 300)
              }}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              className="pl-10 pr-10"
              error={errors.password?.message}
              onChange={(e) => {
                setPassword(e.target.value)
                clearErrors('password')
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 p-2 text-secondary-400 hover:text-secondary-600 touch-manipulation"
            >
              {showPassword ? <EyeOff size={18} className="sm:w-4 sm:h-4" /> : <Eye size={18} className="sm:w-4 sm:h-4" />}
            </button>
          </div>

          {watchedPassword && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600 dark:text-secondary-400">
                  Password strength:
                </span>
                <span className={`font-medium ${passwordStrength.score >= 4 ? 'text-green-600' :
                    passwordStrength.score >= 3 ? 'text-blue-600' :
                      passwordStrength.score >= 2 ? 'text-yellow-600' :
                        'text-red-600'
                  }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-secondary-400" />
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="pl-10 pr-10"
              error={errors.confirmPassword?.message}
              onChange={() => clearErrors('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-2 p-2 text-secondary-400 hover:text-secondary-600 touch-manipulation"
            >
              {showConfirmPassword ? <EyeOff size={18} className="sm:w-4 sm:h-4" /> : <Eye size={18} className="sm:w-4 sm:h-4" />}
            </button>
          </div>

          <div className="flex items-start">
            <input
              {...register('agreeToTerms')}
              type="checkbox"
              className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="ml-2 text-sm text-secondary-600 dark:text-secondary-400">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-sm text-error-600 dark:text-error-400">
              {errors.agreeToTerms.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-secondary-600 dark:text-secondary-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Sign in
          </button>
        </p>
      </Card>
    </motion.div>
  )
}

export default SignupForm
