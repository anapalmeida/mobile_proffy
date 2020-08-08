import React, { useState } from 'react'
import { View, ScrollView, Text } from 'react-native'

import PageHeader from '../../components/PageHeader'

import TeacherItem, { Teacher } from '../../components/TeacherItem'
import AsyncStorage from '@react-native-community/async-storage'
import { useFocusEffect } from '@react-navigation/native'

import styles from './styles'

function Favorites() {

  const [favorites, setFavorites] = useState([])

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(res => {
      if (res) {
        const favoritedTeachers = JSON.parse(res)
        setFavorites(favoritedTeachers)
      }
    })
  }

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []))

  return (
    <View style={styles.container}>
      <PageHeader title='Meus Proffys favoritos' />


      <ScrollView
        style={styles.teachersList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24
        }}
      >
        {favorites.map((teacher: Teacher) => {
          return (<TeacherItem
            key={teacher.id}
            teacher={teacher}
            favorited={true}
          />
          )
        })}
      </ScrollView>
    </View>
  )
}

export default Favorites