import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import styles from './app.scss';

const projectList = [
  { label: 'Houses to Homes', url: 'https://housestohomesresidential.com/' },
  { label: 'WCSConnect', url: 'https://wcsconnect.com/' },
  // {
  //   label: 'Black History is US History',
  //   url: 'https://blackhistoryisushistory.com/',
  // },
];

const connectList = [
  { label: 'Resume', url: '/Resume.pdf' },
  {
    label: 'GitHub',
    url: 'https://github.com/samuraijs',
  },
  { label: 'Facebook', url: 'https://www.facebook.com/LordsJester/' },
  { label: 'Instagram', url: 'https://www.instagram.com/andrewsunada/' },
];

export default function App() {
  const mainRef = useRef(null);
  const [leftExpanded, setLeftExpanded] = useState(true);
  const [rightExpanded, setRightExpanded] = useState(true);
  useEffect(() => {
    var svg = d3
      .select(mainRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('class', styles.innerTextBottom)
      .append('g');

    var arc = d3
      .arc()
      .innerRadius(280)
      .outerRadius(310)
      .startAngle(0.87 * Math.PI)
      .endAngle(1.13 * Math.PI);

    svg
      .append('path')
      .attr('class', styles.arc)
      .attr('id', 'identity-arc')
      .attr('d', arc)
      .attr('transform', 'translate(300,300)');

    svg
      .append('text')
      .attr('dy', function (d, i) {
        return 20; //10
      })
      .attr('dx', function (d, i) {
        return 20; //20
      })
      .append('textPath')
      .attr('startOffset', '71%')
      .style('text-anchor', 'middle')
      .attr('xlink:href', '#identity-arc')
      .text('Ephesians 2:10');
  });
  return (
    <div className={styles.container}>
      <aside className={styles.navLeft}>
        {leftExpanded ? (
          <ul className={styles.navList}>
            {projectList.map((item, i) => (
              <li key={i}>
                <a href={item.url} target="_blank">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <button className={styles.button}>Projects</button>
        )}
      </aside>
      <div className={styles.main} ref={mainRef}>
        <div className={styles.inner1}></div>
        <div className={styles.inner2}></div>
        <div className={styles.innerLine}></div>
        <p className={styles.innerText}>Identity</p>
      </div>
      <div className={styles.name}>
        <p>Andrew</p>
        <p>Sunada</p>
      </div>
      <aside className={styles.navRight}>
        {rightExpanded ? (
          <ul className={styles.navList}>
            {connectList.map((item, i) => (
              <li key={i}>
                <a href={item.url} target="_blank">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <button className={styles.button}>Connect</button>
        )}
      </aside>
    </div>
  );
}
