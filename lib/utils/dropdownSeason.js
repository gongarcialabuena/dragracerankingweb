'use client'
import { useState, useEffect } from 'react';
import { FaCaretDown } from 'react-icons/fa';

export default function Dropdown({ seasonSelected, onSeasonChange, seasonHook, queensHook }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState({
        id: null,
        name: "Select season",
        franchise: null,
        year: null
    });

    useEffect(() => {
        seasonHook.handleGet()
    }, [])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (season) => {
        setSelectedSeason(season);
        onSeasonChange(season)
        setIsOpen(false);
        queensHook.setPage(1)
        queensHook.loadQueens(season, 1)
        seasonHook.handleGetEpisodes(season)
    };

    return (
        <div className="flex justify-center">
            <div className="relative inline-block text-left">
                {/* Dropdown button */}
                <button
                    type="button"
                    className="inline-flex justify-center w-full
                               rounded-md border border-gray-300
                               shadow-sm px-4 py-2 bg-white text-sm
                               font-medium text-black hover:bg-gray-50"
                    onClick={toggleDropdown}
                >
                    {selectedSeason.name}
                    <FaCaretDown className="ml-2" />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div className="origin-top-right absolute
                                    right-0 mt-2 w-56 rounded-md
                                    shadow-lg bg-white ring-1 ring-black
                                    ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {seasonHook.seasons.map((season, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="block px-4 py-2
                                               text-sm text-black
                                               hover:bg-gray-100"
                                    onClick={() => handleSelect(season)}
                                >
                                    {season.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}