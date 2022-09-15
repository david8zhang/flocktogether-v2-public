import * as React from 'react'
import styles from './WidgetConfirmedHeader.module.css'
import { useMobileDetector } from '../../hooks/useMobileDetector'

interface Props {
  question: string
  rightHeader?: React.ReactNode
  children?: React.ReactNode
}

const WidgetConfirmedHeader: React.FC<Props> = ({
  question,
  rightHeader,
  children,
}) => {
  const { isMobile } = useMobileDetector()
  return (
    <div>
      <div
        className={
          styles[`confirmedWidget__header${isMobile ? '_mobile' : ''}`]
        }
      >
        <p className={styles.confirmedWidget__question}>{question}</p>
        {rightHeader}
      </div>
      <div
        style={{ fontSize: isMobile ? '20px' : '' }}
        className={styles.confirmedWidget__body}
      >
        {children}
      </div>
    </div>
  )
}

export default WidgetConfirmedHeader
