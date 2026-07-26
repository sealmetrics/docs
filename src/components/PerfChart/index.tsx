import React from 'react';
import styles from './styles.module.css';

export type SeriesColor = 'seal' | 'ga4' | 'adobe' | 'legacy';

export interface BarItem {
  label: string;
  sublabel?: string;
  value: number;
  display: string;
  color: SeriesColor;
}

/**
 * Horizontal bar chart at true linear scale. Bars are direct-labeled,
 * so no legend is needed; the tiny Sealmetrics bar is the point.
 */
export function BarChart({items, max, note}: {items: BarItem[]; max?: number; note?: string}): React.ReactElement {
  const m = max ?? Math.max(...items.map((i) => i.value));
  return (
    <div className={styles.chart}>
      {items.map((it, i) => {
        const pct = Math.max((it.value / m) * 100, 0.5);
        return (
          <div className={styles.row} key={i}>
            <div className={styles.lbl}>
              <b>{it.label}</b>
              {it.sublabel}
            </div>
            <div className={styles.track}>
              <div className={`${styles.bar} ${styles[it.color]}`} style={{width: `${pct}%`}} />
              <span className={styles.val} style={{left: `calc(${Math.min(pct, 74)}% + 8px)`}}>
                {it.display}
              </span>
            </div>
          </div>
        );
      })}
      {note && <div className={styles.note}>{note}</div>}
    </div>
  );
}

export interface TimelineSeg {
  t0: number;
  t1: number;
  color: SeriesColor;
  opacity?: number;
}

export interface TimelineMark {
  t: number;
  label?: string;
}

export interface TimelineRow {
  label: string;
  sublabel?: string;
  segs: TimelineSeg[];
  marks?: TimelineMark[];
}

/**
 * Field timeline: script/call spans as segments, hit dispatches as
 * vertical markers, on a shared millisecond scale.
 */
export function Timeline({rows, scale, axis}: {rows: TimelineRow[]; scale: number; axis: string[]}): React.ReactElement {
  return (
    <div className={styles.chart}>
      {rows.map((row, i) => (
        <div className={styles.tlrow} key={i}>
          <div className={styles.lbl}>
            <b>{row.label}</b>
            {row.sublabel}
          </div>
          <div className={styles.tltrack}>
            {row.segs.map((s, j) => (
              <div
                key={j}
                className={`${styles.tseg} ${styles[s.color]}`}
                style={{
                  left: `${(s.t0 / scale) * 100}%`,
                  width: `${Math.max(((s.t1 - s.t0) / scale) * 100, 0.6)}%`,
                  opacity: s.opacity ?? 1,
                }}
              />
            ))}
            {(row.marks ?? []).map((mk, j) => {
              const pct = (mk.t / scale) * 100;
              return (
                <React.Fragment key={`m${j}`}>
                  <div className={styles.tmark} style={{left: `${pct}%`}} />
                  {mk.label && (
                    <span
                      className={styles.tlbl}
                      style={pct > 78 ? {right: `${100 - pct + 1}%`} : {left: `${pct + 1}%`}}>
                      {mk.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}
      <div className={styles.axis}>
        {axis.map((a, i) => (
          <span key={i}>{a}</span>
        ))}
      </div>
    </div>
  );
}
