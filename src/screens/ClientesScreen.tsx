import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Image,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '../services/supabaseClient'

export default function ClientesScreen() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [newClient, setNewClient] = useState({
    nome: '',
    email: '',
    telefone: '',
    procedimentos: '',
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome', { ascending: true })

      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async () => {
    if (!newClient.nome) {
      Alert.alert('Erro', 'Nome do cliente é obrigatório')
      return
    }

    try {
      const { error } = await supabase.from('clientes').insert([
        {
          nome: newClient.nome,
          email: newClient.email,
          telefone: newClient.telefone,
        },
      ])

      if (error) throw error

      Alert.alert('Sucesso', 'Cliente adicionado com sucesso!')
      setModalVisible(false)
      setNewClient({ nome: '', email: '', telefone: '', procedimentos: '' })
      fetchClients()
    } catch (error) {
      console.error('Error adding client:', error)
      Alert.alert('Erro', 'Não foi possível adicionar o cliente')
    }
  }

  const pickImage = async (clientId: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        // TODO: Upload image to Supabase Storage
        console.log('Image picked:', result.assets[0])
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  const renderClientCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.clientCard}
      onPress={() => {
        setSelectedClient(item)
      }}
    >
      <View style={styles.clientAvatar}>
        <Ionicons name="person-circle" size={48} color="#8b4d7a" />
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName}>{item.nome}</Text>
        <Text style={styles.clientPhone}>{item.telefone || 'Sem telefone'}</Text>
        <Text style={styles.clientEmail}>{item.email || 'Sem email'}</Text>
      </View>
      <TouchableOpacity style={styles.clientMore}>
        <Ionicons name="chevron-forward" size={20} color="#a0a0a0" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seus Clientes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setNewClient({ nome: '', email: '', telefone: '', procedimentos: '' })
            setModalVisible(true)
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8b4d7a" style={styles.loader} />
      ) : clients.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color="#a0a0a0" />
          <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setNewClient({ nome: '', email: '', telefone: '', procedimentos: '' })
              setModalVisible(true)
            }}
          >
            <Text style={styles.actionButtonText}>+ Adicionar Cliente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={clients}
          renderItem={renderClientCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {/* Add Client Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Cliente</Text>
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
                  value={newClient.nome}
                  onChangeText={(text) =>
                    setNewClient({ ...newClient, nome: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  value={newClient.email}
                  onChangeText={(text) =>
                    setNewClient({ ...newClient, email: text })
                  }
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(XX) XXXXX-XXXX"
                  value={newClient.telefone}
                  onChangeText={(text) =>
                    setNewClient({ ...newClient, telefone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddClient}
              >
                <Text style={styles.confirmButtonText}>Adicionar Cliente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Client Details Modal */}
      <Modal visible={selectedClient !== null} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Cliente</Text>
              <TouchableOpacity onPress={() => setSelectedClient(null)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedClient && (
              <View style={styles.modalContent}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Nome</Text>
                  <Text style={styles.detailValue}>{selectedClient.nome}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Telefone</Text>
                  <Text style={styles.detailValue}>
                    {selectedClient.telefone || 'Não informado'}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>
                    {selectedClient.email || 'Não informado'}
                  </Text>
                </View>

                <View style={styles.photoSection}>
                  <Text style={styles.detailLabel}>Fotos Antes/Depois</Text>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={() => pickImage(selectedClient.id)}
                  >
                    <Ionicons name="image" size={20} color="#8b4d7a" />
                    <Text style={styles.photoButtonText}>Adicionar Foto</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            )}
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
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  clientCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  clientAvatar: {
    marginRight: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  clientPhone: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  clientEmail: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  clientMore: {
    padding: 8,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
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
    maxHeight: '90%',
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
  detailSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0d5cc',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b4d7a',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  photoSection: {
    marginBottom: 20,
  },
  photoButton: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d4b5b5',
    marginTop: 8,
  },
  photoButtonText: {
    marginLeft: 8,
    color: '#8b4d7a',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
  },
})
