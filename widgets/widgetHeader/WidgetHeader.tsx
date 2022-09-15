import * as React from 'react'
import styles from './WidgetHeader.module.css'
import { useMobileDetector } from '../../hooks/useMobileDetector'

interface Props {
  questionText: string
  description: string
  style?: any
  children?: any
}

const WidgetHeader: React.FC<Props> = ({
  questionText,
  description,
  style,
}) => {
  const { isMobile } = useMobileDetector()
  return (
    <div style={style} className={styles.widgetHeader}>
      <p className={styles[`widgetHeader__title${isMobile ? '_mobile' : ''}`]}>
        {questionText}
      </p>
      <p className={styles.widgetHeader__description}>{description}</p>
    </div>
  )
}

export default WidgetHeader
