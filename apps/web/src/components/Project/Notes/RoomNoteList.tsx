import EmptyState from '@components/DesignSystem/EmptyState'
import { useRecoilState } from 'recoil'
import roomState from '@atoms/roomState'

import NoteList from './NoteList.tsx'

export default function RoomNoteList() {
  const [rooms, setRooms] = useRecoilState(roomState)

  return (
    <div className=" space-y-6 divide-y-2">
      {rooms.length === 0 ? (
        <EmptyState
          imagePath={'/images/empty.svg'}
          title={'No Rooms Added'}
          description={
            'Get started by adding rooms. Humidity, temperature, and gpp data can be associated with each room'
          }
        />
      ) : (
        <>
          {rooms.map((room) => (
            <NoteList key={room.publicId} room={room} setRooms={setRooms} />
          ))}
        </>
      )}
    </div>
  )
}
