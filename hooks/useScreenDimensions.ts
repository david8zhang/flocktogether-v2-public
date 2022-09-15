import * as React from 'react'

export const useScreenDimensions = () => {
  const [screenDims, setScreenDims] = React.useState<any>({})
  React.useEffect(() => {
    if (window) {
      setScreenDims({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, [])
  return { screenDims }
}
