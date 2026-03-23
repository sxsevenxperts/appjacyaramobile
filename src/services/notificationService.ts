import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices')
    return
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Permission not granted for notifications')
    return
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId
    if (!projectId) {
      throw new Error('Project ID not found in app.json')
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId,
    })

    console.log('Push notification token:', token.data)
    return token.data
  } catch (error) {
    console.error('Failed to get push token:', error)
  }
}

export const sendLocalNotification = async (
  title: string,
  body: string,
  delay: number = 0,
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      badge: 1,
    },
    trigger: {
      seconds: delay,
    },
  })
}

export const scheduleAppointmentReminder = async (
  appointmentTitle: string,
  minutesBefore: number,
  appointmentTime: Date,
) => {
  const triggerTime = new Date(appointmentTime.getTime() - minutesBefore * 60000)
  const now = new Date()

  if (triggerTime <= now) {
    return
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Lembrete de Agendamento',
      body: `${appointmentTitle} em ${minutesBefore} minutos`,
      sound: true,
      badge: 1,
    },
    trigger: triggerTime,
  })
}

export const addNotificationListener = (callback: (notification: Notifications.Notification) => void) => {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    callback(response.notification)
  })
}
