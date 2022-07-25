import { useState } from 'react'
import { Toast, VStack } from 'native-base'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'

import { Input } from '../components/Input'
import { Header } from '../components/Header'
import { Button } from '../components/Button'

export function Register() {
  const { goBack } = useNavigation()
  const [patrimony, setPatrimony] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [description, setDescription] = useState('')

  const handleNewOrderRegister = async () => {
    if (!patrimony || !description) {
      Toast.show({
        description: 'Preencha todos os campos',
        duration: 1500
      })
      return
    }

    setIsLoading(true)
    try {
      await firestore().collection('orders').add({
        patrimony,
        description,
        status: 'open',
        createdAt: firestore.FieldValue.serverTimestamp()
      })

      Toast.show({
        description: 'Solicitação registrada com sucesso',
        duration: 1500
      })

      goBack()
    } catch (error) {
      Toast.show({
        description: 'Erro ao cadastrar, tente novamente.',
        duration: 1500
      })
      setIsLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <VStack bg="gray.600" p={6} flex={1}>
        <Header title="Solicitação" />

        <Input
          mt={4}
          value={patrimony}
          keyboardType="numeric"
          onChangeText={setPatrimony}
          placeholder="Número do patrimônio"
        />
        <Input
          mt={5}
          flex={1}
          multiline
          value={description}
          textAlignVertical="top"
          onChangeText={setDescription}
          placeholder="Descrição do problema"
        />

        <Button
          mt={5}
          title="Cadastrar"
          isLoading={isLoading}
          onPress={handleNewOrderRegister}
        />
      </VStack>
    </TouchableWithoutFeedback>
  )
}
