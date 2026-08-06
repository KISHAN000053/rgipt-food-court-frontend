import React, { createContext, useContext, useState, useEffect } from 'react'

const PartyContext = createContext()

const KEY = 'active_party_code'

export const PartyProvider = ({ children }) => {
  // When set, "Add" buttons on menus add to this party room instead of the personal cart.
  const [activeCode, setActiveCode] = useState(() => {
    try { return localStorage.getItem(KEY) || null } catch (e) { return null }
  })

  useEffect(() => {
    try {
      if (activeCode) localStorage.setItem(KEY, activeCode)
      else localStorage.removeItem(KEY)
    } catch (e) { /* ignore */ }
  }, [activeCode])

  const startShoppingFor = (code) => setActiveCode(code)
  const stopShoppingForParty = () => setActiveCode(null)

  return (
    <PartyContext.Provider value={{ activeCode, startShoppingFor, stopShoppingForParty }}>
      {children}
    </PartyContext.Provider>
  )
}

export const useParty = () => useContext(PartyContext)
