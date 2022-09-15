import * as React from 'react'
import styles from './TravelerCard.module.css'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

interface Props {
  name: string
  location: string
  isPlanner: boolean
  style: any
}

const TravelerCard: React.FC<Props> = ({
  name,
  location,
  isPlanner,
  style,
}) => {
  const { isMobile } = useMobileDetector()
  return (
    <div
      style={style}
      className={styles[`travelerCard${isMobile ? '_mobile' : ''}`]}
    >
      <p className={styles.travelerCard__name}>{name}</p>
      <p className={styles.travelerCard__location}>{location}</p>
      <p className={styles.travelerCard__isPlanner}>
        {isPlanner ? 'Planner' : ''}
      </p>
    </div>
  )
}

export default TravelerCard
