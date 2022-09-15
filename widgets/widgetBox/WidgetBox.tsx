import * as React from 'react'
import styles from './WidgetBox.module.css'

interface Props {
  children?: React.ReactNode
}

const WidgetBox: React.FC<Props> = ({ children }) => {
  return <div className={styles.widgetBox}>{children}</div>
}

export default WidgetBox
