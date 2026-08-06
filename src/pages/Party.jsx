import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreatePartyRoom, useMyPartyRooms } from '../api/queries'
import { PartyPopper, Users, ArrowRight } from 'lucide-react'
import { money } from '../utils/money'

export default function Party() {
  const navigate = useNavigate()
  const createRoom = useCreatePartyRoom()
  const { data: myRooms } = useMyPartyRooms()

  const [name, setName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const room = await createRoom.mutateAsync({ name })
      navigate(`/party/${room.code}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create the room. Please try again.')
    }
  }

  const handleJoin = (e) => {
    e.preventDefault()
    const code = joinCode.trim().toUpperCase()
    if (code.length < 4) return setError('Enter the full room code.')
    navigate(`/party/${code}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="text-center">
        <PartyPopper className="w-12 h-12 text-primary mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-secondary mb-1">Party Order</h1>
        <p className="text-gray-500">
          Order together. Everyone adds what they want, you pay once.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-secondary mb-1">Start a party</h2>
        <p className="text-sm text-gray-500 mb-4">You'll get a code and link to share with your friends.</p>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Party name (optional) — e.g. Wing 3 Movie Night"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={createRoom.isPending}
            className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-deep transition disabled:opacity-50 whitespace-nowrap"
          >
            {createRoom.isPending ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-secondary mb-1">Join a party</h2>
        <p className="text-sm text-gray-500 mb-4">Got a code from a friend? Enter it here.</p>
        <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            placeholder="ABC123"
            maxLength={8}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="border border-primary text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition whitespace-nowrap"
          >
            Join Room
          </button>
        </form>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {myRooms?.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Your open parties</h2>
          <div className="space-y-3">
            {myRooms.map(room => (
              <button
                key={room.code}
                onClick={() => navigate(`/party/${room.code}`)}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:border-primary transition text-left"
              >
                <div>
                  <p className="font-bold text-secondary">{room.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Users className="w-3.5 h-3.5" />
                    {room.participants.length} {room.participants.length === 1 ? 'person' : 'people'} · {room.itemCount} items · ₹{money(room.subtotal)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-gray-400 tracking-widest">{room.code}</span>
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
