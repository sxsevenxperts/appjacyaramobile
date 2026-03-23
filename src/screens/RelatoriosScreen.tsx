import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../services/supabaseClient'
import { startOfMonth, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function RelatoriosScreen() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportStats()
  }, [])

  const fetchReportStats = async () => {
    try {
      setLoading(true)

      const monthStart = startOfMonth(new Date())
      const monthStartStr = format(monthStart, 'yyyy-MM-dd')

      // Get no-shows (faltas)
      const { data: failuresData } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('status', 'falta')
        .gte('data', monthStartStr)

      // Get reschedulings
      const { data: rescheduleData } = await supabase
        .from('remarcacoes')
        .select('*')
        .gte('data', monthStartStr)

      // Get procedures needing renewal (less than or equal to 3 sessions)
      const { data: packagesData } = await supabase
        .from('pacotes_cliente')
        .select('*')
        .lte('sessoes_utilizadas', 3)

      // Get all clients for total count
      const { data: clientsData, count: totalClients } = await supabase
        .from('clientes')
        .select('*', { count: 'exact' })
        .limit(1)

      setStats({
        faltas: failuresData?.length || 0,
        remarcacoes: rescheduleData?.length || 0,
        vencimentos: packagesData?.length || 0,
        totalClientes: totalClients || 0,
        procedimentosVencendo: packagesData || [],
      })
    } catch (error) {
      console.error('Error fetching report stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b4d7a" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#d32f2f20' }]}>
            <Ionicons name="person-remove" size={24} color="#d32f2f" />
          </View>
          <View style={styles.reportTitleContainer}>
            <Text style={styles.reportTitle}>Faltas</Text>
            <Text style={styles.reportSubtitle}>Este mês</Text>
          </View>
        </View>
        <View style={styles.reportContent}>
          <Text style={[styles.reportValue, { color: '#d32f2f' }]}>
            {stats?.faltas || 0}
          </Text>
          <Text style={styles.reportDetail}>
            {stats?.faltas === 0
              ? 'Nenhuma falta registrada'
              : `${stats?.faltas} cliente(s) com falta`}
          </Text>
        </View>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#ff980020' }]}>
            <Ionicons name="swap-horizontal" size={24} color="#ff9800" />
          </View>
          <View style={styles.reportTitleContainer}>
            <Text style={styles.reportTitle}>Remarcações</Text>
            <Text style={styles.reportSubtitle}>Este mês</Text>
          </View>
        </View>
        <View style={styles.reportContent}>
          <Text style={[styles.reportValue, { color: '#ff9800' }]}>
            {stats?.remarcacoes || 0}
          </Text>
          <Text style={styles.reportDetail}>
            {stats?.remarcacoes === 0
              ? 'Nenhuma remarcação'
              : `${stats?.remarcacoes} remarcação(ões)`}
          </Text>
        </View>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#2196f320' }]}>
            <Ionicons name="alert-circle" size={24} color="#2196f3" />
          </View>
          <View style={styles.reportTitleContainer}>
            <Text style={styles.reportTitle}>Procedimentos Vencendo</Text>
            <Text style={styles.reportSubtitle}>≤ 3 sessões restantes</Text>
          </View>
        </View>
        <View style={styles.reportContent}>
          <Text style={[styles.reportValue, { color: '#2196f3' }]}>
            {stats?.vencimentos || 0}
          </Text>
          <Text style={styles.reportDetail}>
            {stats?.vencimentos === 0
              ? 'Todos os pacotes em dia'
              : `${stats?.vencimentos} cliente(s) a notificar`}
          </Text>
        </View>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#4caf5020' }]}>
            <Ionicons name="people" size={24} color="#4caf50" />
          </View>
          <View style={styles.reportTitleContainer}>
            <Text style={styles.reportTitle}>Total de Clientes</Text>
            <Text style={styles.reportSubtitle}>Cadastrados</Text>
          </View>
        </View>
        <View style={styles.reportContent}>
          <Text style={[styles.reportValue, { color: '#4caf50' }]}>
            {stats?.totalClientes || 0}
          </Text>
          <Text style={styles.reportDetail}>Clientes ativos na base</Text>
        </View>
      </View>

      {stats?.vencimentos > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clientes para Notificar</Text>
          {stats.procedimentosVencendo.slice(0, 5).map((item: any, idx: number) => (
            <View key={idx} style={styles.notificationItem}>
              <View style={styles.notificationDot} />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationClient}>Cliente ID: {item.cliente_id}</Text>
                <Text style={styles.notificationDetails}>
                  Pacote: {item.procedimento} - Sessões: {item.sessoes_utilizadas}
                </Text>
              </View>
            </View>
          ))}
          {stats.procedimentosVencendo.length > 5 && (
            <Text style={styles.moreText}>
              +{stats.procedimentosVencendo.length - 5} mais
            </Text>
          )}
        </View>
      )}

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Exportar Relatório</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.refreshButton]}>
          <Ionicons name="refresh" size={20} color="#8b4d7a" />
          <Text style={[styles.actionButtonText, { color: '#8b4d7a' }]}>
            Atualizar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8e0',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8e8e0',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportTitleContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  reportSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  reportContent: {
    marginLeft: 62,
  },
  reportValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  reportDetail: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b4d7a',
    marginBottom: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff9800',
    marginRight: 12,
    marginTop: 6,
  },
  notificationContent: {
    flex: 1,
  },
  notificationClient: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  notificationDetails: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  moreText: {
    fontSize: 12,
    color: '#8b4d7a',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  actionSection: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#8b4d7a',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  refreshButton: {
    backgroundColor: '#f0f0f0',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
})
