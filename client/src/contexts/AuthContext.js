import { createContext, useReducer, useEffect } from 'react'
import { authReducer } from '../reducers/authReducer'
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from './constants'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null
  })
  const loadUser = async () => {
    if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
      setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
    }
    try {
      const response = await axios.get(`${apiUrl}/auth`)
      if (response.data.success) {
        dispatch({ type: "SET_AUTH", payload: { isAuthenticated: true, user: response.data.user } })
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
      setAuthToken(null)
      dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: false, user: null } })
    }
  }
  useEffect(() => {
    loadUser()
  }, [])
  const loginUser = async userForm => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, userForm)
      if (response.data.success) {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
        return response.data
      }
    } catch (error) {
      if (error.response.data) {
        return error.response.data
      }
      return { success: false, message: error.message }
    }
  }
  const authContentData = { loginUser, authState }
  return (
    <AuthContext.Provider value={authContentData}>
      {children}
    </AuthContext.Provider>
  )
}
export default AuthContextProvider
