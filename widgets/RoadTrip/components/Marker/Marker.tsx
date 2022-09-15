import * as React from 'react'
import styles from './Marker.module.css'
import { IconButton } from '@material-ui/core'
import { Room } from '@material-ui/icons'

interface Props {
  lat: any
  lng: any
  onClick: Function
  children?: React.ReactNode
}

const Marker: React.FC<Props> = ({ onClick, children }) => {
  return (
    <div className={styles.marker}>
      {children || <Room color='secondary' />}
    </div>
  )
}
export default Marker
