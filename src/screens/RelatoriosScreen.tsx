import React from 'react'
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function RelatoriosScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Ionicons name="person-remove" size={24} color="#d32f2f" />
          <Text style={styles.reportTitle}>Faltas</Text>
        </View>
        <Text style={styles.reportValue}>0</Text>
        <Text style={styles.reportDetail}>Cliente com mais faltas: -</Text>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Ionicons name="swap-horizontal" size={24} color="#ff9800" />
          <Text style={styles.reportTitle}>Remarcações</Text>
        </View>
        <Text style={styles.reportValue}>0</Text>
        <Text style={styles.reportDetail}>Motivo mais comum: -</Text>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <Ionicons name="alert-circle" size={24} color="#2196f3" />
          <Text style={styles.reportTitle}>Procedimentos Vencendo</Text>
        </View>
        <Text style={styles.reportValue}>0</Text>
        <Text style={styles.reportDetail}>Clientes a notificar: -</Text>
      </View>

      <TouchableOpacity style={styles.detailedButton}>
        <Text style={styles.detailedButtonText}>Ver Relatório Detalhado</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8e0',
    padding: 20,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  reportValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8b4d7a',
    marginBottom: 8,
  },
  reportDetail: {
    fontSize: 12,
    color: '#999',
  },
  detailedButton: {
    backgroundColor: '#8b4d7a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  detailedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
