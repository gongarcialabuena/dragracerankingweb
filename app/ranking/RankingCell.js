'use client'

import { useState, useRef } from 'react'
import styles from './RankingCell.module.css'

export default function RankingCell({ cellId, activeCell, setActiveCell, pointTypes, point, setPoint }) {
    const [openUp, setOpenUp] = useState(false)
    const cellRef = useRef(null)

    const open = activeCell === cellId

    const handleOpen = () => {
        if (open) {
            setActiveCell(null)
            return
        }

        if (cellRef.current) {
            const rect = cellRef.current.getBoundingClientRect()
            const dropdownHeight = 250
            const spaceBelow = window.innerHeight - rect.bottom
            const spaceAbove = rect.top

            setOpenUp(
                spaceBelow < dropdownHeight &&
                spaceAbove > spaceBelow
            )
        }

        setActiveCell(cellId)
    }

    const handleSelect = (selectedPoint) => {
        setPoint(selectedPoint)
        setActiveCell(null)
    }

    const rect = cellRef.current?.getBoundingClientRect()

    return (
        <div ref={cellRef} className={styles.cell}>
            <button
                className={styles.scoreButton}
                style={{
                    backgroundColor: point
                        ? `#${point.hexaColor}`
                        : 'white'
                }}
                onClick={handleOpen}
            >
                {point ? point.label : '—'}
            </button>

            {open && rect && (
                <div
                    className={`${styles.dropdown} ${openUp ? styles.dropdownUp : ''}`}
                    style={{
                        top: openUp ? rect.top : rect.bottom,
                        left: rect.left
                    }}
                >
                    <button
                        className={`${styles.option} ${styles.emptyOption}`}
                        onClick={() => handleSelect(null)}
                    >
                        EMPTY
                    </button>

                    {pointTypes.map(pointType => (
                        <button
                            key={pointType.id}
                            className={styles.option}
                            style={{
                                backgroundColor: `#${pointType.hexaColor}`
                            }}
                            onClick={() => handleSelect(pointType)}
                        >
                            {pointType.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}