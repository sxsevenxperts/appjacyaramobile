import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import { supabase } from '../services/supabaseClient'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DashboardScreen() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Get today's appointments
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data: todayAppointments } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('data', today)

      // Get total clients
      const { data: clients, count: totalClients } = await supabase
        .from('clientes')
        .select('*', { count: 'exact' })
        .limit(1)

      // Get total revenue this month
      const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
      const { data: monthlyPayments } = await supabase
        .from('pagamentos')
        .select('valor')
        .gte('data', monthStart)

      const totalRevenue = monthlyPayments?.reduce((sum, p) => sum + (p.valor || 0), 0) || 0

      setStats({
        todayAppointments: todayAppointments?.length || 0,
        totalClients: totalClients || 0,
        totalRevenue,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchStats()
    setRefreshing(false)
  }

  if (loading && !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b4d7a" />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Bem-vinda ao Painel!</Text>
        <Text style={styles.date}>
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="calendar"
          title="Agendamentos Hoje"
          value={stats?.todayAppointments || 0}
          color="#8b4d7a"
        />
        <StatCard
          icon="people"
          title="Clientes Cadastrados"
          value={stats?.totalClients || 0}
          color="#c77daa"
        />
        <StatCard
          icon="cash"
          title="Faturamento do Mês"
          value={`R$ ${(stats?.totalRevenue || 0).toFixed(2)}`}
          color="#a0758a"
          isMonetary
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle" size={24} color="#8b4d7a" />
          <Text style={styles.actionText}>Novo Agendamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="person-add" size={24} color="#8b4d7a" />
          <Text style={styles.actionText}>Novo Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="receipt" size={24} color="#8b4d7a" />
          <Text style={styles.actionText}>Registrar Pagamento</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Última atualização: {format(new Date(), 'HH:mm')}</Text>
      </View>
    </ScrollView>
  )
}

function StatCard({ icon, title, value, color, isMonetary = false }: any) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={[styles.statValue, { color }]}>
          {isMonetary ? value : `${value}`}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8e0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8e8e0',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8b4d7a',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#a0758a',
  },
  statsGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8b4d7a',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
})
