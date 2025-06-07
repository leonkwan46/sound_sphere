import { auth } from '@/config/firebase'
import { useRouter } from 'expo-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      // Firebase authentication
      await createUserWithEmailAndPassword(auth, email, password)
      // No need to redirect - auth change will trigger redirect automatically
    } catch (err) {
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <Button title={loading ? "Signing up..." : "Sign Up"} onPress={handleRegister} disabled={loading} />
      <View style={styles.loginContainer}>
        <Text>Already have an account? </Text>
        <Text style={styles.link} onPress={() => router.push("/(auth)/login")}>Login</Text>
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
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  }
}) 