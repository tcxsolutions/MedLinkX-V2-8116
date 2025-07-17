import React, { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
            role: 'Administrator',
            department: 'Administration', 
            tenantId: 'gznfjkvpdomkxkdunmma', // Multi-tenant ID
            organizationId: 'gznfjkvpdomkxkdunmma',
            isAdmin: true
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
            role: 'Administrator',
            department: 'Administration',
            tenantId: 'gznfjkvpdomkxkdunmma',
            organizationId: 'gznfjkvpdomkxkdunmma', 
            isAdmin: true
          })
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      
      // For demo purposes, allow mock login
      if (credentials.email === 'admin@medlinkx.com' && credentials.password === 'admin123') {
        const mockUser = {
          id: '1',
          name: 'System Administrator',
          email: 'admin@medlinkx.com',
          role: 'Administrator',
          department: 'Administration',
          tenantId: 'gznfjkvpdomkxkdunmma',
          organizationId: 'gznfjkvpdomkxkdunmma',
          isAdmin: true
        }
        setUser(mockUser)
        return { success: true }
      }

      // Try actual Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}