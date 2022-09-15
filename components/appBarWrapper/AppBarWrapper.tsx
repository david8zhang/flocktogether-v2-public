import * as React from 'react'
import styles from './AppBarWrapper.module.css'
import Link from 'next/link'
import { Typography, AppBar, IconButton, Toolbar } from '@material-ui/core'

import { Menu } from '@material-ui/icons'
import { useMobileDetector } from '../../hooks/useMobileDetector'

interface Props {
  children: React.ReactNode
}

const AppBarWrapper: React.FC<Props> = ({ children }) => {
  const { isMobile } = useMobileDetector()
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            edge='start'
            style={{
              marginRight: '20px',
            }}
            color='inherit'
            aria-label='menu'
          >
            <Menu />
          </IconButton>
          <Link href='/'>
            <div style={{ cursor: 'pointer' }}>
              <Typography style={{ flexGrow: 1 }} variant='h6' noWrap>
                FlockTogether
              </Typography>
            </div>
          </Link>
        </Toolbar>
      </AppBar>
      <div className={styles[`appBarChildren${isMobile ? '_mobile' : ''}`]}>
        {children}
      </div>
    </div>
  )
}

export default AppBarWrapper
