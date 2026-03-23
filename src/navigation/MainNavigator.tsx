import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

// Screens
import DashboardScreen from '../screens/DashboardScreen'
import AgendamentosScreen from '../screens/AgendamentosScreen'
import ClientesScreen from '../screens/ClientesScreen'
import RelatoriosScreen from '../screens/RelatoriosScreen'
import FinanceiroScreen from '../screens/FinanceiroScreen'
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const DashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: '#8b4d7a',
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: 'Clínica Estética Jacyara Ponte' }}
    />
  </Stack.Navigator>
)

const AgendamentosStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: '#8b4d7a',
    }}
  >
    <Stack.Screen
      name="Agendamentos"
      component={AgendamentosScreen}
      options={{ title: 'Agendamentos' }}
    />
  </Stack.Navigator>
)

const ClientesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: '#8b4d7a',
    }}
  >
    <Stack.Screen
      name="Clientes"
      component={ClientesScreen}
      options={{ title: 'Clientes' }}
    />
  </Stack.Navigator>
)

const RelatoriosStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: '#8b4d7a',
    }}
  >
    <Stack.Screen
      name="Relatorios"
      component={RelatoriosScreen}
      options={{ title: 'Relatórios' }}
    />
  </Stack.Navigator>
)

const FinanceiroStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: '#8b4d7a',
    }}
  >
    <Stack.Screen
      name="Financeiro"
      component={FinanceiroScreen}
      options={{ title: 'Financeiro' }}
    />
  </Stack.Navigator>
)

const ConfiguracoesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: '#8b4d7a',
    }}
  >
    <Stack.Screen
      name="Configuracoes"
      component={ConfiguracoesScreen}
      options={{ title: 'Configurações' }}
    />
  </Stack.Navigator>
)

export const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = 'home'

        if (route.name === 'DashboardStack') {
          iconName = focused ? 'home' : 'home-outline'
        } else if (route.name === 'AgendamentosStack') {
          iconName = focused ? 'calendar' : 'calendar-outline'
        } else if (route.name === 'ClientesStack') {
          iconName = focused ? 'people' : 'people-outline'
        } else if (route.name === 'RelatoriosStack') {
          iconName = focused ? 'bar-chart' : 'bar-chart-outline'
        } else if (route.name === 'FinanceiroStack') {
          iconName = focused ? 'cash' : 'cash-outline'
        } else if (route.name === 'ConfiguracoesStack') {
          iconName = focused ? 'settings' : 'settings-outline'
        }

        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: '#8b4d7a',
      tabBarInactiveTintColor: '#a0a0a0',
      tabBarStyle: styles.tabBar,
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="DashboardStack"
      component={DashboardStack}
      options={{ tabBarLabel: 'Início' }}
    />
    <Tab.Screen
      name="AgendamentosStack"
      component={AgendamentosStack}
      options={{ tabBarLabel: 'Agenda' }}
    />
    <Tab.Screen
      name="ClientesStack"
      component={ClientesStack}
      options={{ tabBarLabel: 'Clientes' }}
    />
    <Tab.Screen
      name="RelatoriosStack"
      component={RelatoriosStack}
      options={{ tabBarLabel: 'Relatórios' }}
    />
    <Tab.Screen
      name="FinanceiroStack"
      component={FinanceiroStack}
      options={{ tabBarLabel: 'Financeiro' }}
    />
    <Tab.Screen
      name="ConfiguracoesStack"
      component={ConfiguracoesStack}
      options={{ tabBarLabel: 'Config' }}
    />
  </Tab.Navigator>
)

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f8e8e0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0d5cc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b4d7a',
  },
  tabBar: {
    backgroundColor: '#f8e8e0',
    borderTopColor: '#e0d5cc',
    borderTopWidth: 1,
    paddingBottom: 5,
    height: 65,
  },
})
