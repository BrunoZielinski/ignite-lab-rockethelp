import { useTheme, VStack, Button, IButtonProps, Text } from 'native-base'

interface IProps extends IButtonProps {
  title: string
  isActive?: boolean
  type: 'open' | 'closed'
}

export function Filter({ title, type, isActive = false, ...rest }: IProps) {
  const { colors } = useTheme()

  const colorType = type === 'open' ? colors.secondary[700] : colors.green[300]

  return (
    <Button
      flex={1}
      size="sm"
      bg="gray.600"
      variant="outline"
      borderColor={colorType}
      borderWidth={isActive ? 1 : 0}
      {...rest}
    >
      <Text
        color={isActive ? colorType : 'gray.300'}
        fontSize="xs"
        textTransform="uppercase"
      >
        {title}
      </Text>
    </Button>
  )
}
