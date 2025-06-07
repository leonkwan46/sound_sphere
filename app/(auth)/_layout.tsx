import { useAuth } from '@/hooks/useAuth'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
  const { user, loading } = useAuth()
  
  // While loading, return nothing
  if (loading) return null
  
  // If user is already authenticated, redirect to app
  if (user) {
    return <Redirect href="/(tabs)" />
  }
  
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
    </Stack>
  )
} 