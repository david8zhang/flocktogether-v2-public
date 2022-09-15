import * as React from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import { Cancel } from '@material-ui/icons'

interface Props {
  style?: any
  iconStyle?: any
  onClick: Function
}

const useStyles = makeStyles({
  closeIcon: {
    position: 'absolute',
    right: '15px',
  },
})

export const CloseIcon: React.FC<Props> = ({ onClick, style, iconStyle }) => {
  const classes = useStyles()

  return (
    <IconButton
      style={style}
      className={classes.closeIcon}
      onClick={() => onClick()}
    >
      <Cancel style={iconStyle} />
    </IconButton>
  )
}
