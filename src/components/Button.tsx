import { Button as NativeBaseButton, IButtonProps, Text } from 'native-base'

interface IProps extends IButtonProps {
  title: string
}

export function Button({ title, ...rest }: IProps) {
  return (
    <NativeBaseButton
      h={14}
      rounded="sm"
      fontSize="sm"
      bg="green.700"
      _pressed={{
        bg: 'green.500'
      }}
      {...rest}
    >
      <Text color="white" fontSize="sm">
        {title}
      </Text>
    </NativeBaseButton>
  )
}
