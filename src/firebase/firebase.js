import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseApp = initializeApp( {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: '208830692894',
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: 'G-XXH72H9RQ3',
} )

export const auth = getAuth()
export default firebaseApp
