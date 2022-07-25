import { useCallback, useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { NativeBaseProvider, StatusBar } from 'native-base'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto'

import { Routes } from './routes'
import { THEME } from './styles/theme'
import { Loading } from './components/Loading'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  const handleLoading = useCallback(async () => {
    if (!fontsLoaded) {
      await SplashScreen.preventAutoHideAsync()
    } else {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    handleLoading()
  }, [handleLoading])

  if (!fontsLoaded) {
    return null
  }

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        translucent={true}
        barStyle="light-content"
        backgroundColor="transparent"
      />
      {fontsLoaded ? <Routes /> : <Loading />}
    </NativeBaseProvider>
  )
}
