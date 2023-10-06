import React, { Fragment, useState } from 'react'
import List from './Components/List'
import Detail from './Components/Detail'
import styles from './App.module.css'

const RecentDataPage = () => {
  const [selectedItem, setSelectedItem] = useState(null)

  const handleSelectItem = (item) => {
    setSelectedItem(item)
  }

  return (
    <Fragment>
        <h1 className={styles.pageTitle}>最近7日财经新闻</h1>
        <div className={styles.pageContainer}>
          <List onSelectItem={handleSelectItem} />
          <Detail selectedItem={selectedItem} />
        </div>
    </Fragment>
  )
}

export default RecentDataPage
