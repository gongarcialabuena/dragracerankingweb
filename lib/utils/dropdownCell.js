'use client'

import styles from './page.module.css'
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaCaretDown } from 'react-icons/fa';


export default function DropdownCell({id, point, setPoint, setActiveCell, pointTypes}) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const toggleDropdown = () => {
        window.dispatchEvent(
            new CustomEvent("dropdown-open", {
                detail: { id }
            })
        );

        if (!isOpen) {
            const rect = buttonRef.current.getBoundingClientRect();

            setPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX
            });

            setActiveCell({
                queenId: id.queenRowId,
                episodeId: id.episodeId
            });
        }

        setIsOpen(!isOpen);
    };

    const handleSelect = (point) => {
        setIsOpen(false);
        setActiveCell(null);
        setPoint(point);
    };
    
    useEffect(() => {
        const listener = (e) => {
            if (e.detail.queenRowId !== id.queenRowId ||
                e.detail.episodeId !== id.episodeId) {
                setIsOpen(false);
                setActiveCell(null);
            }
        };

        window.addEventListener("dropdown-open", listener);

        return () =>
            window.removeEventListener("dropdown-open", listener);
    }, []);

    const getTextColor = (hex) => {
        if (!hex) return "#fff";

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        return luminance > 186 ? "#000" : "#fff";
    };

    return (
        <>
            <div
                className="w-full h-full"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    ref={buttonRef}
                    type="button"
                    className={`${styles.cellButton} ${
                        isOpen ? styles.cellButtonOpen : ""
                    }`}
                    onClick={toggleDropdown}
                    style={{
                        backgroundColor: point?.hexaColor
                            ? `#${point.hexaColor}`
                            : "white",
                        color: getTextColor(point?.hexaColor)
                    }}
                >
                    <span className={styles.cellLabel}>
                        {point?.label}
                    </span>
                    {!point?.id && <FaCaretDown style={{color: "#374151"}}/>}
                </button>
            </div>

            {isOpen &&
                createPortal(
                    <div
                        style={{
                            position: "absolute",
                            top: position.top,
                            left: position.left,
                            zIndex: 999999
                        }}
                        className="bg-white border"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <div className="grid grid-cols-2">
                            <a 
                                href="#"
                                className="col-span-2 flex items-center justify-center px-4 py-2 text-m bg-gray-200 hover:bg-gray-300"
                                onClick={() => handleSelect({label: "", hexaColor: "fff"})}
                            >
                                CLEAR
                            </a>
                        {pointTypes.map((point) => (
                                <a
                                    key={point.id}
                                    href="#"
                                    className="flex items-center justify-center px-4 py-2 text-m hover:brightness-90"
                                    style={{
                                        backgroundColor: `#${point.hexaColor}`,
                                        color: getTextColor(point.hexaColor)
                                    }}
                                    onClick={() => handleSelect(point)}
                                >
                                    {point.label}
                                </a>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}