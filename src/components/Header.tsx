import { CaretLeft } from 'phosphor-react-native'
import { useNavigation } from '@react-navigation/native'
import { Heading, IconButton, useTheme, StyledProps, HStack } from 'native-base'

interface IProps extends StyledProps {
  title: string
}

export function Header({ title, ...rest }: IProps) {
  const { colors } = useTheme()
  const { goBack } = useNavigation()

  const handleGoBack = () => {
    goBack()
  }

  return (
    <HStack
      pb={6}
      pt={12}
      w="full"
      bg="gray.600"
      alignItems="center"
      justifyContent="space-between"
      {...rest}
    >
      <IconButton
        onPress={handleGoBack}
        icon={<CaretLeft color={colors.gray[200]} size={24} />}
      />

      <Heading ml={-6} flex="1" fontSize="lg" color="white" textAlign="center">
        {title}
      </Heading>
    </HStack>
  )
}
