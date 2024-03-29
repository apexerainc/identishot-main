import EmptyState from '@components/DesignSystem/EmptyState'
import AutoSaveTextInput from '@components/DesignSystem/TextInput/AutoSaveTextInput'
import { AffectedAreaData } from '@restorationx/db/queries/room/updateOrCreateRoomAffectedArea'
import { AreaAffectedType } from '@restorationx/db'
import produce from 'immer'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import roomState from '@atoms/roomState'
import { v4 as uuidv4 } from 'uuid'

import TabTitleArea from '../TabTitleArea'

import AreasAffected from './AreasAffected'
import Dimensions from './Dimensions'
import FloorMaterial from './FloorMaterial'
import WallMaterial from './WallMaterial'

const areaAffectedTitle = {
  wall: 'Walls',
  floor: 'Floor',
  ceiling: 'Ceiling',
}

export default function Scope() {
  const [rooms, setRooms] = useRecoilState(roomState)
  const router = useRouter()

  const saveAffectedArea = async (
    data: AffectedAreaData,
    type: AreaAffectedType,
    roomId: string
  ) => {
    const oldState = rooms
    setRooms((prevRooms) => {
      const nextState = produce(prevRooms, (draft) => {
        const roomIndex = prevRooms.findIndex((r) => r.publicId === roomId)
        const affectedAreaIndex = draft[roomIndex].areasAffected.findIndex(
          (t) => t.type === type
        )
        if (affectedAreaIndex === -1) {
          draft[roomIndex].areasAffected.push({
            type,
            ...data,
            publicId: uuidv4(),
            isDeleted: false,
          })
        } else {
          draft[roomIndex].areasAffected[affectedAreaIndex] = {
            ...draft[roomIndex].areasAffected[affectedAreaIndex],
            ...data,
          }
        }
        return draft
      })
      return nextState
    })
    try {
      const res = await fetch(
        `/api/project/${router.query.id}/room-affected-area`,
        {
          method: 'POST',
          body: JSON.stringify({
            roomId,
            affectedAreaData: data,
            type,
          }),
        }
      )

      if (!res.ok) {
        setRooms(oldState)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <TabTitleArea
        title="Scope Details"
        description="Enter room dimensions, number of windows and doors, as well as document affected areas."
      />
      {rooms.length === 0 && (
        <EmptyState
          imagePath={'/images/empty.svg'}
          title={'No Rooms Added'}
          description={
            'Get started by adding rooms. Scope details can be added for each room'
          }
        />
      )}
      {rooms.map((room) => (
        <div key={room.publicId} className="mb-12">
          <h1 className="mt-8 text-2xl font-semibold text-gray-900">
            {room.name}
          </h1>
          <Dimensions room={room} />
          <div className="mt-4 grid grid-cols-3  gap-x-2">
            <AreasAffected
              setAffectedAreas={(s, isDeleted) =>
                saveAffectedArea({ isDeleted }, s, room.publicId)
              }
              affectedAreas={room.areasAffected}
            />
          </div>
          {room.areasAffected.map((areaAffected) => {
            if (areaAffected.isDeleted) return null
            return (
              <div
                key={areaAffected.publicId}
                className="mt-4 border-l-2 border-gray-300 pl-4"
              >
                <h2 className="mt-4 text-lg font-medium">
                  {areaAffectedTitle[areaAffected.type]}
                </h2>
                <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-2">
                  {areaAffected.type === 'wall' && (
                    <WallMaterial
                      defaultValue={areaAffected.material || ''}
                      onChange={(material) =>
                        saveAffectedArea(
                          { material },
                          areaAffected.type,
                          room.publicId
                        )
                      }
                    />
                  )}
                  {areaAffected.type === 'floor' && (
                    <FloorMaterial
                      defaultValue={areaAffected.material || ''}
                      onChange={(material) =>
                        saveAffectedArea(
                          { material },
                          areaAffected.type,
                          room.publicId
                        )
                      }
                    />
                  )}
                  <AutoSaveTextInput
                    className="col-span-1"
                    defaultValue={areaAffected.totalAreaRemoved || ''}
                    placeholder="--"
                    onSave={(totalAreaRemoved) =>
                      saveAffectedArea(
                        { totalAreaRemoved },
                        areaAffected.type,
                        room.publicId
                      )
                    }
                    name="totalAreaRemoved"
                    title="Total Area Removed"
                    units="sqft"
                    ignoreInvalid
                  />
                  <AutoSaveTextInput
                    className="col-span-1"
                    defaultValue={areaAffected.totalAreaMicrobialApplied || ''}
                    placeholder="--"
                    type="number"
                    onSave={(totalAreaMicrobialApplied) =>
                      saveAffectedArea(
                        { totalAreaMicrobialApplied },
                        areaAffected.type,
                        room.publicId
                      )
                    }
                    name="totalAreaApplied"
                    title="Total Area Anti-Microbial Applied"
                    units="sqft"
                    ignoreInvalid
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-2">
                  {areaAffected.type === 'wall' && (
                    <AutoSaveTextInput
                      className="col-span-1"
                      defaultValue={areaAffected.cabinetryRemoved || ''}
                      placeholder="--"
                      type="number"
                      onSave={(cabinetryRemoved) =>
                        saveAffectedArea(
                          { cabinetryRemoved },
                          areaAffected.type,
                          room.publicId
                        )
                      }
                      name="cabinetryremoved"
                      title="Cabinetry Removed"
                      units="LF"
                      ignoreInvalid
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
