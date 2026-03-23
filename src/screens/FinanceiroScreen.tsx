import React from 'react'
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function FinanceiroScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Faturamento Este Mês</Text>
        <Text style={styles.summaryValue}>R$ 0,00</Text>
      </View>

      <View style={styles.financialGrid}>
        <FinancialItem icon="trending-up" label="Receitas" value="R$ 0,00" color="#4caf50" />
        <FinancialItem icon="trending-down" label="Despesas" value="R$ 0,00" color="#d32f2f" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagamentos Recentes</Text>
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={40} color="#a0a0a0" />
          <Text style={styles.emptyText}>Nenhum pagamento registrado</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>+ Registrar Pagamento</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

function FinancialItem({ icon, label, value, color }: any) {
  return (
    <View style={styles.financialCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={[styles.itemValue, { color }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8e0',
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#8b4d7a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  financialGrid: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  financialCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
    marginBottom: 8,
  },
  itemLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8b4d7a',
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#8b4d7a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
