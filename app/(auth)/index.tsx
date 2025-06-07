import { Redirect } from 'expo-router'

export default function AuthIndex() {
  // By default, redirect to login screen
  return <Redirect href="/login" />
} 