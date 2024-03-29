import { Stakeholders } from '@restorationx/db/queries/project/getUsersForProject'
import { atom } from 'recoil'

export const defaultStakeholderState = []

const stakeholderState = atom<Stakeholders[]>({
  key: 'StakeholderState',
  default: defaultStakeholderState,
})

export default stakeholderState
