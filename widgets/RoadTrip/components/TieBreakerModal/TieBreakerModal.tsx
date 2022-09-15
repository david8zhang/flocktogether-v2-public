import * as React from 'react'
import * as Modal from 'react-modal'
import { CloseIcon } from '../../../../components'
import SearchResultList from '../SearchResultList/SearchResultList'
import { Button } from '@material-ui/core'
import DestPollOption from '../DestPollOption/DestPollOption'
import { TripHandler } from '../../../../lib/TripHandler'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

interface Props {
  isOpen: boolean
  onClose: Function
  tripHandler: TripHandler
  onConfirmDestination: Function
}

const TieBreakerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirmDestination,
  tripHandler,
}) => {
  const { isMobile } = useMobileDetector()
  const [pollOptions, setPollOptions] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  React.useEffect(() => {
    if (isOpen) {
      tripHandler.getTrip().then((trip) => {
        setIsLoading(false)
        setPollOptions(trip.destOptions || [])
      })
    }
  }, [isOpen])
  const mostVotes = pollOptions.reduce((acc, curr) => {
    acc = Math.max(acc, curr.votes.length)
    return acc
  }, 0)
  const optionsWithMostVotes = pollOptions.filter(
    (opt) => opt.votes.length === mostVotes
  )
  const [pickedDest, setPickedDest] = React.useState(null)
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      style={{
        content: {
          width: isMobile ? '100%' : '800px',
          maxHeight: '100%',
          overflowY: 'scroll',
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
      <CloseIcon
        onClick={() => {
          setPickedDest(null)
          onClose()
        }}
      />
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p style={{ textAlign: 'center' }}>Loading...</p>
        </div>
      ) : (
        <div>
          <h1 style={{ fontSize: isMobile ? '20px' : '', textAlign: 'center' }}>
            Choose the destination
          </h1>
          <SearchResultList
            loading={false}
            searchResults={optionsWithMostVotes}
            placeholderText='No options were added!'
            renderComponent={(option) => {
              return (
                <DestPollOption
                  key={option.place_id}
                  name={option.name}
                  address={option.formatted_address}
                  onVote={() => {
                    setPickedDest(option)
                  }}
                  hasVoted={
                    pickedDest && pickedDest.place_id === option.place_id
                  }
                  votes={option.votes}
                />
              )
            }}
          />
          <Button
            style={{ width: '100%' }}
            variant='contained'
            color='primary'
            onClick={() => {
              onClose()
              setPickedDest(null)
              onConfirmDestination(pickedDest)
            }}
          >
            Pick destination
          </Button>
        </div>
      )}
    </Modal>
  )
}

export default TieBreakerModal
