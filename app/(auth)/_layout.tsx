import { useAuth } from '@/hooks/useAuth'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function AuthLayout() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // Debug
  console.log('Auth Layout - Auth State:', { user: user?.email || null, loading })
  
  // Use an effect for navigation
  useEffect(() => {
    if (user && !loading) {
      // Navigate programmatically instead of using Redirect
      router.replace('../(tabs)')
    }
  }, [user, loading, router])
  
  // While loading, return nothing
  if (loading) return null
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
    </Stack>
  )
} 