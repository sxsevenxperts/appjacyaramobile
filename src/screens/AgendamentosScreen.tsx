import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '../services/supabaseClient'

export default function AgendamentosScreen() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('month')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [newAppointment, setNewAppointment] = useState({ cliente: '', procedimento: '', horario: '' })

  useEffect(() => {
    fetchAppointments()
  }, [selectedDate])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('data', dateStr)
        .order('hora', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async () => {
    if (!newAppointment.cliente || !newAppointment.procedimento || !newAppointment.horario) {
      return
    }

    try {
      const { error } = await supabase.from('agendamentos').insert([
        {
          data: format(selectedDate, 'yyyy-MM-dd'),
          hora: newAppointment.horario,
          cliente_id: 1, // TODO: get from cliente selection
          procedimento: newAppointment.procedimento,
          status: 'agendado',
        },
      ])

      if (error) throw error
      setModalVisible(false)
      setNewAppointment({ cliente: '', procedimento: '', horario: '' })
      fetchAppointments()
    } catch (error) {
      console.error('Error adding appointment:', error)
    }
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(selectedDate)
    const monthEnd = endOfMonth(selectedDate)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const weeks: any[] = []
    let week: any[] = []

    daysInMonth.forEach((day) => {
      const dayOfWeek = day.getDay()
      if (week.length === 0 && dayOfWeek !== 0) {
        for (let i = 0; i < dayOfWeek; i++) {
          week.push(null)
        }
      }

      week.push(day)

      if (dayOfWeek === 6) {
        weeks.push(week)
        week = []
      }
    })

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null)
      }
      weeks.push(week)
    }

    return (
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
            <Text key={day} style={styles.weekDayLabel}>
              {day}
            </Text>
          ))}
        </View>
        {weeks.map((week, idx) => (
          <View key={idx} style={styles.week}>
            {week.map((day, dayIdx) => (
              <TouchableOpacity
                key={dayIdx}
                style={[
                  styles.dayCell,
                  day && isSameDay(day, selectedDate) && styles.selectedDay,
                ]}
                onPress={() => day && setSelectedDate(day)}
              >
                {day ? (
                  <>
                    <Text
                      style={[
                        styles.dayNumber,
                        isSameDay(day, selectedDate) && styles.selectedDayText,
                      ]}
                    >
                      {format(day, 'd')}
                    </Text>
                  </>
                ) : (
                  <Text />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    )
  }

  const renderAppointmentsList = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#8b4d7a" style={styles.loader} />
    }

    if (appointments.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#a0a0a0" />
          <Text style={styles.emptyText}>
            Nenhum agendamento para {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
          </Text>
        </View>
      )
    }

    return (
      <FlatList
        data={appointments}
        keyExtractor={(item, idx) => idx.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentTime}>
              <Ionicons name="time" size={20} color="#8b4d7a" />
              <Text style={styles.timeText}>{item.hora}</Text>
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentClient}>{item.cliente_nome || 'Cliente'}</Text>
              <Text style={styles.appointmentService}>{item.procedimento}</Text>
              <Text style={styles.appointmentStatus}>{item.status}</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-vertical" size={20} color="#a0a0a0" />
            </TouchableOpacity>
          </View>
        )}
      />
    )
  }

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
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>
            <Ionicons name="chevron-back" size={24} color="#8b4d7a" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{format(selectedDate, 'MMMM yyyy', { locale: ptBR })}</Text>
          <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>
            <Ionicons name="chevron-forward" size={24} color="#8b4d7a" />
          </TouchableOpacity>
        </View>

        {view === 'month' && renderCalendar()}

        <View style={styles.appointmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Agendamentos para {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {renderAppointmentsList()}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Agendamento</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cliente</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome do cliente"
                  value={newAppointment.cliente}
                  onChangeText={(text) =>
                    setNewAppointment({ ...newAppointment, cliente: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Procedimento</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Procedimento"
                  value={newAppointment.procedimento}
                  onChangeText={(text) =>
                    setNewAppointment({ ...newAppointment, procedimento: text })
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={newAppointment.horario}
                  onChangeText={(text) =>
                    setNewAppointment({ ...newAppointment, horario: text })
                  }
                />
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddAppointment}
              >
                <Text style={styles.confirmButtonText}>Adicionar</Text>
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
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0d5cc',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8b4d7a',
    textTransform: 'capitalize',
  },
  calendar: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0d5cc',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#8b4d7a',
  },
  week: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  selectedDay: {
    backgroundColor: '#8b4d7a',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
  },
  appointmentsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8b4d7a',
  },
  addButton: {
    backgroundColor: '#8b4d7a',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#8b4d7a',
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    width: 60,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b4d7a',
    marginLeft: 4,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentClient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  appointmentService: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  appointmentStatus: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 16,
  },
  loader: {
    marginVertical: 40,
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
