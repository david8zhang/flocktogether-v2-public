import * as React from 'react'
import styles from './DestPollOption.module.css'
import { IconButton } from '@material-ui/core'
import {
  CheckBoxOutlined,
  CheckBoxOutlineBlank,
  MoreVert,
} from '@material-ui/icons'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

interface Props {
  onVote: Function
  hasVoted: boolean
  name: string
  address: string
  votes: string[]
}

const DestPollOption: React.FC<Props> = ({
  name,
  address,
  onVote,
  hasVoted,
  votes,
}) => {
  const { isMobile } = useMobileDetector()
  return (
    <div className={styles.destPollOption}>
      <div className={styles.destPollOption__voteButton}>
        <IconButton onClick={() => onVote()}>
          {hasVoted ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />}
        </IconButton>
      </div>
      <div className={styles.destPollOption__left}>
        <p className={styles.destPollOption__dateText}>{name}</p>
        <div className={styles.destPollOption__dateInfo}>
          <p
            style={{ fontSize: isMobile ? '11px' : '' }}
            className={styles.destPollOption__dateInfoTag}
          >
            {address}
          </p>
        </div>
      </div>
      <div className={styles.destPollOption__numVoteWrapper}>
        <p className={styles.destPollOption__numVoteText}>{votes.length}</p>
        <p className={styles.destPollOption__numVoteLabel}>Votes</p>
      </div>
      <IconButton onClick={() => {}}>
        <MoreVert />
      </IconButton>
    </div>
  )
}

export default DestPollOption
