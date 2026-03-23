import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function ClientesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seus Clientes</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.emptyState}>
        <Ionicons name="people-outline" size={48} color="#a0a0a0" />
        <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>+ Adicionar Cliente</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0d5cc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8b4d7a',
  },
  addButton: {
    backgroundColor: '#8b4d7a',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 16,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#8b4d7a',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
