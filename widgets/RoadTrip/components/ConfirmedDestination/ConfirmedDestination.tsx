import * as React from 'react'
import WidgetConfirmedHeader from '../../../widgetConfirmedHeader/WidgetConfirmedHeader'
import { LinkText } from '../../../../components'
import styles from './ConfirmedDestination.module.css'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

interface Props {
  onChooseDest: Function
  isPlanner: boolean
  confirmedDestination: {
    name: string
    formatted_address: string
    category: string
  }
}

const ConfirmedDestination: React.FC<Props> = ({
  isPlanner,
  onChooseDest,
  confirmedDestination,
}) => {
  const { isMobile } = useMobileDetector()
  const { formatted_address, name } = confirmedDestination
  return (
    <div>
      <WidgetConfirmedHeader
        question='Where are we going?'
        rightHeader={
          isPlanner && (
            <LinkText
              style={{ marginTop: isMobile ? '0px' : '' }}
              text='Choose different destination'
              onClick={() => {
                onChooseDest()
              }}
            />
          )
        }
      >
        <div>
          <p className={styles.confirmedDestination__name}>{name}</p>
          <p className={styles.confirmedDestination__location}>
            {formatted_address}
          </p>
        </div>
      </WidgetConfirmedHeader>
    </div>
  )
}

export default ConfirmedDestination
