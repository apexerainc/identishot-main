import { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import PrimaryButton from '@components/DesignSystem/Buttons/PrimaryButton'
import TertiaryButton from '@components/DesignSystem/Buttons/TertiaryButton'
import Spinner from '@components/Spinner'
import { CameraIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useRouter } from 'next/router'

const videoConstraints = {
  facingMode: { exact: 'environment' },
  //   facingMode: 'user', // Desktop Testing
}

const Toolbar = ({
  getScreenshot,
  isMobile,
}: {
  getScreenshot: (screenshotDimensions?: any) => string | null
  isMobile: boolean
}) => {
  const [processingImagesCount, setProcessingImagesCount] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const [animating, setIsAnimating] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [flashOn, setFlashOn] = useState(false)
  const router = useRouter()
  const webcamRef = useRef<Webcam>(null)

  const processImage = (url: string) => {
    setProcessingImagesCount((prevCount) => prevCount + 1)
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'File name', { type: 'image/png' })
        const body = new FormData()
        body.append('file', file)
        return fetch(`/api/resize?id=${router.query.id}`, {
          method: 'POST',
          body,
        })
      })
      .finally(() => {
        setProcessingImagesCount((prevCount) => prevCount - 1)
      })
  }
  const onClick = () => {
    const imageSrc = getScreenshot()
    if (imageSrc) {
      processImage(imgSrc)
      setIsAnimating(true)
      setImgSrc(imageSrc)
    }
  }

  const closeCamera = () => {
    setIsClosing(true)
  }

  const toggleFlash = () => {
    setFlashOn((prevState) => !prevState)
    webcamRef.current?.video?.setVideoConstraints({
      ...videoConstraints,
      torch: !flashOn,
    })
  }

  useEffect(() => {
    if (isClosing && processingImagesCount <= 0) {
      router.push(`/projects/${router.query.id}/mitigation`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingImagesCount, isClosing])

  return (
    <>
      {isClosing && (
        <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-80 text-white">
          <div className="flex">
            <h2 className="mr-4 text-xl font-bold"> Uploading Images</h2>
            <Spinner />
          </div>
          <div className="flex">
            <h2 className="mr-4 text-lg">
              {processingImagesCount} image(s) remaining
            </h2>
          </div>
        </div>
      )}
      <div
        className={clsx(
          'fixed bottom-0 z-10 grid w-full grid-cols-5 bg-black bg-opacity-80 px-4 py-4 ',
          isClosing && 'opacity-50'
        )}
      >
        <div className="flex items-center justify-center  ">
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <img
              src={imgSrc}
              className="col-span-1 h-full w-full rounded-md border-2 border-white"
            />
            <div
              onAnimationEnd={() => setIsAnimating(false)}
              className={clsx(
                'absolute top-0 left-0 h-full w-full bg-white opacity-0',
                animating && 'animate-camera-flash'
              )}
              style={{ display: flashOn ? 'block' : 'none' }}
            />
          </div>
        </div>
        <div className="col-span-3 flex items-center justify-center">
          <PrimaryButton
            className=" h-20 w-20 rounded-full px-4 py-4  shadow-lg sm:w-20"
            onClick={() => onClick()}
            disabled={isClosing}
          >
            <CameraIcon className="h-12" />
          </PrimaryButton>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          {isMobile && (
            <TertiaryButton
              className="!text-white"
              onClick={() => toggleFlash()}
              disabled={isClosing}
            >
              {flashOn ? 'Flash On' : 'Flash Off'}
            </TertiaryButton>
          )}
        </div>
        <TertiaryButton
          className="col-span-1 !text-white"
          onClick={() => closeCamera()}
          disabled={isClosing}
        >
          Close
        </TertiaryButton>
      </div>
    </>
  )
}

const Camera = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    )
  }, [])

  return (
    <div className="absolute top-0 left-0 bottom-0 h-full w-full overflow-hidden bg-black">
      <Webcam
        audio={false}
        screenshotFormat="image/png"
        className="absolute top-1/2 left-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2  -translate-y-1/2"
        videoConstraints={videoConstraints}
        screenshotQuality={0.8}
        ref={webcamRef}
      >
        {/* @ts-expect-error */}
        {({ getScreenshot }) => (
          <Toolbar getScreenshot={getScreenshot} isMobile={isMobile} />
        )}
      </Webcam>
    </div>
  )
}

export default Camera
