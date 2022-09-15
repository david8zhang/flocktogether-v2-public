import * as React from 'react'
import styles from './PlaceSuggestion.module.css'

interface Props {
  name: string
  onClick: Function
}

const PlaceSuggestion: React.FC<Props> = ({ name, onClick }) => {
  return (
    <div className={styles.placeSuggestion} onClick={() => onClick()}>
      <p>{name}</p>
    </div>
  )
}

export default PlaceSuggestion
