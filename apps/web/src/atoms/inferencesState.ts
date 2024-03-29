import { RoomData } from '@restorationx/db/queries/project/getProjectDetections'
import { atom } from 'recoil'

export const defaultInferencesState = []

const inferencesState = atom<RoomData[]>({
  key: 'InferencesState',
  default: defaultInferencesState,
})

export default inferencesState
