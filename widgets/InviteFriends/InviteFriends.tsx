import * as React from 'react'
import styles from './InviteFriends.module.css'
import { TravelerCard, InviteModal, AllTravelersModal } from './components'
import ShowExtraCard from './components/ShowExtraCard/ShowExtraCard'
import WidgetBox from '../widgetBox/WidgetBox'
import WidgetHeader from '../widgetHeader/WidgetHeader'
import { LinkText } from '../../components'
import { useMobileDetector } from '../../hooks/useMobileDetector'

interface Props {
  travelGroup?: any[]
  isPlanner: boolean
  tripId: string | string[]
}

const InviteFriends: React.FC<Props> = ({ travelGroup, tripId, isPlanner }) => {
  const { isMobile } = useMobileDetector()
  const [showInviteModal, setShowInviteModal] = React.useState(false)
  const [showingAllTravelers, setShowingAllTravelers] = React.useState(false)
  const [friends, setFriends] = React.useState(travelGroup)
  const [maxFriendsInList, setMaxFriendsInList] = React.useState(3)

  React.useEffect(() => {
    let maxFriendsInList = window && window.screen.width > 1650 ? 5 : 3
    if (isMobile) {
      maxFriendsInList = 1
    }
    setMaxFriendsInList(maxFriendsInList)
  })

  const truncatedFriendsList = friends.slice(0, maxFriendsInList)
  const shouldShowExtra = friends.length > maxFriendsInList

  return (
    <WidgetBox>
      <AllTravelersModal
        isOpen={showingAllTravelers}
        onClose={() => setShowingAllTravelers(false)}
        travelGroup={travelGroup}
      />
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        tripId={tripId}
      />
      <div
        className={
          styles[`inviteFriends__titleWrapper${isMobile ? '_mobile' : ''}`]
        }
      >
        <WidgetHeader
          style={{ flex: 1 }}
          questionText="Who's coming?"
          description='Invite some friends and make decisions as a group!'
        />
        <LinkText
          style={{ marginTop: isMobile ? '0px' : '' }}
          text='Invite Friends'
          onClick={() => {
            setShowInviteModal(true)
          }}
        />
      </div>
      <div className={styles.inviteFriends__friendsList}>
        {truncatedFriendsList.map((f, index) => {
          return (
            <TravelerCard
              key={`${f.name}-${index}`}
              style={{ margin: '10px' }}
              name={f.name}
              location={f.location.description}
              isPlanner={f.isPlanner}
            />
          )
        })}
        {shouldShowExtra && (
          <ShowExtraCard
            onShowMore={() => {
              console.log('on Show more')
              setShowingAllTravelers(true)
            }}
            numMore={friends.length - maxFriendsInList}
          />
        )}
      </div>
    </WidgetBox>
  )
}

export default InviteFriends
