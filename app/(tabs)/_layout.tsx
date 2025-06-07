import { Tabs, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'

import { IconSymbol } from '@/components/Shared/Icons/IconSymbol'
import { HapticTab } from '@/components/TabBar/HapticTab'
import TabBarBackground from '@/components/TabBar/TabBarBackground'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/hooks/useAuth'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // Debug
  console.log('Tabs Layout - Auth State:', { user: user?.email || null, loading })
  
  // Use an effect for navigation protection
  useEffect(() => {
    if (!loading && !user) {
      // Navigate programmatically instead of using Redirect
      router.replace('../(auth)')
    }
  }, [user, loading, router])
  
  // While loading or not authenticated, return nothing
  if (loading || !user) return null
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name='notification'
        options={{
          title: 'Notification',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='bell.fill' color={color} />
        }}
      />
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='house.fill' color={color} />,
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='message.fill' color={color} />,
        }}
      />
      <Tabs.Screen
        name='setting'
        options={{
          title: 'Setting',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='gear' color={color} />,
        }}
      />
    </Tabs>
  )
}
