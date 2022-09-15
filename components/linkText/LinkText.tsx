import * as React from 'react'
import styles from './LinkText.module.css'

interface Props {
  onClick: Function
  text: string
  style?: any
}

const LinkText: React.FC<Props> = ({ onClick, text, style }) => {
  return (
    <p onClick={() => onClick()} className={styles.linkText} style={style}>
      {text}
    </p>
  )
}

export default LinkText
