import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/firebase'

// Firebase Auth API
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { checkUserWatchlist } from '../common/utils/watchlistUtils'

const AuthContext = createContext()

export const AuthProvider = ( { children } ) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse( localStorage.getItem( 'user' ) ),
  )

  const [mode, setMode] = useState( process.env.REACT_APP_USER_MODE )

  const signUp = async ( email, password ) => {
    return {
      mode,
      signUp: createUserWithEmailAndPassword( auth, email, password )
    }
  }

  const signIn = async ( email, password ) => {
    if ( email === process.env.REACT_APP_DEMO_EMAIL ) {
      setMode( process.env.REACT_APP_DEMO_MODE )
    } else {
      setMode( process.env.REACT_APP_USER_MODE )
    }
    const { user: { uid } } = await signInWithEmailAndPassword( auth, email, password )

    checkUserWatchlist( uid )

    return { mode, user: uid }
  }

  const logOut = () => {
    signOut( auth )
    if ( mode === process.env.REACT_APP_DEMO_MODE ) {
      localStorage.removeItem( process.env.REACT_APP_WATCHLIST_NAME )
      setMode( process.env.REACT_APP_USER_MODE )
    }
  }

  useEffect( () => {
    return auth.onAuthStateChanged( ( user ) => {
      user
        ? localStorage.setItem( 'user', JSON.stringify( user ) )
        : localStorage.removeItem( 'user' )
      if ( user ) {
        setCurrentUser( user )
      } else {
        setCurrentUser( null )
      }
    } )
  }, [currentUser] )

  const authState = {
    currentUser,
    signUp,
    signIn,
    logOut,
  }

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext( AuthContext )
