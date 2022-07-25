import {
  Box,
  Circle,
  HStack,
  Text,
  useTheme,
  VStack,
  Pressable,
  IPressableProps
} from 'native-base'
import {
  ClockAfternoon,
  Hourglass,
  CircleWavyCheck
} from 'phosphor-react-native'

export interface IOrderProps {
  id: string
  when: string
  patrimony: string
  status: 'open' | 'closed'
}

interface IProps extends IPressableProps {
  data: IOrderProps
}

export function Order({ data, ...rest }: IProps) {
  const { colors } = useTheme()

  const statusColor =
    data.status === 'open' ? colors.secondary[700] : colors.green[300]

  return (
    <Pressable {...rest}>
      <HStack
        mb={4}
        rounded="sm"
        bg="gray.600"
        overflow="hidden"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box h="full" w={2} bg={statusColor} />

        <VStack flex={1} my={5} ml={5}>
          <Text color="white" fontSize="md">
            Patrimônio: {data?.patrimony}
          </Text>

          <HStack alignItems="center">
            <ClockAfternoon size={15} color={colors.gray[300]} />
            <Text color="gray.200" fontSize="xs" ml={1}>
              {data?.when}
            </Text>
          </HStack>
        </VStack>

        <Circle bg="gray.500" h={12} w={12} mr={5}>
          {data.status === 'closed' ? (
            <CircleWavyCheck size={24} color={statusColor} />
          ) : (
            <Hourglass size={24} color={statusColor} />
          )}
        </Circle>
      </HStack>
    </Pressable>
  )
}
