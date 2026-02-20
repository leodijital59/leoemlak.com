import * as React from "react"

type HeaderActionsContextValue = {
  actions: React.ReactNode
  setActions: (actions: React.ReactNode) => void
}

const HeaderActionsContext = React.createContext<HeaderActionsContextValue | null>(null)

export function HeaderActionsProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = React.useState<React.ReactNode>(null)
  const value = React.useMemo(() => ({ actions, setActions }), [actions])
  return (
    <HeaderActionsContext.Provider value={value}>
      {children}
    </HeaderActionsContext.Provider>
  )
}

export function useHeaderActions() {
  const context = React.useContext(HeaderActionsContext)
  if (!context) throw new Error("useHeaderActions must be used within HeaderActionsProvider")
  return context
}

export function HeaderActionsSlot({ children }: { children: React.ReactNode }) {
  const { setActions } = useHeaderActions()
  React.useEffect(() => {
    setActions(children)
    return () => setActions(null)
  }, [])
  return null
}
