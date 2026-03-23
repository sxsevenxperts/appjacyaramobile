import React, { useState } from 'react'
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function AgendamentosScreen() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day')

  return (
    <View style={styles.container}>
      <View style={styles.viewSelector}>
        <TouchableOpacity
          style={[styles.viewButton, view === 'day' && styles.viewButtonActive]}
          onPress={() => setView('day')}
        >
          <Text style={[styles.viewButtonText, view === 'day' && styles.viewButtonTextActive]}>
            Dia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, view === 'week' && styles.viewButtonActive]}
          onPress={() => setView('week')}
        >
          <Text style={[styles.viewButtonText, view === 'week' && styles.viewButtonTextActive]}>
            Semana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, view === 'month' && styles.viewButtonActive]}
          onPress={() => setView('month')}
        >
          <Text style={[styles.viewButtonText, view === 'month' && styles.viewButtonTextActive]}>
            Mês
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#a0a0a0" />
          <Text style={styles.emptyText}>
            Nenhum agendamento para este período
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Adicionar Agendamento</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8e0',
  },
  viewSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0d5cc',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  viewButtonActive: {
    backgroundColor: '#8b4d7a',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0a0a0',
  },
  viewButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#8b4d7a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
