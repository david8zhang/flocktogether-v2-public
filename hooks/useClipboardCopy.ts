import { useRef, useState } from 'react'

export const useClipboardCopy = () => {
  const [copied, setCopied] = useState(false)
  const inputRef: React.RefObject<any> = useRef<
    HTMLTextAreaElement | HTMLInputElement
  >(null)
  const copyToClipboard = (e) => {
    inputRef.current.select()
    if (
      document.execCommand &&
      document.queryCommandSupported &&
      document.queryCommandSupported('copy')
    ) {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
    if (e && e.target) e.target.focus()
  }
  return {
    inputRef,
    copyToClipboard,
    copied,
  }
}
