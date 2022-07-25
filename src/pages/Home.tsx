import { useEffect, useRef, useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native'
import { SignOut, ChatTeardropText } from 'phosphor-react-native'
import {
  Heading,
  HStack,
  IconButton,
  Text,
  useTheme,
  VStack,
  FlatList,
  Center,
  Toast,
  AlertDialog,
  Button as NativeBaseButton
} from 'native-base'

import { Filter } from '../components/Filter'
import { Button } from '../components/Button'
import Logo from '../assets/logo_secondary.svg'
import { Loading } from '../components/Loading'
import { IOrderProps, Order } from '../components/Order'
import { dateFormat } from '../utils/firestoreDateFormat'

export const Home = () => {
  const { colors } = useTheme()
  const cancelRef = useRef(null)
  const { navigate } = useNavigation()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteOrderId, setDeleteOrderId] = useState('')
  const [orders, setOrders] = useState<IOrderProps[]>([])
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>(
    'open'
  )

  const onClose = () => {
    setIsOpen(false)
    setDeleteOrderId('')
  }

  const handleOpenNewOrder = () => {
    navigate('Register')
  }

  const handleOpenDetails = (orderId: string) => {
    navigate('Details', {
      orderId
    })
  }

  const handleConfirmDeleteOrder = (orderId: string) => {
    setIsOpen(true)
    setDeleteOrderId(orderId)
  }

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) {
      return
    }

    setIsLoadingDelete(true)
    try {
      await firestore().collection('orders').doc(deleteOrderId).delete()

      Toast.show({
        description: 'Solicitação excluída com sucesso',
        duration: 1500
      })
    } catch (error) {
      Toast.show({
        description: 'Não foi possível excluir a solicitação, tente novamente.',
        duration: 1500
      })
    }
    setIsLoadingDelete(false)
    onClose()
  }

  const handleLogout = async () => {
    try {
      await auth().signOut()
    } catch (error) {
      Toast.show({
        description: 'Erro ao sair, tente novamente.',
        duration: 1500
      })
    }
  }

  useEffect(() => {
    setIsLoading(true)

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snap => {
        const data = snap.docs.map(doc => {
          const { patrimony, description, status, createdAt } = doc.data()

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(createdAt)
          }
        })

        setOrders(data)
        setIsLoading(false)
      })

    return subscriber
  }, [statusSelected])

  return (
    <>
      <VStack bg="gray.700" pb={6} flex={1}>
        <HStack
          pt={12}
          pb={5}
          px={6}
          w="full"
          bg="gray.600"
          alignItems="center"
          justifyContent="space-between"
        >
          <Logo />
          <IconButton
            onPress={handleLogout}
            icon={<SignOut size={26} color={colors.gray[300]} />}
          />
        </HStack>

        <VStack flex={1} px={6}>
          <HStack
            mt={8}
            mb={4}
            w="full"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading color="gray.100">Meus chamados</Heading>
            <Text color="gray.200">{orders.length}</Text>
          </HStack>

          <HStack space={3} mb={8}>
            <Filter
              type="open"
              title="em andamento"
              isActive={statusSelected === 'open'}
              onPress={() => setStatusSelected('open')}
            />
            <Filter
              type="closed"
              title="finalizados"
              isActive={statusSelected === 'closed'}
              onPress={() => setStatusSelected('closed')}
            />
          </HStack>

          {isLoading ? (
            <Loading />
          ) : (
            <FlatList
              data={orders}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Center>
                  <ChatTeardropText color={colors.gray[300]} size={40} />
                  <Text
                    mt={6}
                    fontSize="xl"
                    color="gray.300"
                    textAlign="center"
                  >
                    Você ainda não possui{'\n'}
                    solicitações{' '}
                    {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                  </Text>
                </Center>
              )}
              renderItem={({ item }) => (
                <Order
                  data={item}
                  onPress={() => handleOpenDetails(item.id)}
                  onLongPress={() => handleConfirmDeleteOrder(item.id)}
                />
              )}
              contentContainerStyle={{
                paddingBottom: 40
              }}
            />
          )}

          <Button title="Nova solicitação" onPress={handleOpenNewOrder} />
        </VStack>
      </VStack>

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Excluir solicitação</AlertDialog.Header>

          <AlertDialog.Body>
            Tem certeza que deseja excluir esta solicitação? Essa ação não pode
            ser desfeita.
          </AlertDialog.Body>

          <AlertDialog.Footer>
            <NativeBaseButton
              ref={cancelRef}
              onPress={onClose}
              variant="unstyled"
            >
              Cancelar
            </NativeBaseButton>

            <NativeBaseButton
              colorScheme="danger"
              isLoading={isLoadingDelete}
              onPress={handleDeleteOrder}
            >
              Excluir
            </NativeBaseButton>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  )
}
