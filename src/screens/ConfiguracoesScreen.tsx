import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Switch, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'

export default function ConfiguracoesScreen() {
  const { user, signOut } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfil</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.email}</Text>
            <Text style={styles.profileEmail}>Usuário</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <SettingItem
          icon="bell"
          label="Notificações Push"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          isSwitch
        />
        <SettingItem
          icon="clock"
          label="Lembretes Automáticos"
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          isSwitch
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aplicativo</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle" size={20} color="#8b4d7a" />
            <Text style={styles.settingLabel}>Versão do App</Text>
          </View>
          <Text style={styles.settingValue}>1.0.0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={20} color="#8b4d7a" />
            <Text style={styles.settingLabel}>Ajuda</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#a0a0a0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="document-text" size={20} color="#8b4d7a" />
            <Text style={styles.settingLabel}>Termos de Uso</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#a0a0a0" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#d32f2f" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>© 2024 Clínica Estética Jacyara Ponte</Text>
    </ScrollView>
  )
}

function SettingItem({ icon, label, value, onValueChange, isSwitch = false }: any) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color="#8b4d7a" />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {isSwitch ? (
        <Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#e0d5cc', true: '#8b4d7a' }} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#a0a0a0" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8e0',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0d5cc',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b4d7a',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8b4d7a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  profileEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderRadius: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d32f2f',
    marginLeft: 12,
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    paddingVertical: 20,
  },
})
