import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export type OrderFirestoreDTO = {
  patrimony: string
  solution?: string
  description: string
  status: 'open' | 'closed'
  createdAt: FirebaseFirestoreTypes.Timestamp
  closedAt?: FirebaseFirestoreTypes.Timestamp
}
