import * as React from 'react'
import * as Modal from 'react-modal'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'
import { CloseIcon } from '../../../../components'

interface Props {
  isOpen: boolean
  onClose: Function
  travelGroup: any[]
}

const AllTravelersModal: React.FC<Props> = ({
  isOpen,
  travelGroup,
  onClose,
}) => {
  const { isMobile } = useMobileDetector()
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      style={{
        content: {
          width: isMobile ? '100%' : '600px',
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
      <CloseIcon onClick={() => onClose()} />
      <h1 style={{ marginBottom: '15px', marginTop: '0px' }}>All travelers</h1>
      <div
        style={{ maxHeight: isMobile ? '100%' : '500px', overflowY: 'scroll' }}
      >
        {travelGroup.map((traveler) => {
          return (
            <div
              style={{
                padding: '15px',
                borderRadius: '4px',
                boxShadow: '0px 0px 4px #ccc',
                margin: '10px 5px',
              }}
            >
              <p
                style={{
                  fontSize: '24px',
                  marginBottom: '10px',
                  marginTop: '0px',
                }}
              >
                {traveler.name}
              </p>
              <p
                style={{
                  fontSize: '16px',
                  marginTop: '0px',
                  color: '#444',
                  marginBottom: '0px',
                }}
              >
                {traveler.location.description}
              </p>
              {traveler.isPlanner ? (
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '0px',
                  }}
                >
                  Planner
                </p>
              ) : (
                <div />
              )}
            </div>
          )
        })}
      </div>
    </Modal>
  )
}

export default AllTravelersModal
