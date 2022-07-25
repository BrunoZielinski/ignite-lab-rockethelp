import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Box,
  HStack,
  ScrollView,
  Text,
  Toast,
  useTheme,
  VStack
} from 'native-base'
import {
  Hourglass,
  CircleWavyCheck,
  DesktopTower,
  Clipboard
} from 'phosphor-react-native'

import { Input } from '../components/Input'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Loading } from '../components/Loading'
import { IOrderProps } from '../components/Order'
import { CardDetails } from '../components/CardDetails'
import { dateFormat } from '../utils/firestoreDateFormat'
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO'

interface IRouteParams {
  orderId: string
}

interface IOrderDetails extends IOrderProps {
  closed: string
  solution: string
  description: string
}

export function Details() {
  const route = useRoute()
  const { colors } = useTheme()
  const { goBack } = useNavigation()
  const { orderId } = route.params as IRouteParams

  const [solution, setSolution] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingClose, setIsLoadingClose] = useState(false)
  const [order, setOrder] = useState<IOrderDetails>({} as IOrderDetails)

  const statusColor =
    order.status === 'open' ? colors.secondary[700] : colors.green[300]

  const handleOrderClose = async () => {
    if (!solution) {
      Toast.show({
        description: 'Informe a solução para encerrar a solicitação.',
        duration: 1700
      })
      return
    }

    setIsLoadingClose(true)
    try {
      await firestore()
        .collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .update({
          solution,
          status: 'closed',
          closedAt: firestore.FieldValue.serverTimestamp()
        })

      Toast.show({
        description: 'Solicitação encerrada.',
        duration: 1500
      })

      goBack()
    } catch (error) {
      Toast.show({
        description:
          'Não foi possível encerrar a solicitação, tente novamente.',
        duration: 1500
      })
      setIsLoadingClose(false)
    }
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then(doc => {
        const {
          status,
          solution,
          closedAt,
          createdAt,
          patrimony,
          description
        } = doc.data()

        const closed = closedAt ? dateFormat(closedAt) : null

        setOrder({
          id: doc.id,
          closed,
          status,
          patrimony,
          solution,
          description,
          when: dateFormat(createdAt)
        })

        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack bg="gray.700" flex={1}>
      <Box px={6} bg="gray.600">
        <Header title="Solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === 'closed' ? (
          <CircleWavyCheck size={22} color={statusColor} />
        ) : (
          <Hourglass size={22} color={statusColor} />
        )}

        <Text
          ml={2}
          fontSize="sm"
          color={statusColor}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Equipamento"
          icon={DesktopTower}
          footer={order.when}
          description={`Patrimônio ${order.patrimony}`}
        />

        <CardDetails
          icon={Clipboard}
          title="Descrição do problema"
          description={`${order.description}`}
        />

        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          <Input
            h={24}
            multiline
            textAlignVertical="top"
            onChangeText={setSolution}
            placeholder="Descrição da solução"
            editable={order.status === 'open'}
            value={order.status === 'open' ? solution : order.solution}
          />
        </CardDetails>
      </ScrollView>

      {order.status === 'open' && (
        <Button
          m={5}
          isLoading={isLoadingClose}
          onPress={handleOrderClose}
          title="Encerrar solicitação"
        />
      )}
    </VStack>
  )
}
