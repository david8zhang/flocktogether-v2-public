import * as React from 'react'

export const useMobileDetector = () => {
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    if (navigator) {
      const mobileTest = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      setIsMobile(mobileTest)
    }
  }, [])
  return { isMobile }
}
