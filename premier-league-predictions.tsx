"use client"

import { useState } from "react"
import { RotateCcw, Shuffle, Trophy, Target, Users, Calendar, MousePointer } from "lucide-react"

const clubs = [
  "AFC Bournemouth",
  "Arsenal",
  "Aston Villa",
  "Brentford",
  "Brighton & Hove Albion",
  "Burnley",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Leeds United",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Newcastle United",
  "Nottingham Forest",
  "Sunderland",
  "Tottenham",
  "West Ham United",
  "Wolves",
]

const sections = [
  { id: "top4", title: "TOP 4", color: "from-blue-600 to-blue-700", positions: "1-4", slots: [1, 2, 3, 4] },
  { id: "europe", title: "EUROPE", color: "from-orange-400 to-orange-500", positions: "5-7", slots: [5, 6, 7] },
  {
    id: "uppermid",
    title: "UPPER MID",
    color: "from-gray-500 to-gray-600",
    positions: "8-12",
    slots: [8, 9, 10, 11, 12],
  },
  {
    id: "lowermid",
    title: "LOWER MID",
    color: "from-gray-600 to-gray-700",
    positions: "13-17",
    slots: [13, 14, 15, 16, 17],
  },
  { id: "relegation", title: "RELEGATION", color: "from-red-600 to-red-700", positions: "18-20", slots: [18, 19, 20] },
]

const premierLeagueStats = [
  { icon: Trophy, label: "Champions League", description: "Top 4 qualify for UCL group stage" },
  { icon: Target, label: "Europa League", description: "5th place enters Europa League" },
  { icon: Users, label: "Conference League", description: "6th/7th may qualify for UECL" },
  { icon: Calendar, label: "Relegation", description: "Bottom 3 drop to Championship" },
]

export default function PremierLeaguePredictions() {
  const [positions, setPositions] = useState<{ [key: number]: string }>({})
  const [availableClubs, setAvailableClubs] = useState(clubs)
  const [selectedClub, setSelectedClub] = useState<string | null>(null)

  const handleClubClick = (club: string) => {
    if (selectedClub === club) {
      setSelectedClub(null) // Deselect if clicking the same club
    } else {
      setSelectedClub(club)
    }
  }

  const handlePositionClick = (position: number) => {
    if (!selectedClub) return

    // If position is occupied, swap the clubs
    if (positions[position]) {
      const existingClub = positions[position]

      // If the selected club is from available clubs
      if (availableClubs.includes(selectedClub)) {
        setAvailableClubs((prev) => [...prev.filter((club) => club !== selectedClub), existingClub])
        setPositions((prev) => ({ ...prev, [position]: selectedClub }))
      } else {
        // If the selected club is from another position, swap them
        const selectedClubPosition = Object.keys(positions).find((pos) => positions[Number(pos)] === selectedClub)
        if (selectedClubPosition) {
          setPositions((prev) => ({
            ...prev,
            [Number(selectedClubPosition)]: existingClub,
            [position]: selectedClub,
          }))
        }
      }
    } else {
      // Position is empty, place the club
      if (availableClubs.includes(selectedClub)) {
        setAvailableClubs((prev) => prev.filter((club) => club !== selectedClub))
        setPositions((prev) => ({ ...prev, [position]: selectedClub }))
      } else {
        // Move from another position
        const selectedClubPosition = Object.keys(positions).find((pos) => positions[Number(pos)] === selectedClub)
        if (selectedClubPosition) {
          setPositions((prev) => {
            const newPositions = { ...prev }
            delete newPositions[Number(selectedClubPosition)]
            newPositions[position] = selectedClub
            return newPositions
          })
        }
      }
    }

    setSelectedClub(null) // Deselect after placing
  }

  const handlePositionedClubClick = (club: string, position: number) => {
    if (selectedClub === club) {
      // Remove club back to available
      setPositions((prev) => {
        const newPositions = { ...prev }
        delete newPositions[position]
        return newPositions
      })
      setAvailableClubs((prev) => [...prev, club])
      setSelectedClub(null)
    } else {
      setSelectedClub(club)
    }
  }

  const resetPredictions = () => {
    setPositions({})
    setAvailableClubs(clubs)
    setSelectedClub(null)
  }

  const shuffleAvailable = () => {
    setAvailableClubs((prev) => [...prev].sort(() => Math.random() - 0.5))
  }

  const getFilledCount = () => Object.keys(positions).length

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 relative overflow-hidden">
      {/* Football Field Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-64 border-2 border-white/20 rounded-lg"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"></div>
      </div>

      {/* Premier League Logo */}
      <div className="absolute top-8 right-8 opacity-30 z-10 pointer-events-none">
        <img src="/premier-league-bg.png" alt="Premier League" className="w-32 h-32 object-contain" />
      </div>

      {/* Control Buttons */}
      <div className="absolute top-8 left-8 flex gap-4 z-50">
        <button
          onClick={resetPredictions}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw size={16} />
          Reset All
        </button>
        <button
          onClick={shuffleAvailable}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
        >
          <Shuffle size={16} />
          Shuffle
        </button>
        <div className="bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold pointer-events-none">
          {getFilledCount()}/20 Placed
        </div>
      </div>

      {/* Instructions */}
      {selectedClub && (
        <div className="absolute top-32 left-8 bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold shadow-lg z-50 flex items-center gap-2">
          <MousePointer size={16} />
          Click a position to place {selectedClub}
        </div>
      )}

      {/* Title */}
      <div className="text-center py-6 relative z-30">
        <h1 className="text-5xl font-bold text-white mb-2 tracking-wider drop-shadow-2xl">PREMIER LEAGUE</h1>
        <h2 className="text-2xl font-semibold text-yellow-400 tracking-wide drop-shadow-lg">
          2025/2026 SEASON PREDICTIONS
        </h2>
        <p className="text-white/80 text-sm mt-2">Click a team, then click a position to place it</p>
      </div>

      {/* Main Sections - Now 5 columns */}
      <div className="grid grid-cols-5 gap-4 px-6 mb-6 h-80 relative z-20">
        {sections.map((section) => (
          <div key={section.id} className="relative">
            <div className={`bg-gradient-to-b ${section.color} rounded-lg shadow-2xl border-2 border-white/20 h-full`}>
              {/* Felt texture overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.3)_100%)] rounded-lg"></div>

              <div className="relative z-10 p-3 h-full flex flex-col">
                <div className="text-center mb-3">
                  <h3 className="text-lg font-bold text-white drop-shadow-lg">{section.title}</h3>
                  <p className="text-xs text-white/80 font-medium">Positions {section.positions}</p>
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto">
                  {section.slots.map((position) => {
                    const club = positions[position]
                    const isClickable = selectedClub && !club
                    const canSwap = selectedClub && club && selectedClub !== club

                    return (
                      <div
                        key={position}
                        onClick={() => handlePositionClick(position)}
                        className={`flex items-center gap-2 min-h-[36px] rounded-lg border-2 transition-all duration-200 ${
                          isClickable || canSwap
                            ? "border-yellow-400 bg-yellow-400/20 cursor-pointer hover:bg-yellow-400/30"
                            : club
                              ? "border-white/30 bg-white/10"
                              : "border-white/20 bg-transparent hover:border-white/40"
                        } ${!selectedClub && club ? "cursor-pointer" : ""}`}
                      >
                        <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {position}
                        </div>
                        {club ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePositionedClubClick(club, position)
                            }}
                            className={`flex-1 bg-white/95 backdrop-blur-sm rounded-lg p-1.5 text-center text-xs font-semibold text-gray-800 shadow-lg transition-all duration-200 cursor-pointer ${
                              selectedClub === club
                                ? "ring-2 ring-yellow-400 bg-yellow-100 scale-105"
                                : "hover:bg-white hover:scale-102"
                            }`}
                          >
                            {club}
                          </div>
                        ) : (
                          <div className="flex-1 text-center text-xs text-white/50 py-1.5">
                            {isClickable
                              ? "Click to place here"
                              : `${position}${position === 1 ? "st" : position === 2 ? "nd" : position === 3 ? "rd" : "th"}`}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Available Clubs at Bottom */}
      <div className="px-6 mb-8">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg border-2 border-white/20 p-4">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            AVAILABLE CLUBS ({availableClubs.length} remaining)
          </h3>
          <div className="flex flex-wrap gap-3 justify-center min-h-[80px] rounded-lg border-2 border-dashed border-white/30 p-4">
            {availableClubs.map((club) => (
              <button
                key={club}
                onClick={() => handleClubClick(club)}
                className={`bg-gradient-to-r from-white to-gray-100 rounded-lg px-4 py-2 text-sm font-bold text-gray-800 shadow-lg cursor-pointer transition-all duration-200 ${
                  selectedClub === club
                    ? "ring-2 ring-yellow-400 bg-yellow-100 scale-105 from-yellow-100 to-yellow-200"
                    : "hover:scale-102 hover:shadow-xl hover:from-yellow-100 hover:to-yellow-200"
                }`}
              >
                {club}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premier League Information Section */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {premierLeagueStats.map((stat, index) => (
            <div key={index} className="bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 p-4 text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-white font-bold text-sm mb-2">{stat.label}</h4>
              <p className="text-white/70 text-xs leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Premier League Facts */}
        <div className="mt-6 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h3 className="text-white font-bold text-lg mb-4 text-center">2025/26 SEASON INFO</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">38</div>
              <div className="text-white/80 text-sm">Games per team</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">380</div>
              <div className="text-white/80 text-sm">Total matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">20</div>
              <div className="text-white/80 text-sm">Premier League clubs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-4 left-4 text-white/60 text-sm font-medium">
        Click teams, then click positions • Perfect for live streaming
      </div>
      <div className="absolute bottom-4 right-4 text-white/60 text-sm font-medium">Live Predictions Stream</div>
    </div>
  )
}
