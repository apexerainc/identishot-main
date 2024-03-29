/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Spinner from '@components/Spinner'
import placeHolderImage from '@images/placeholders/upload.jpeg'
import { useRecoilState } from 'recoil'
import uploadInProgressImagesState from '@atoms/uploadInProgressImagesState'

const OptimisticUploadUI = () => {
  const [uploadInProgressImages, setUploadInProgressImages] = useRecoilState(
    uploadInProgressImagesState
  )

  if (uploadInProgressImages.length === 0) return null
  return (
    <>
      <div className="rounded-m mt-8 md:text-base">
        <div className="flex justify-between pr-4 sm:items-center">
          <h1 className="flex text-2xl font-semibold text-gray-900">
            <span className="mr-4">Uploading Images</span>{' '}
            <Spinner fill="fill-gray-50" bg="text-primary" />
          </h1>
        </div>
        <div className="flex items-center">
          <div className="mt-4 flex w-full gap-6 overflow-x-auto">
            <div className={`flex w-full py-2`}>
              {uploadInProgressImages.map((image, index) => (
                <div key={index} className="group relative  px-4">
                  <div>
                    <div className="relative w-[150px]">
                      <img
                        src={image.path ? image.path : placeHolderImage.src}
                        className={
                          image.path
                            ? 'w-full animate-pulse rounded-md opacity-75'
                            : 'w-full animate-pulse rounded-md opacity-25 blur-sm'
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OptimisticUploadUI
