import * as React from 'react'
import styles from './SearchResultList.module.css'
import { useMobileDetector } from '../../../../hooks/useMobileDetector'

interface Props {
  loading: boolean
  searchResults: any[]
  renderComponent: Function
  placeholderText: string
}

const SearchResultList: React.FC<Props> = ({
  loading,
  searchResults,
  renderComponent,
  placeholderText,
}) => {
  const { isMobile } = useMobileDetector()
  if (loading) {
    return (
      <div>
        <p>Searching...</p>
      </div>
    )
  }
  if (searchResults.length === 0) {
    return (
      <div
        style={{ height: isMobile ? '315px' : '' }}
        className={styles.listPlaceholder}
      >
        <p className={styles.listPlaceholder__text}>{placeholderText}</p>
      </div>
    )
  }

  return (
    <div
      style={{ height: isMobile ? '315px' : '' }}
      className={styles.resultList}
    >
      {searchResults.map((result) => {
        return renderComponent(result)
      })}
    </div>
  )
}
export default SearchResultList
