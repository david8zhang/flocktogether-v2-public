import * as React from 'react'
import styles from './SearchResult.module.css'
import { IconButton } from '@material-ui/core'
import { CheckBoxOutlineBlank, CheckBoxOutlined } from '@material-ui/icons'

interface Props {
  name: string
  address: string
  isChecked: boolean
  onCheckClicked: Function
}

const SearchResult: React.FC<Props> = ({
  name,
  address,
  isChecked,
  onCheckClicked,
}) => {
  return (
    <div className={styles.searchResult}>
      <div className={styles.text}>
        <p className={styles.name}>{name}</p>
        <p className={styles.address}>{address}</p>
      </div>
      <IconButton onClick={() => onCheckClicked()}>
        {isChecked ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />}
      </IconButton>
    </div>
  )
}

export default SearchResult
