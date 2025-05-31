import { Screen } from '@/components/Screen'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ParallaxScrollView from '../../components/ParallaxScrollView'
import { IconSymbol } from '../../components/Shared/Icons/IconSymbol'

// Mock data for notifications
const notifications = [
  {
    id: '1',
    user: 'alex',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'liked your photo',
    timestamp: '2h',
    preview: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=64&h=64',
  },
  {
    id: '2',
    user: 'jessica',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'started following you',
    timestamp: '3h',
    preview: null,
  },
  {
    id: '3',
    user: 'mike',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    text: 'commented: "Awesome!"',
    timestamp: '5h',
    preview: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=64&h=64',
  },
]

export default function NotificationScreen() {
  const renderItem = ({ item }: { item: typeof notifications[0] }) => (
    <TouchableOpacity style={styles.notificationRow} activeOpacity={0.7} key={item.id}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text>
          <Text style={styles.userText}>{item.user} </Text>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      {item.preview && (
        <Image source={{ uri: item.preview }} style={styles.preview} />
      )}
    </TouchableOpacity>
  )

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'red', dark: 'blue' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <Screen style={styles.screen}>
        <Text style={styles.header}>Notifications</Text>
        {notifications.length === 0 ? (
          <Text style={styles.empty}>No notifications yet.</Text>
        ) : (
          notifications.map(item => renderItem({ item }))
        )}
      </Screen>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  preview: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginLeft: 12,
    backgroundColor: '#eee',
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  userText: {
    fontWeight: '600',
  },
})
