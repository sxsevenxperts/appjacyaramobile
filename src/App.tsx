import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthNavigator } from './navigation/AuthNavigator'
import { MainNavigator } from './navigation/MainNavigator'
import { registerForPushNotificationsAsync } from './services/notificationService'
import { ActivityIndicator, View } from 'react-native'

function RootNavigator() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8e8e0' }}>
        <ActivityIndicator size="large" color="#8b4d7a" />
      </View>
    )
  }

  return session ? <MainNavigator /> : <AuthNavigator />
}

function AppContent() {
  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync()
  }, [])

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  )
}
