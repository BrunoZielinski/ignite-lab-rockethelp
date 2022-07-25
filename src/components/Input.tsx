import { Input as NativeBaseInput, IInputProps } from 'native-base'

interface InputProps extends IInputProps {}

export const Input = ({ ...rest }: InputProps) => {
  return (
    <NativeBaseInput
      h={14}
      size="md"
      color="white"
      fontSize="md"
      bg="gray.700"
      borderWidth={0}
      fontFamily="body"
      autoCapitalize="none"
      placeholderTextColor="gray.300"
      _focus={{
        borderWidth: 1,
        bg: 'gray.700',
        borderColor: 'green.500'
      }}
      {...rest}
    />
  )
}
