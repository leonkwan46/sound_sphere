import { auth } from '@/config/firebase'
import { useRouter } from 'expo-router'
import { signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      // Firebase authentication
      await signInWithEmailAndPassword(auth, email, password)
      // No need to redirect - auth change will trigger redirect automatically
    } catch (err) {
      setError((err as Error).message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = async () => {
    try {
      setLoading(true)
      setError('')
      await signInAnonymously(auth)
      // Auth change will trigger redirect
    } catch (err) {
      setError((err as Error).message || 'Failed to login as guest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput 
        placeholder="Email" 
        style={styles.input} 
        onChangeText={setEmail} 
        value={email} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <View style={styles.separator} />
      <Button 
        title="Continue as Guest" 
        onPress={handleGuestLogin} 
        disabled={loading} 
      />
      <View style={styles.registerContainer}>
        <Text>Don&apos;t have an account? </Text>
        <Text style={styles.link} onPress={() => router.push('/(auth)/register' as any)}>Register</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  separator: {
    height: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  }
}) 