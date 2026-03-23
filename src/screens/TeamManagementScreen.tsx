import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CARGOS, generateTeamReport } from '../services/teamService'

interface TeamMember {
  id: number
  nome: string
  cargo: string
  email: string
  telefone: string
  comissaoPercentual: number
  totalAtendimentos: number
  totalFaturamento: number
  status: 'ativo' | 'inativo'
}

export default function TeamManagementScreen() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [newMember, setNewMember] = useState({
    nome: '',
    cargo: 'Esteticista',
    email: '',
    telefone: '',
  })

  const handleAddMember = () => {
    if (!newMember.nome || !newMember.email || !newMember.telefone) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios')
      return
    }

    const comissaoMap: Record<string, number> = {
      'Esteticista': 20,
      'Gerente': 5,
      'Recepcionista': 0,
      'Assistente': 10,
      'Coordenadora': 8,
    }

    const member: TeamMember = {
      id: Date.now(),
      nome: newMember.nome,
      cargo: newMember.cargo,
      email: newMember.email,
      telefone: newMember.telefone,
      comissaoPercentual: comissaoMap[newMember.cargo] || 0,
      totalAtendimentos: 0,
      totalFaturamento: 0,
      status: 'ativo',
    }

    setTeam([...team, member])
    setModalVisible(false)
    setNewMember({ nome: '', cargo: 'Esteticista', email: '', telefone: '' })
    Alert.alert('Sucesso', `${newMember.nome} adicionado à equipe!`)
  }

  const handleDeleteMember = (id: number) => {
    Alert.alert('Confirmar', 'Remover membro da equipe?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        onPress: () => setTeam(team.filter((m) => m.id !== id)),
        style: 'destructive',
      },
    ])
  }

  const generateReport = () => {
    const report = generateTeamReport(team)
    const filename = `relatorio_equipe_${Date.now()}.txt`

    // Em React Native, usar share
    if (Share) {
      Share.share({
        message: report,
        title: 'Relatório de Equipe',
      })
    }
  }

  const renderTeamMember = ({ item }: { item: TeamMember }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.nome}</Text>
          <Text style={styles.memberCargo}>{item.cargo}</Text>
          {item.comissaoPercentual > 0 && (
            <Text style={styles.memberCommission}>
              Comissão: {item.comissaoPercentual}%
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteMember(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>

      <View style={styles.memberStats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Atendimentos</Text>
          <Text style={styles.statValue}>{item.totalAtendimentos}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Faturamento</Text>
          <Text style={styles.statValue}>R$ {item.totalFaturamento.toFixed(2)}</Text>
        </View>
        <View
          style={[
            styles.stat,
            { alignItems: 'center', justifyContent: 'center' },
          ]}
        >
          <Text
            style={[
              styles.status,
              item.status === 'ativo' ? styles.statusAtivo : styles.statusInativo,
            ]}
          >
            {item.status === 'ativo' ? '✓ Ativo' : '✗ Inativo'}
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestão de Equipe</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {team.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#a0a0a0" />
            <Text style={styles.emptyText}>Nenhum membro na equipe</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsSection}>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>Total</Text>
                <Text style={styles.statCardValue}>{team.length}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>Ativos</Text>
                <Text style={styles.statCardValue}>
                  {team.filter((m) => m.status === 'ativo').length}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statCardLabel}>Faturamento</Text>
                <Text style={styles.statCardValue}>
                  R${' '}
                  {team
                    .reduce((sum, m) => sum + m.totalFaturamento, 0)
                    .toFixed(0)}
                </Text>
              </View>
            </View>

            <FlatList
              data={team}
              renderItem={renderTeamMember}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />

            <TouchableOpacity style={styles.reportButton} onPress={generateReport}>
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.reportButtonText}>Gerar Relatório</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Add Member Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Membro</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  value={newMember.nome}
                  onChangeText={(text) =>
                    setNewMember({ ...newMember, nome: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cargo*</Text>
                <View style={styles.cargoOptions}>
                  {CARGOS.map((cargo) => (
                    <TouchableOpacity
                      key={cargo}
                      style={[
                        styles.cargoButton,
                        newMember.cargo === cargo &&
                          styles.cargoButtonActive,
                      ]}
                      onPress={() =>
                        setNewMember({ ...newMember, cargo })
                      }
                    >
                      <Text
                        style={[
                          styles.cargoButtonText,
                          newMember.cargo === cargo &&
                            styles.cargoButtonTextActive,
                        ]}
                      >
                        {cargo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  value={newMember.email}
                  onChangeText={(text) =>
                    setNewMember({ ...newMember, email: text })
                  }
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(XX) XXXXX-XXXX"
                  value={newMember.telefone}
                  onChangeText={(text) =>
                    setNewMember({ ...newMember, telefone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddMember}
              >
                <Text style={styles.confirmButtonText}>Adicionar à Equipe</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  statsSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#8b4d7a',
  },
  statCardLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8b4d7a',
  },
  listContent: {
    paddingBottom: 20,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b4d7a',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  memberCargo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  memberCommission: {
    fontSize: 11,
    color: '#8b4d7a',
    fontWeight: '600',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  memberStats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusAtivo: {
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
  },
  statusInativo: {
    backgroundColor: '#ffcccc',
    color: '#c62828',
  },
  reportButton: {
    backgroundColor: '#8b4d7a',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8b4d7a',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b4d7a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4b5b5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  cargoOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cargoButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d4b5b5',
    backgroundColor: '#fff',
  },
  cargoButtonActive: {
    backgroundColor: '#8b4d7a',
    borderColor: '#8b4d7a',
  },
  cargoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  cargoButtonTextActive: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#8b4d7a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
