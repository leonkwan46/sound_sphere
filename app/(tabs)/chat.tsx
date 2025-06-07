import { Screen } from '@/components/Screen'
import { useAuth } from '@/hooks/useAuth'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ParallaxScrollView from '../../components/ParallaxScrollView'
import { IconSymbol } from '../../components/Shared/Icons/IconSymbol'
import { db } from '../../config/firebase'

interface Message {
  id: string
  text: string
  userId: string
  userName: string
  userAvatar: string
  createdAt: Timestamp
  isGuest?: boolean
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const { user } = useAuth()
  const flatListRef = useRef<FlatList>(null)
  const [guestName, setGuestName] = useState('Guest-' + Math.floor(1000 + Math.random() * 9000))

  // Determine if current user is a guest (no email or anonymous auth)
  const isGuest = !user?.email || user.isAnonymous

  // Generate consistent avatar for current user
  const getUserAvatar = () => {
    if (user?.photoURL) return user.photoURL
    
    const nameForAvatar = user?.displayName || 
                         (user?.email ? user.email.split('@')[0] : guestName)
    
    return `https://ui-avatars.com/api/?name=${nameForAvatar}&background=random&color=fff`
  }

  // Load messages from Firestore
  useEffect(() => {
    if (!user) return
    
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    )
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = []
      querySnapshot.forEach((doc) => {
        messagesData.push({
          id: doc.id,
          ...doc.data() as Omit<Message, 'id'>
        })
      })
      setMessages(messagesData.reverse())
      
      // Scroll to bottom on new messages
      setTimeout(() => {
        if (flatListRef.current && messages.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true })
        }
      }, 100)
    })
    
    return unsubscribe
  }, [user])

  const sendMessage = async () => {
    if (!inputText.trim() || !user) return
    
    try {
      await addDoc(collection(db, 'messages'), {
        text: inputText.trim(),
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || guestName,
        userAvatar: getUserAvatar(),
        createdAt: serverTimestamp(),
        isGuest: isGuest
      })
      
      setInputText('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return ''
    
    const date = timestamp.toDate()
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`
    } else if (diffHrs < 24) {
      return `${diffHrs}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = user?.uid === item.userId
    
    return (
      <View style={[
        styles.messageRow, 
        isMyMessage ? styles.myMessageRow : styles.theirMessageRow
      ]}>
        {!isMyMessage && <Image source={{ uri: item.userAvatar }} style={styles.avatar} />}
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble
        ]}>
          {!isMyMessage && (
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{item.userName}</Text>
              {item.isGuest && <Text style={styles.guestBadge}>Guest</Text>}
            </View>
          )}
          <Text style={[
            styles.messageText, 
            isMyMessage ? styles.myMessageText : styles.theirMessageText
          ]}>{item.text}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
        </View>
        {isMyMessage && <Image source={{ uri: item.userAvatar }} style={styles.avatar} />}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: 'red', dark: 'blue' }}
        headerImage={
          <IconSymbol
            size={310}
            color="#808080"
            name="message.fill"
            style={styles.headerImage}
          />
        }
      >
        <Screen style={styles.screen}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Chat</Text>
            {isGuest && (
              <View style={styles.userStatusContainer}>
                <Text style={styles.guestLabel}>Chatting as: {guestName}</Text>
              </View>
            )}
          </View>
          
          {messages.length === 0 ? (
            <Text style={styles.empty}>No messages yet. Be the first to say hello!</Text>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messageList}
              onLayout={() => {
                if (flatListRef.current && messages.length > 0) {
                  flatListRef.current.scrollToEnd({ animated: false })
                }
              }}
            />
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <IconSymbol 
                name="paperplane.fill" 
                size={24} 
                color={inputText.trim() ? '#0084ff' : '#ccc'} 
              />
            </TouchableOpacity>
          </View>
        </Screen>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 16,
  },
  headerContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userStatusContainer: {
    marginTop: 4,
  },
  guestLabel: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  messageList: {
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#0084ff',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#e5e5ea',
    borderBottomLeftRadius: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  guestBadge: {
    fontSize: 10,
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 4,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
    color: '#888',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ececec',
    marginTop: 16,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}) 