import React, { useState, useEffect } from 'react'
import styles from '../App.module.css'

const RecentDataTitles = ({ onSelectItem }) => {
  const [newsList, setNewsList] = useState([])
  const [expanded, setExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(null)

  useEffect(() => {
    fetch('/api/recent-data')
      .then((response) => response.json())
      .then((data) => {
        setNewsList(data.data)
      })
      .catch((error) => console.error(error))
  }, [])

  const handleClick = (item, index) => {
    setExpanded(true)
    setCurrentIndex(index)
    onSelectItem(item)
  }

  return (
    <ul className={`${styles.newsList} ${expanded ? styles.expanded : ''}`}>
      {newsList.map((item, index) => (
        <li key={item.title} onClick={() => handleClick(item, index)}>
          <h3
            className={`${styles.newsTitle} ${
              currentIndex === index ? styles.newsTitleSelected : ''
            }`}
          >
            {item.title}{' '}
            <span className={styles.sourceType}>{item.sourceType}</span>
            <span className={styles.date}>
              {new Date(item.publishTime).toLocaleDateString()}
            </span>
          </h3>
        </li>
      ))}
    </ul>
  )
}

export default RecentDataTitles
