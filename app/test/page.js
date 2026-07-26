'use client'

import styles from './page.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useQueens } from './useQueens'
import { useSeason } from './useSeason'
import Dropdown from "./dropdownSeason";

export default function TestPage() {
    const queenHook = useQueens();
    const seasonHook = useSeason();
    const [seasonSelected, setSeasonSelected] = useState({
        id: null,
        name: "Select season",
        franchise: null,
        year: null
    });
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Test Supabase</h1>
            <div>
                  <Link href="/" className={styles.buttonPaginate}>
                    Home
                  </Link>
                </div>
            <div className={styles.inputDiv}>
                <input
                    name="name"
                    placeholder="name"
                    value={queenHook.queen.name}
                    className={styles.inputName}
                    onChange={(e) =>
                        queenHook.setQueen({ ...queenHook.queen, name: e.target.value })
                    }
                />
                <Dropdown   seasonSelected={seasonSelected} 
                            onSeasonChange={setSeasonSelected}
                            seasonHook = {seasonHook}
                            queenHook = {queenHook}
                />
                <button className={styles.buttonCreate} onClick={() => queenHook.handleCreate(seasonSelected)}>
                    Create Queen
                </button>
            </div>
            <div className={styles.inputDiv}>
                <input
                    name="name"
                    placeholder="name"
                    className={styles.inputName}
                    onChange={(e) =>
                        seasonHook.setSeasonName(e.target.value)
                    }
                />

                <input
                    name="franchise"
                    placeholder="franchise"
                    className={styles.inputName}
                    onChange={(e) =>
                        seasonHook.setFranchise(e.target.value )
                    }
                />

                <input
                    name="year"
                    placeholder="year"
                    className={styles.inputName}
                    onChange={(e) =>
                        seasonHook.setSeasonYear(e.target.value )
                    }
                />
                <button className={styles.buttonCreate} onClick={() => seasonHook.handleCreate(seasonSelected)}>
                    Create Season
                </button>
            </div>
            <div className={styles.episodes}>
                <p>Episodes of season {seasonSelected.name}</p>
                <input
                    name="title"
                    placeholder="Title of the episode"
                    className={styles.inputName}
                    onChange={(e) =>
                        seasonHook.setTitleEpisode(e.target.value )
                    }
                />
                <button className={styles.buttonCreate} onClick={() => seasonHook.handleSetEpisode(seasonSelected)}>
                    Create Episode
                </button>
                <button className={styles.buttonDelete} onClick={() => seasonHook.handleDeleteLastEpisode(seasonSelected)}>
                    Delete last Episode
                </button>
                <div className={styles.listEpisode}>
                    {seasonHook.episodes?.map(e => (
                    <div key={e.id + '-' +e.title} className={styles.queen}>
                        <p>{e.title}</p>
                    </div>
                ))}
                </div>
            </div>
            <div className={styles.listQueensButtons}>
                <button className={styles.buttonPaginate} disabled={queenHook.page === 1} onClick={() => queenHook.handlePrev()}>
                    Anterior
                </button>
                <span> Página {queenHook.page} de {queenHook.totalPages} </span>
                <button className={styles.buttonPaginate} disabled={queenHook.page === queenHook.totalPages} onClick={() => queenHook.handleNext()}>
                    Siguiente
                </button>
            </div>
            <div className={styles.listQueens}>
                {queenHook.queens?.map(q => (
                    <div key={q.season.id + '-' +q.queen.id} className={styles.queen}>
                        {q.image_url?.link && (
                            <img src={q.image_url} alt="Queen CastMug" />
                        )}
                        <p>{q.queen.name}</p>
                        <p>{q.season.name}</p>
                        <button className={styles.buttonDelete} onClick={() => queenHook.handleDelete(seasonSelected, q.queen, q.season)}>
                            Delete Queen
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}