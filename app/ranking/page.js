'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { useEffect, useState, useMemo, useRef } from 'react'
import {useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import Dropdown from "../../lib/utils/dropdownSeason";
import DropdownCell from "../../lib/utils/dropdownCell";
import { hookSeason } from '../../lib/hooks/hookSeason'
import { hookQueens } from '../../lib/hooks/hookQueens'
import { pointTypeService } from '../../lib/services/pointTypeService';
import { ppeService } from '../../lib/services/ppeService';

export default function RankingPage() {
    const CLIENT_ID = "a6e3d2d2-f709-45b1-8d43-6a2d2f660170"; // CAMBIAR ID ESTATICO
    const seasonHook = hookSeason();
    const queensHook = hookQueens();
    const tableRef = useRef(null);
    const [seasonSelected, setSeasonSelected] = useState({
            id: null,
            name: "Select season",
            franchise: null,
            year: null
    });

    const [activeCell, setActiveCell] = useState(null);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [pointTypes, setPointTypes] = useState([])
    const [pointsMap, setPointsMap] = useState(new Map());
    const [originalPointsMap, setOriginalPointsMap] = useState(new Map());

    const finalPts = useMemo(() => {
        const totals = new Map();
        const episodes = new Map();

        pointsMap.forEach((point, key) => {
            const [queenId, episodeId] = key.split("|");
            const episodioFinal = seasonHook.episodes[seasonHook.episodes.length - 1].id;
            if(point.label !== "N/A" && point.label !== "WINNER" && episodioFinal && episodioFinal !== episodeId){
                totals.set(
                    queenId,
                    (totals.get(queenId) || 0) + point.value
                );

                episodes.set(
                    queenId,
                    (episodes.get(queenId) || 0) + 1
                );
            }
        });

        totals.forEach((total, queenId) => {
            totals.set(queenId, Math.round((total / episodes.get(queenId)) * 1000) / 1000);
        });

        return totals;
    }, [pointsMap]);

    const [rowsRanking, setRowsRanking] = useState([])

    const data = useMemo(() => {
        return queensHook.queens
            .map(q => ({
                id: q.queen.id,
                image_url: q.image_url,
                name: q.queen.name,
                puntuacion: finalPts.get(q.queen.id) || 0
            }))
            .sort((a, b) => b.puntuacion - a.puntuacion);
    }, [queensHook.queens, finalPts]);

    const columns = useMemo(() => [
        {
            accessorKey: "name",
            header: () => (
                <div className={styles.queenHeader}>
                    <span></span>
                    <span>Pts</span>
                </div>
            ),
            cell: ({ row }) => (
                <div className={styles.queenCell}>
                    <img
                        src={row.original.image_url}
                        alt={row.original.name}
                        className={styles.queenImage}
                        draggable={false}
                    />

                    <span className={styles.queenName}>
                        {row.original.name}
                    </span>

                    <span className={styles.queenScore}>
                        {row.original.puntuacion}
                    </span>
                </div>
            )
        },

        ...seasonHook.episodes.map((episode) => ({
            id: `episode-${episode.id}`,
            header: episode.title,
            accessorFn: (row) => row.episodes?.[episode.id] ?? "",
            cell: ({ row }) => {
                const key = `${row.original.id}|${episode.id}`;
                return (
                    <DropdownCell 
                        id={{queenRowId: row.original.id, episodeId: episode.id}}
                        point={pointsMap.get(key)}
                        setPoint={(point) => {
                            setPointsMap(prev => {
                                const copy = new Map(prev);
                                if (!point.id) {
                                    copy.delete(key);
                                } else {
                                    copy.set(key, point);
                                }
                                return copy;
                            });
                        }}
                        setActiveCell = {setActiveCell}
                        pointTypes = {pointTypes}
                    />
                );
            }
        })),

    ], [seasonHook.episodes, pointTypes, pointsMap, setPointsMap]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const loadPointTypes = async () => {
        try {
            setLoading(true)
            const res= await pointTypeService.getPointTypes()
            setPointTypes(res)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }   
    const loadRanking = async () => {
        try {
            const rows = await ppeService.getRanking(CLIENT_ID, seasonSelected.id)

            const map = new Map();
            rows.forEach(row => {

                const point = pointTypes.find(
                    p => p.id === row.point_type_id
                );
                map.set(
                    `${row.queen_id}|${row.episode_id}`,
                    point
                );
            });

            setPointsMap(map);
            setOriginalPointsMap(new Map(map));
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const saveRanking = async () => {
        try {
            const rows = [];
            pointsMap.forEach((point, key) => {

                const [queenId, episodeId] = key.split("|");

                rows.push({
                    client_id: CLIENT_ID,
                    queen_id: queenId,
                    season_id: seasonSelected.id,
                    episode_id: episodeId,
                    point_type_id: point.id
                });

            });
            
            const rowsToDelete = [];

            originalPointsMap.forEach((point, key) => {

                if (!pointsMap.has(key)) {

                    const [queenId, episodeId] = key.split("|");

                    rowsToDelete.push({
                        client_id: CLIENT_ID,
                        queen_id: queenId,
                        season_id: seasonSelected.id,
                        episode_id: episodeId
                    });
                }

            });

            ppeService.saveRanking(rows, rowsToDelete)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadPointTypes()
    }, [])

    useEffect(() => {
        if (!seasonSelected.id) return;
        if (!pointTypes.length) return;

        loadRanking();
    }, [seasonSelected, pointTypes]);

    useEffect(() => {
        const slider = tableRef.current;
        if (!slider || activeCell) return;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startScrollLeft = 0;
        let startScrollTop = 0;

        const handleMouseDown = (e) => {
            if (e.target.closest("select, input")) return;

            isDragging = true;
            slider.classList.add(styles.dragging);

            startX = e.clientX;
            startY = e.clientY;

            startScrollLeft = slider.scrollLeft;
            startScrollTop = slider.scrollTop;
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            e.preventDefault();

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            slider.scrollLeft = startScrollLeft - dx;
            slider.scrollTop = startScrollTop - dy;
        };

        const stopDragging = () => {
            isDragging = false;
            slider.classList.remove(styles.dragging);
        };

        slider.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDragging);

        return () => {
            slider.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDragging);
        };
    }, [activeCell]);

    return (
        <div>
            <div>
                <Link href="/" className={styles.buttonLink}>
                    Home
                </Link>
                <Dropdown   seasonSelected={seasonSelected} 
                        onSeasonChange={setSeasonSelected}
                        seasonHook = {seasonHook}
                        queensHook = {queensHook}
                />
                <button className={styles.buttonLink}
                        onClick={saveRanking}
                > 
                    Save Ranking
                </button>
                <button className={styles.buttonLink}
                        onClick={loadRanking}
                > 
                    Load Ranking
                </button>
            </div>
            <div ref={tableRef} className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const isNameColumn = header.column.id === "name";

                                const isHighlighted =
                                !activeCell ||
                                isNameColumn ||
                                header.column.id === `episode-${activeCell?.episodeId}`;

                                return (
                                    <th
                                        key={header.id}
                                        className={`
                                            ${styles.th}
                                            ${isNameColumn ? styles.nameColumn : ""}
                                            ${!isHighlighted ? styles.dimmed : ""}
                                        `}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                        <tr className={styles.tr} key={row.id}>
                            {row.getVisibleCells().map((cell) => {

                                const isNameColumn = cell.column.id === "name";

                                const isSelectedCell =
                                    activeCell &&
                                    row.original.id === activeCell.queenId &&
                                    cell.column.id === `episode-${activeCell.episodeId}`;

                                const isQueenCell =
                                    activeCell &&
                                    isNameColumn &&
                                    row.original.id === activeCell.queenId;

                                const isHighlighted =
                                    !activeCell ||
                                    isSelectedCell ||
                                    isQueenCell;

                                return (
                                    <td
                                        key={cell.id}
                                        className={`
                                            ${styles.td}
                                            ${isNameColumn ? styles.nameColumn : ""}
                                            ${!isHighlighted ? styles.dimmed : ""}
                                        `}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}