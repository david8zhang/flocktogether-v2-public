import * as React from 'react'
import styles from './DestinationPoll.module.css'
import { Input } from '../../../../components'
import { Button, IconButton, Tooltip, Avatar } from '@material-ui/core'
import GoogleMapReact from 'google-map-react'

import { GOOGLE_API_KEY, searchPlaces } from '../../RoadTrip.utils'
import { FilterList, Room } from '@material-ui/icons'
import SearchResult from '../SearchResult/SearchResult'
import DestPollOption from '../DestPollOption/DestPollOption'
import SearchResultList from '../SearchResultList/SearchResultList'
import Marker from '../Marker/Marker'
import TieBreakerModal from '../TieBreakerModal/TieBreakerModal'
import { TripHandler } from '../../../../lib/TripHandler'
import DestMarker from '../DestMarker/DestMarker'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'
import { useScreenDimensions } from '../../../../hooks/useScreenDimensions'

export interface Props {
  isPlanner: boolean
  pollOptions: any[]
  setPollOptions: Function
  travelGroup: any[]
  userId: string | string[]
  userLocation: {
    lat: number
    lng: number
  }
  onConfirmDestination: Function
  tripHandler: TripHandler
}

const DestinationPoll: React.FC<Props> = ({
  isPlanner,
  pollOptions,
  setPollOptions,
  travelGroup,
  userId,
  onConfirmDestination,
  tripHandler,
}) => {
  const { isMobile } = useMobileDetector()
  const { screenDims } = useScreenDimensions()
  const [searchText, setSearchText] = React.useState('')
  const [checkedPlaces, setCheckedPlaces] = React.useState([])
  const [searchResults, setSearchResults] = React.useState([])
  const [searchLoading, setSearchLoading] = React.useState(false)
  const [isConfirmingDest, setIsConfirmingDest] = React.useState(false)

  const getAverage = (arr) => {
    return (
      arr.reduce((acc, curr) => {
        return acc + curr
      }, 0) / arr.length
    )
  }

  const midLat = getAverage(
    travelGroup.map((t) => t.location.geometry.location.lat)
  )
  const midLng = getAverage(
    travelGroup.map((t) => t.location.geometry.location.lng)
  )

  const midPoint = {
    lat: midLat,
    lng: midLng,
  }

  const onVoteForPoll = (opt) => {
    const newPollOptions = pollOptions.map((o) => {
      if (opt.place_id === o.place_id) {
        let newVotes = o.votes
        if (o.votes.includes(userId)) {
          newVotes = o.votes.filter((id: string) => id !== userId)
        } else {
          newVotes = o.votes.concat(userId)
        }
        return { ...o, votes: newVotes }
      }
      return o
    })
    tripHandler.setDestOptions(newPollOptions).then(() => {
      setPollOptions(newPollOptions)
    })
  }

  const searchPlace = () => {
    const currPollOptionIds = pollOptions.map(({ place_id }) => place_id)
    setSearchLoading(true)
    return searchPlaces(searchText, midPoint)
      .then((data) => {
        if (data.results) {
          const filteredResults = data.results.filter(
            ({ place_id }) => !currPollOptionIds.includes(place_id)
          )
          setSearchResults(filteredResults)
        }
        setSearchLoading(false)
      })
      .catch((err) => {
        setSearchLoading(false)
      })
  }

  const onAddCheckedPlaces = () => {
    const newPollOptions = pollOptions.concat(checkedPlaces)
    setPollOptions(newPollOptions)
    tripHandler.setDestOptions(newPollOptions).then(() => {
      setSearchText('')
      setSearchResults([])
      setCheckedPlaces([])
    })
  }

  const renderContent = () => {
    if (searchText.length > 0) {
      return (
        <div>
          <SearchResultList
            placeholderText="Click 'Search' to search, or filter for a type of destination"
            loading={searchLoading}
            searchResults={searchResults}
            renderComponent={(r) => {
              const isChecked =
                checkedPlaces.find((c) => c.place_id === r.place_id) !==
                undefined

              return (
                <SearchResult
                  key={r.place_id}
                  isChecked={isChecked}
                  name={r.name}
                  address={r.formatted_address}
                  onCheckClicked={() => {
                    let newCheckedPlaces = []
                    if (isChecked) {
                      newCheckedPlaces = checkedPlaces.filter(
                        (c) => c.place_id !== r.place_id
                      )
                    } else {
                      newCheckedPlaces = checkedPlaces.concat({
                        ...r,
                        votes: [userId],
                      })
                    }
                    setCheckedPlaces(newCheckedPlaces)
                  }}
                />
              )
            }}
          />
          {checkedPlaces.length > 0 && (
            <Button
              style={{ width: '100%' }}
              variant='contained'
              color='primary'
              onClick={() => {
                onAddCheckedPlaces()
              }}
            >
              Add selected options
            </Button>
          )}
        </div>
      )
    } else {
      return (
        <div>
          <SearchResultList
            loading={false}
            placeholderText='Search for some destinations and add them to the poll'
            searchResults={pollOptions}
            renderComponent={(opt) => {
              return (
                <DestPollOption
                  key={opt.place_id}
                  name={opt.name}
                  address={opt.formatted_address}
                  votes={opt.votes}
                  onVote={() => onVoteForPoll(opt)}
                  hasVoted={opt.votes.includes(userId)}
                />
              )
            }}
          />
          {isPlanner && (
            <Button
              style={{ width: '100%' }}
              variant='contained'
              color='primary'
              onClick={() => {
                setIsConfirmingDest(true)
              }}
            >
              Close Poll
            </Button>
          )}
        </div>
      )
    }
  }

  const mapCenter =
    pollOptions.length > 0
      ? pollOptions[pollOptions.length - 1].geometry.location
      : midPoint

  return (
    <div className={styles[`destinationPoll${isMobile ? '_mobile' : ''}`]}>
      <TieBreakerModal
        tripHandler={tripHandler}
        isOpen={isConfirmingDest}
        onClose={() => setIsConfirmingDest(false)}
        onConfirmDestination={(dest) => onConfirmDestination(dest)}
      />
      <div
        className={
          styles[`destinationPoll__pollOptions${isMobile ? '_mobile' : ''}`]
        }
        style={{
          height: isMobile ? '400px' : '',
          overflowY: isMobile ? 'scroll' : 'auto',
        }}
      >
        <div className={styles.destinationPoll__search}>
          <Input
            style={{ flex: 1, marginRight: '10px' }}
            onChange={(searchText: string) => setSearchText(searchText)}
            value={searchText}
            placeholder='Search for a place'
          />
          <Button
            onClick={() => {
              searchPlace()
            }}
            variant='contained'
            color='primary'
            style={{ marginRight: '5px' }}
          >
            Search
          </Button>
          {!isMobile && (
            <IconButton onClick={() => {}}>
              <FilterList />
            </IconButton>
          )}
        </div>
        {renderContent()}
      </div>
      <div
        className={styles.destinationPoll__map}
        style={{
          marginTop: isMobile ? '10px' : '',
          height: isMobile ? screenDims.width * 0.8 : '',
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
          center={mapCenter}
          zoom={10}
        >
          {pollOptions.map((pollOption) => {
            const { geometry, name, formatted_address, place_id } = pollOption
            return (
              <DestMarker
                key={place_id}
                markerColor='secondary'
                lat={geometry.location.lat}
                lng={geometry.location.lng}
                name={name}
                address={formatted_address}
              />
            )
          })}
          {checkedPlaces.map((place) => {
            const { geometry, name, formatted_address, place_id } = place
            return (
              <DestMarker
                key={`suggestion-${place_id}`}
                markerColor='primary'
                lat={geometry.location.lat}
                lng={geometry.location.lng}
                name={name}
                address={formatted_address}
              />
            )
          })}
          {travelGroup.map((t) => {
            const { location } = t
            return (
              <Marker
                key={t.userId}
                lat={location.geometry.location.lat}
                lng={location.geometry.location.lng}
                onClick={() => {}}
              >
                <Tooltip style={{ marginTop: '0px' }} title={t.name} arrow>
                  <Avatar
                    style={{
                      backgroundColor: 'darkslateblue',
                      transform: 'translate(-50%, -50%)',
                      width: '35px',
                      height: '35px',
                      fontSize: '15px',
                    }}
                  >
                    {t.name.split('')[0]}
                  </Avatar>
                </Tooltip>
              </Marker>
            )
          })}
        </GoogleMapReact>
      </div>
    </div>
  )
}

export default DestinationPoll
