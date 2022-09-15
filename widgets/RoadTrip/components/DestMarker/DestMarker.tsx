import * as React from 'react'
import Marker from '../Marker/Marker'
import { Tooltip } from '@material-ui/core'
import { Room } from '@material-ui/icons'

interface Props {
  name: string
  address: string
  markerColor: any
  lat: number
  lng: number
}

const DestMarker: React.FC<Props> = ({
  name,
  address,
  markerColor,
  lat,
  lng,
}) => {
  return (
    <Marker lat={lat} lng={lng} onClick={() => {}}>
      <Tooltip
        style={{ marginBottom: '0px' }}
        title={
          <div>
            <p
              style={{
                margin: '0px',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              {name}
            </p>
            <p
              style={{
                margin: '0px',
                fontSize: '10px',
                textAlign: 'center',
              }}
            >
              {address}
            </p>
          </div>
        }
        placement='top'
        arrow
      >
        <Room color={markerColor} />
      </Tooltip>
    </Marker>
  )
}

export default DestMarker
