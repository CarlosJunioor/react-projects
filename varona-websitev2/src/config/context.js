import React, { useContext, useState, useEffect } from "react"
import { auth } from "./firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password, displayName) {
    return auth.createUserWithEmailAndPassword(email, password).then(() => {
        var currentUser = auth.currentUser;
          currentUser.updateProfile({
            displayName: displayName
          })
    })
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
        setCurrentUser(user)
        setLoading(false)
        if(user) {
          if(user.displayName !== null) {
            localStorage.removeItem('userName')
          }
        }
        
    })

    

  }, [currentUser])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {loading === false && children}
    </AuthContext.Provider>
  )
}