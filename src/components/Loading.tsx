import { Center, Spinner } from 'native-base'

export const Loading = () => {
  return (
    <Center bg="gray.700" flex={1}>
      <Spinner color="secondary.700" size="lg" />
    </Center>
  )
}
