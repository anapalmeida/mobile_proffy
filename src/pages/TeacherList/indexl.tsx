import React, { useState } from 'react'
import { View, ScrollView, Text, TextInput } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Feather } from '@expo/vector-icons'
import PageHeader from '../../components/PageHeader'
import TeacherItem, { Teacher } from '../../components/TeacherItem'
import { BorderlessButton, RectButton } from 'react-native-gesture-handler'
import api from '../../services/api'

import styles from './styles'

function TeacherList() {

  const [isFiltersVisible, setisFiltersVisible] = useState(false)

  const [favorites, setFavorites] = useState<number[]>([])

  const [teachers, setTeachers] = useState([])
  const [subject, setSubject] = useState('')
  const [week_day, setWeekDay] = useState('')
  const [time, setTime] = useState('')

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(res => {
      if (res) {
        const favoritedTeacher = JSON.parse(res)
        const favoritedTeacherIds = favoritedTeacher.map((teacher: Teacher) => {
          return teacher.id
        })

        setFavorites(favoritedTeacherIds)
      }
    })
  }

  async function handleFiltersSubmit() {

    loadFavorites()

    const res = await api.get('classes', {
      params: {
        subject,
        week_day,
        time
      }
    })
    setisFiltersVisible(false)
    setTeachers(res.data)

  }

  function handleToggleFiltersVisibility() {
    setisFiltersVisible(!isFiltersVisible)
  }

  return (
    <View style={styles.container}>

      <PageHeader
        title='Proffys disponíveis'
        headerRight={(
          <BorderlessButton onPress={handleToggleFiltersVisibility}>
            <Feather color='#fff' name='filter' size={20} />
          </BorderlessButton>
        )}
      >


        {isFiltersVisible && (
          <View style={styles.searchForm}>

            <Text style={styles.label}>Matéria</Text>
            <TextInput
              value={subject}
              onChangeText={text => setSubject(text)}
              style={styles.input}
              placeholder='Ex: História'
              placeholderTextColor='#c1bccc'
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>

                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={text => setWeekDay(text)}
                  placeholder='Ex: Terça-feira'
                  placeholderTextColor='#c1bccc'
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={text => setTime(text)}
                  placeholder='Ex: 7:00'
                  placeholderTextColor='#c1bccc'
                />
              </View>
            </View>

            <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
              <Text style={styles.subitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}

      </PageHeader>

      <ScrollView
        style={styles.teachersList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24
        }}
      >

        {teachers.map((teacher: Teacher) => {
          return (
            <TeacherItem
              key={teacher.id}
              teacher={teacher}
              favorited={favorites.includes(teacher.id)}
            />
          )
        })}

      </ScrollView>
    </View >
  )
}

export default TeacherList