import React from 'react';
import * as marked from 'marked';
import styles from '../App.module.css';

const RecentDataDetail = ({ selectedItem }) => {
  if (!selectedItem) return null;

  return (
    <div className={`${styles.newsDetail} ${styles.slideIn}`}>
      <h3 className={styles.detailTitle}>
        {selectedItem.title}
        <span className={styles.sourceType}>{selectedItem.sourceType}</span>
      </h3>
      <div
        className={styles.gptReport}
        dangerouslySetInnerHTML={{ __html: marked.parse(selectedItem.gptReport) }}
      />
      <div className={styles.tagsWrp}>
        <a className={styles.readSource} target='_blank' href={selectedItem.href} rel="noreferrer">打开原文</a>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: marked.parse(selectedItem.content) }}
      />
    </div>
  );
}

export default RecentDataDetail;
