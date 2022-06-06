import React, { useState, createContext } from 'react'

export const RenderContext = createContext({})

export const RenderContextProvider = (props) => {
  const [render, setRender] = useState(false);

  return (
    <RenderContext.Provider value={{ 
      render,
      setRender
    }}>
      {props.children}
    </RenderContext.Provider>
  )
}
