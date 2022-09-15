import * as React from 'react'
import styles from './ShowExtraCard.module.css'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

interface Props {
  numMore: number
  onShowMore: Function
}

const ShowExtraCard: React.FC<Props> = ({ numMore, onShowMore }) => {
  const { isMobile } = useMobileDetector()
  return (
    <div
      style={{ width: isMobile ? '45%' : '' }}
      className={styles.showExtraCard}
    >
      <p className={styles.showExtraCard__text}>+ {numMore} More...</p>
      <p onClick={() => onShowMore()} className={styles.showExtraCard__link}>
        Click to see all travelers
      </p>
    </div>
  )
}

export default ShowExtraCard
