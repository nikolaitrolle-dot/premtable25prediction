"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { RotateCcw, Shuffle, Trophy, Target, Users, Calendar } from "lucide-react"

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
  {
    id: "top4",
    title: "TOP 4",
    color: "bg-gradient-to-b from-blue-500 to-blue-600",
    positions: "1-4",
    slots: [1, 2, 3, 4],
    description: "Champions League",
  },
  {
    id: "europe",
    title: "EUROPE",
    color: "bg-gradient-to-b from-orange-400 to-orange-500",
    positions: "5-7",
    slots: [5, 6, 7],
    description: "Europa & Conference",
  },
  {
    id: "uppermid",
    title: "UPPER MID",
    color: "bg-gradient-to-b from-emerald-500 to-emerald-600",
    positions: "8-12",
    slots: [8, 9, 10, 11, 12],
    description: "Safe Mid-Table",
  },
  {
    id: "lowermid",
    title: "LOWER MID",
    color: "bg-gradient-to-b from-yellow-500 to-yellow-600",
    positions: "13-17",
    slots: [13, 14, 15, 16, 17],
    description: "Lower Mid-Table",
  },
  {
    id: "relegation",
    title: "RELEGATION",
    color: "bg-gradient-to-b from-red-500 to-red-600",
    positions: "18-20",
    slots: [18, 19, 20],
    description: "Championship",
  },
]

const premierLeagueStats = [
  { icon: Trophy, label: "Champions League", description: "Top 4 qualify for UCL group stage", color: "text-blue-300" },
  { icon: Target, label: "Europa League", description: "5th place enters Europa League", color: "text-orange-300" },
  { icon: Users, label: "Conference League", description: "6th/7th may qualify for UECL", color: "text-emerald-300" },
  { icon: Calendar, label: "Relegation", description: "Bottom 3 drop to Championship", color: "text-red-300" },
]

export default function PremierLeaguePredictions() {
  const [positions, setPositions] = useState<{ [key: number]: string }>({})
  const [availableClubs, setAvailableClubs] = useState(clubs)

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    const clubName = draggableId

    // If dragging from available clubs
    if (source.droppableId === "available") {
      // If dropping to a position slot
      if (destination.droppableId.startsWith("position-")) {
        const position = Number.parseInt(destination.droppableId.split("-")[1])

        // If position is already occupied, swap the clubs
        if (positions[position]) {
          const existingClub = positions[position]
          setAvailableClubs((prev) => [...prev.filter((club) => club !== clubName), existingClub])
          setPositions((prev) => ({ ...prev, [position]: clubName }))
        } else {
          // Place club in empty position
          setAvailableClubs((prev) => prev.filter((club) => club !== clubName))
          setPositions((prev) => ({ ...prev, [position]: clubName }))
        }
      }
    }
    // If dragging from a position slot
    else if (source.droppableId.startsWith("position-")) {
      const sourcePosition = Number.parseInt(source.droppableId.split("-")[1])

      // If dropping to available clubs
      if (destination.droppableId === "available") {
        setPositions((prev) => {
          const newPositions = { ...prev }
          delete newPositions[sourcePosition]
          return newPositions
        })
        setAvailableClubs((prev) => [...prev, clubName])
      }
      // If dropping to another position slot
      else if (destination.droppableId.startsWith("position-")) {
        const destPosition = Number.parseInt(destination.droppableId.split("-")[1])

        if (positions[destPosition]) {
          // Swap clubs
          const destClub = positions[destPosition]
          setPositions((prev) => ({
            ...prev,
            [sourcePosition]: destClub,
            [destPosition]: clubName,
          }))
        } else {
          // Move to empty position
          setPositions((prev) => {
            const newPositions = { ...prev }
            delete newPositions[sourcePosition]
            newPositions[destPosition] = clubName
            return newPositions
          })
        }
      }
    }
  }

  const resetPredictions = () => {
    setPositions({})
    setAvailableClubs(clubs)
  }

  const shuffleAvailable = () => {
    setAvailableClubs((prev) => [...prev].sort(() => Math.random() - 0.5))
  }

  const getFilledCount = () => Object.keys(positions).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-cyan-400 relative overflow-hidden">
      {/* Premier League Logo - Positioned like in the original */}
      <div className="absolute top-16 right-16 opacity-40 pointer-events-none z-10">
        <img src="/premier-league-logo.png" alt="Premier League" className="w-48 h-48 object-contain" />
      </div>

      {/* Subtle football field pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative z-20 pt-8 pb-8">
        {/* Control Buttons */}
        <div className="flex gap-4 px-8 mb-8">
          <button
            onClick={resetPredictions}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <RotateCcw size={18} />
            Reset All
          </button>
          <button
            onClick={shuffleAvailable}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 flex items-center gap-2"
          >
            <Shuffle size={18} />
            Shuffle
          </button>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white border-opacity-20">
            {getFilledCount()}/20 Placed
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-3 tracking-wider drop-shadow-2xl">PREMIER LEAGUE</h1>
          <h2 className="text-3xl font-semibold text-yellow-300 tracking-wide mb-2 drop-shadow-lg">
            2025/2026 SEASON PREDICTIONS
          </h2>
          <p className="text-white text-opacity-90 text-lg drop-shadow">Drag teams to predict final table positions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 px-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Prediction Sections */}
          <div className="grid grid-cols-5 gap-6 mb-12">
            {sections.map((section) => (
              <div key={section.id} className="h-96">
                <div
                  className={`${section.color} rounded-2xl shadow-2xl border border-white border-opacity-20 h-full p-4`}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow">{section.title}</h3>
                    <p className="text-sm text-white text-opacity-90 font-medium mb-1">Positions {section.positions}</p>
                    <p className="text-xs text-white text-opacity-80">{section.description}</p>
                  </div>

                  <div className="space-y-2 h-72 overflow-y-auto">
                    {section.slots.map((position) => {
                      const club = positions[position]
                      return (
                        <Droppable key={position} droppableId={`position-${position}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[44px] rounded-xl border-2 border-dashed transition-all duration-200 ${
                                snapshot.isDraggingOver
                                  ? "border-yellow-300 bg-yellow-300 bg-opacity-20 scale-105"
                                  : club
                                    ? "border-white border-opacity-40 bg-white bg-opacity-15"
                                    : "border-white border-opacity-25 hover:border-opacity-40"
                              }`}
                            >
                              <div className="flex items-center gap-3 p-2">
                                <div className="w-8 h-8 bg-white bg-opacity-25 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                  {position}
                                </div>
                                {club ? (
                                  <Draggable draggableId={club} index={0}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`flex-1 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-3 text-center text-sm font-semibold text-slate-800 shadow-lg cursor-grab transition-all duration-200 ${
                                          snapshot.isDragging
                                            ? "shadow-2xl scale-105"
                                            : "hover:shadow-xl hover:bg-opacity-95"
                                        }`}
                                      >
                                        {club}
                                      </div>
                                    )}
                                  </Draggable>
                                ) : (
                                  <div className="flex-1 text-center text-sm text-white text-opacity-60 py-3">
                                    {position}
                                    {position === 1 ? "st" : position === 2 ? "nd" : position === 3 ? "rd" : "th"} place
                                  </div>
                                )}
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Available Clubs - Much more subtle */}
          <div className="mb-12">
            <div className="bg-white bg-opacity-5 backdrop-blur-md rounded-2xl border border-white border-opacity-10 p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center drop-shadow">
                AVAILABLE CLUBS ({availableClubs.length} remaining)
              </h3>
              <Droppable droppableId="available" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-wrap gap-4 justify-center min-h-[100px] rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
                      snapshot.isDraggingOver
                        ? "border-yellow-300 bg-yellow-300 bg-opacity-10 scale-102"
                        : "border-white border-opacity-20"
                    }`}
                  >
                    {availableClubs.map((club, index) => (
                      <Draggable key={club} draggableId={club} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white bg-opacity-85 backdrop-blur-sm rounded-xl px-5 py-3 text-sm font-bold text-slate-800 shadow-lg cursor-grab transition-all duration-200 ${
                              snapshot.isDragging
                                ? "shadow-2xl scale-110 bg-opacity-95"
                                : "hover:shadow-xl hover:scale-105 hover:bg-opacity-90"
                            }`}
                          >
                            {club}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>

        {/* Premier League Information - Much more subtle */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {premierLeagueStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-5 backdrop-blur-md rounded-2xl border border-white border-opacity-10 p-6 text-center shadow-xl hover:bg-opacity-8 transition-all"
            >
              <div className="flex justify-center mb-4">
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2 drop-shadow">{stat.label}</h4>
              <p className="text-white text-opacity-80 text-sm leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Season Info - Much more subtle */}
        <div className="bg-white bg-opacity-5 backdrop-blur-md rounded-2xl border border-white border-opacity-10 p-8 mb-8 shadow-xl">
          <h3 className="text-white font-bold text-2xl mb-6 text-center drop-shadow">2025/26 SEASON INFO</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-5 rounded-xl p-6">
              <div className="text-4xl font-bold text-yellow-300 mb-2 drop-shadow">38</div>
              <div className="text-white text-opacity-90 text-lg">Games per team</div>
            </div>
            <div className="bg-white bg-opacity-5 rounded-xl p-6">
              <div className="text-4xl font-bold text-yellow-300 mb-2 drop-shadow">380</div>
              <div className="text-white text-opacity-90 text-lg">Total matches</div>
            </div>
            <div className="bg-white bg-opacity-5 rounded-xl p-6">
              <div className="text-4xl font-bold text-yellow-300 mb-2 drop-shadow">20</div>
              <div className="text-white text-opacity-90 text-lg">Premier League clubs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 relative z-20">
        <p className="text-white text-opacity-80 text-lg drop-shadow">
          Drag clubs to any position • Perfect for live streaming
        </p>
      </div>
    </div>
  )
}
