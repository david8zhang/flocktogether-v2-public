import * as React from 'react'
import styles from './Input.module.css'

interface Props {
  type?: string
  value: string
  onChange: Function
  onKeyDown?: Function
  onFocus?: any
  onBlur?: any
  placeholder: string
  style?: any
}

export const Input: React.FC<Props> = ({
  style,
  type,
  value,
  onChange,
  placeholder,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  return (
    <input
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (onKeyDown) onKeyDown(e)
      }}
      style={style}
      type={type || 'text'}
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}
