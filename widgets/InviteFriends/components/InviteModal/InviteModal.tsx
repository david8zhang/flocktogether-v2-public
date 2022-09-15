import * as React from 'react'
import * as Modal from 'react-modal'
import styles from './InviteModal.module.css'

import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@material-ui/core'
import { CloseIcon } from '../../../../components'
import { useClipboardCopy } from '../../../../hooks/useClipboardCopy'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'
import { useScreenDimensions } from '../../../../hooks/useScreenDimensions'

interface Props {
  isOpen: boolean
  onClose: Function
  tripId: string | string[]
}

const InviteModal: React.FC<Props> = ({ isOpen, onClose, tripId }) => {
  const { isMobile } = useMobileDetector()
  const { screenDims } = useScreenDimensions()
  const { inputRef, copyToClipboard, copied } = useClipboardCopy()
  const [currentHost, setCurrentHost] = React.useState('')

  React.useEffect(() => {
    if (window && window.location) {
      setCurrentHost(window.location.host)
    }
  }, [])

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      style={{
        content: {
          width: isMobile ? screenDims.width * 0.85 : '600px',
          top: 'unset',
          right: 'unset',
          left: 'unset',
          bottom: 'unset',
        },
        overlay: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <CloseIcon style={{ padding: '0px' }} onClick={() => onClose()} />
      <div className={styles.inviteModalBody}>
        <div className={styles['inviteModalBody__header']}>
          <FontAwesomeIcon icon={faLink} />
          <p className={styles['inviteModalBody__header__title']}>
            Get shareable link
          </p>
        </div>
        <p className={styles['inviteModalBody__description']}>
          Send this link to friends to invite them to the trip
        </p>
        <div className={styles.copyLinkBox}>
          <input
            onChange={() => {}}
            ref={inputRef}
            value={`${currentHost}/invite?tripId=${tripId}`}
          />
          <Button
            style={{ fontSize: '15px', width: '100px' }}
            variant='contained'
            color='primary'
            onClick={(e) => copyToClipboard(e)}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default InviteModal
