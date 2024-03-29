import { useId, useMemo, useState } from 'react'
import Select from 'react-select'
import roomState from '@atoms/roomState'
import SecondaryButton from '@components/DesignSystem/Buttons/SecondaryButton'
import EmptyState from '@components/DesignSystem/EmptyState'
import Pill from '@components/DesignSystem/Pills/Pill'
import Spinner from '@components/Spinner'
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline'
import { GroupByViews, PhotoViews } from '@restorationx/db'
import useFilterParams from '@utils/hooks/useFilterParams'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import inferencesState from '@atoms/inferencesState'
import uploadInProgressImagesState from '@atoms/uploadInProgressImagesState'

import OptimisticUploadUI from '../OptimisticUploadUI'

import FilterLabel from './FilterLabel'
import GroupByPicker from './GroupByPicker'
import PhotoList from './PhotoList'
import ViewPicker from './ViewPicker'

export default function MitigationTable({
  initialGroupView,
  initialPhotoView,
}: {
  initialGroupView: GroupByViews
  initialPhotoView: PhotoViews
}) {
  const [inferences, setInferences] = useRecoilState(inferencesState)
  const [uploadInProgressImages] = useRecoilState(uploadInProgressImagesState)
  const [isFilterOptionOpen, setIsFilterOptionOpen] = useState(false)
  const router = useRouter()
  const reactSelectId = useId()
  const [photoView, setPhotoView] = useState(initialPhotoView)
  const { rooms, onlySelected, sortDirection } = useFilterParams()

  const groupView = trpc.groupView.getGroupView.useQuery(undefined, {
    initialData: initialGroupView,
  })

  const query = trpc.inferences.getAll.useQuery(
    {
      projectPublicId: router.query.id as string,
      rooms,
      onlySelected,
      sortDirection,
    },
    {
      initialData: [],
      onSuccess: (data) => {
        // @ts-expect-error
        setInferences(data?.rooms || [])
      },
    }
  )

  const queryContext = {
    projectPublicId: router.query.id as string,
    rooms,
    onlySelected,
    sortDirection,
  }

  const getPhotos = trpc.photos.getProjectPhotos.useQuery(queryContext)

  const toggleFilterDrawer = () => {
    setIsFilterOptionOpen((prev) => !prev)
  }

  const setRoomFilter = (newRoomsFilter: string[]) => {
    const { rooms, ...rest } = router.query
    let newQuery: any = {
      ...router.query,
      rooms: JSON.stringify(newRoomsFilter),
    }
    if (newRoomsFilter.length === 0) {
      newQuery = rest
    }
    router.push({ query: newQuery }, undefined, { shallow: true })
  }

  const setSortDirection = () => {
    router.push(
      {
        query: {
          ...router.query,
          sortDirection: sortDirection === 'asc' ? 'desc' : 'asc',
        },
      },
      undefined,
      { shallow: true }
    )
  }

  const setOnlySelected = (checked: boolean) => {
    const { onlySelected, ...rest } = router.query
    if (!checked) {
      router.push({ query: { ...rest } }, undefined, { shallow: true })
      return
    }
    router.push(
      {
        query: {
          ...router.query,
          onlySelected: true,
        },
      },
      undefined,
      { shallow: true }
    )
  }

  const [roomList] = useRecoilState(roomState)

  const roomsOptions = useMemo(
    () =>
      roomList.map((room) => ({
        label: room.name,
        value: room.name,
      })),
    [roomList]
  )

  const defaultRooms = useMemo(
    () =>
      rooms
        ? rooms.map((room) => ({
            label: room,
            value: room,
          }))
        : [],
    [rooms]
  )

  return (
    <div className="space-y-6">
      <div className="mt-6">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div>
              <FilterLabel>Filters</FilterLabel>
              <SecondaryButton onClick={() => toggleFilterDrawer()}>
                <AdjustmentsHorizontalIcon className="mr-2 h-5" />
                Filter{' '}
                {(rooms || onlySelected) && (
                  <Pill className="ml-2" color="green" size="xs">
                    {onlySelected && rooms ? 2 : 1}
                  </Pill>
                )}
              </SecondaryButton>
            </div>
            <div>
              <FilterLabel>Sort</FilterLabel>
              <SecondaryButton onClick={() => setSortDirection()}>
                {sortDirection === 'desc' || !sortDirection ? (
                  <ChevronDownIcon className="mr-2 h-5" />
                ) : (
                  <ChevronUpIcon className="mr-2 h-5" />
                )}
                Sort
              </SecondaryButton>
            </div>
            <ViewPicker photoView={photoView} setPhotoView={setPhotoView} />
            <GroupByPicker />
          </div>
          {query.isFetching && <Spinner bg="text-gray-50" />}
        </div>
        {isFilterOptionOpen && (
          <div className="mt-6">
            <div className="max-w-lg">
              <label className="mb-2">Filter by rooms</label>
              <Select
                instanceId={reactSelectId}
                options={roomsOptions}
                isMulti
                defaultValue={defaultRooms}
                onChange={(newValue) =>
                  setRoomFilter(newValue.map((value) => value.value))
                }
                styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
            <div className="mt-4 max-w-lg">
              <label>Only show photos included in report</label>
              <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="ml-4 h-4 w-4 rounded border-gray-300 text-primary focus:ring-blue-500"
                onChange={(e) => setOnlySelected(e.target.checked)}
                {...(onlySelected && { checked: true })}
              />
            </div>
          </div>
        )}
      </div>
      <div className="my-6">
        <OptimisticUploadUI />
        <PhotoList
          photos={getPhotos.data ? getPhotos.data.images : []}
          queryContext={queryContext}
          groupBy={groupView.data?.groupView || GroupByViews.dateView}
          photoView={photoView}
        />
        {getPhotos.data &&
          getPhotos.data.images.length === 0 &&
          !rooms &&
          !onlySelected &&
          !uploadInProgressImages?.length && (
            <EmptyState
              imagePath={'/images/no-uploads.svg'}
              title={'Get started by uploading photos'}
              description={
                'Once uploaded, we will sort your photos by room as well as identify items within each picture.'
              }
            />
          )}
      </div>
    </div>
  )
}
