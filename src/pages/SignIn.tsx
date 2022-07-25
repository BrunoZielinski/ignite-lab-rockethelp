import { useState } from 'react'
import auth from '@react-native-firebase/auth'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Envelope, Key, Eye, EyeSlash } from 'phosphor-react-native'
import {
  Heading,
  VStack,
  Icon,
  useTheme,
  IconButton,
  Toast,
  ScrollView
} from 'native-base'

import { Input } from '../components/Input'
import Logo from '../assets/logo_primary.svg'
import { Button } from '../components/Button'

export const SignIn = () => {
  const { colors } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async () => {
    const verifyEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!verifyEmail.test(email)) {
      Toast.show({
        description: 'E-mail inválido',
        duration: 1500
      })
      return
    }

    if (!email || !password) {
      Toast.show({
        description: 'Informe o e-mail e senha.',
        duration: 1500
      })
      return
    }

    setIsLoading(true)
    try {
      await auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      // console.error(error.code)
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          Toast.show({
            description: 'E-mail ou senha errados',
            duration: 1500
          })
          break
        case 'auth/invalid-email':
          Toast.show({
            description: 'E-mail inválida',
            duration: 1500
          })
          break

        default:
          Toast.show({
            description: 'Erro ao fazer login, tente novamente.',
            duration: 1500
          })
          break
      }
    }
    setIsLoading(false)
  }

  return (
    <ScrollView bg="gray.600">
      <VStack px={8} pt={24} flex={1} alignItems="center">
        <Logo />

        <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
          Acesse sua conta
        </Heading>

        <Input
          mb={4}
          value={email}
          placeholder="E-mail"
          onChangeText={setEmail}
          keyboardType="email-address"
          InputLeftElement={
            <Icon as={<Envelope color={colors.gray[100]} />} ml={4} />
          }
        />
        <Input
          mb={8}
          value={password}
          placeholder="Senha"
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          keyboardType={showPassword ? 'visible-password' : 'default'}
          InputLeftElement={
            <Icon as={<Key color={colors.gray[100]} />} ml={4} />
          }
          InputRightElement={
            <IconButton
              onPress={() => setShowPassword(!showPassword)}
              icon={
                <Icon
                  as={
                    showPassword ? (
                      <EyeSlash color={colors.gray[100]} />
                    ) : (
                      <Eye color={colors.gray[100]} />
                    )
                  }
                />
              }
            />
          }
        />

        <Button
          w="full"
          title="Entrar"
          isLoading={isLoading}
          onPress={() => {
            handleSignIn()
            Keyboard.dismiss()
          }}
        />
      </VStack>
    </ScrollView>
  )
}
