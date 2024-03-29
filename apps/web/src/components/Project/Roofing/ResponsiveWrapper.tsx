// @ts-ignore - no types
import toast from 'react-hot-toast'
import orgInfoState from '@atoms/orgInfoState'
import { FileObject } from '@supabase/storage-js'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import projectFiles from '@atoms/projectFilesState'
import projectInfoState from '@atoms/projectInfoState'
import FileList from '@components/Project/Files/FileList'
import PrimaryButton from '@components/DesignSystem/Buttons/PrimaryButton'
import MainContent from '@components/layouts/MainContent'
import { json } from 'micro'
import subscriptionStatusState from '@atoms/subscriptionStatusState'
import { SubscriptionStatus } from '@restorationx/db'
import UpgradeModal from '@components/UpgradeModal'
import { useState } from 'react'
import PrimaryLink from '@components/DesignSystem/Links/PrimaryLink'
import SecondaryButton from '@components/DesignSystem/Buttons/SecondaryButton'
import clsx from 'clsx'
import userInfoState from '@atoms/userInfoState'

export interface ProjectData {
  roofSegments?: string[]
  roofSpecs?: {
    roofPitch: string
  }
}
function downloadFile(file: File) {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = URL.createObjectURL(file)
  link.download = file.name

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link)
  link.click()

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href)
    // @ts-expect-error
    link.parentNode.removeChild(link)
  }, 0)
}
const ResponsiveWrapper = ({ accessToken }: { accessToken: string }) => {
  const router = useRouter()
  const [files, setFiles] = useRecoilState(projectFiles)
  const [orgInfo] = useRecoilState(orgInfoState)
  const [userInfo] = useRecoilState(userInfoState)
  const [subscriptionStatus] = useRecoilState(subscriptionStatusState)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  // check if a file name has the word 'roof' in it if so it is a roof report
  const roofReportFiles = files.filter((file) =>
    file.name.toLowerCase().includes('roof')
  )
  const hasRoofReport = roofReportFiles.length > 0

  const [projectInfo, setProjectInfo] = useRecoilState(projectInfoState)

  const onDownload = async (file: FileObject, url: string) => {
    try {
      console.log(url)
      const res = await fetch(url)
      if (res.ok) {
        const blob = await res.blob()
        downloadFile(
          new File([blob], file.name, { type: file.metadata.mimetype })
        )
      }
    } catch (e) {
      console.error(e)
    }
  }
  const onDelete = async (file: FileObject) => {
    try {
      const res = await fetch(`/api/project/${router.query.id}/file`, {
        method: 'DELETE',
        body: JSON.stringify({
          filename: `${orgInfo?.publicId}/${router.query.id}/${file.name}`,
        }),
      })
      if (res.ok) {
        setFiles((oldFiles) => oldFiles.filter((f) => f.name !== file.name))
        toast.success('File deleted')
      } else {
        console.error(res)
        toast.error('Could not delete file.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Could not delete file.')
    }
  }

  const sendRoofRequest = async () => {
    if (subscriptionStatus !== SubscriptionStatus.active) {
      setUpgradeModalOpen(true)
      return
    }

    try {
      if (process.env.NODE_ENV === 'production') {
        // invoke post request to /api/tickets to create a new ticket
        const ticketRes = await fetch(`/api/tickets/create`, {
          method: 'POST',
          body: JSON.stringify({
            project: router.query.id,
            client_address: projectInfo.location,
            customer_name: orgInfo.name,
            subscription_status: subscriptionStatus,
            customer_email: userInfo?.email,
            report_type: 'free', // this block is for free reports
            support_email: `support+${orgInfo.publicId}@restorationx.app`,
          }),
        })
        if (ticketRes.ok) {
          console.log(ticketRes.body)
          console.log('Request sent')
        } else {
          console.log('Request failed')
          console.error(ticketRes)
        }


        const supportemail = encodeURIComponent(
          `support+${orgInfo.publicId}@restorationx.app`
        )
        const res = await fetch(
          'https://hooks.slack.com/services/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',
          {
            method: 'POST',
            body: JSON.stringify({
              text: `You have a new roof request at use your superadmin login to complete the request`,
              blocks: [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `(free) New roof request for ${projectInfo.location}\n\n<https://www.restorationx.app/projects/${router.query.id}/roofing|View Roof>`,
                  },
                },
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: 'Login with the support account',
                  },
                  accessory: {
                    type: 'button',
                    text: {
                      type: 'plain_text',
                      text: 'Login',
                      emoji: true,
                    },
                    value: 'login',
                    url: `https://www.restorationx.app/login?email=${supportemail}&redirect_type=roof`,
                    action_id: 'login',
                  },
                },
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: 'Once completed, make sure to mark this request as completed by checking the box below',
                  },
                  accessory: {
                    type: 'checkboxes',
                    options: [
                      {
                        text: {
                          type: 'mrkdwn',
                          text: '*Completed*',
                        },
                        description: {
                          type: 'mrkdwn',
                          text: '*Mark as completed*',
                        },
                        value: 'completed',
                      },
                    ],
                    action_id: 'checkboxes-action',
                  },
                },
              ],
            }),
          }
        )
      }
      toast.success(
        'Roof request sent. We will notify you when the report is ready via email.'
      )
    } catch (e) {
      toast.error(
        'Roof report request failed. If the error persists please contact support@restorationx.app'
      )
    }
  }
  return (
    <>
      <div className="grid grid-rows-1 pt-2">
        <UpgradeModal open={upgradeModalOpen} setOpen={setUpgradeModalOpen} />

        {hasRoofReport ? (
          <div className="">
            <div className="my-2">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Your roof report is ready to download
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <FileList
                files={files}
                onDownload={onDownload}
                onDelete={onDelete}
                roofReport={true}
              />
            </div>
          </div>
        ) : (
          <MainContent>
            <div className="mb-4 flex justify-between space-x-6">
              <div className="max-w-[220px] sm:max-w-none sm:flex-auto">
                <div className="col-span-2 flex-col">
                  <h3 className="text-2xl font-medium leading-6 text-gray-900">
                    Roof report
                  </h3>
                  <p className="mt-2 pr-8 text-base text-gray-500">
                    Create a roof report for this project.
                  </p>
                </div>
              </div>
              <div className="flex min-w-[100px] flex-row items-center justify-end space-x-6">
                <PrimaryButton
                  onClick={() => {
                    sendRoofRequest()
                  }}
                >
                  Request Free Report
                </PrimaryButton>
                <form
                  action="/api/create-one-time-checkout-session"
                  method="POST"
                >
                  <input
                    type="hidden"
                    name="priceId"
                    value={
                      subscriptionStatus !== SubscriptionStatus.active
                        ? 'oneTimeRoofPurchaseFree'
                        : 'oneTimeRoofPurchasePro'
                    }
                  />
                  <input
                    type="hidden"
                    name="projectId"
                    value={router.query.id}
                  />
                  <input
                    type="hidden"
                    name="client_address"
                    value={projectInfo.location}
                  />
                  <input
                    type="hidden"
                    name="customer_name"
                    value={orgInfo.name}
                  />
                  <input
                    type="hidden"
                    name="subscription_status"
                    value={subscriptionStatus}
                  />
                  <input
                    type="hidden"
                    name="customer_email"
                    value={userInfo?.email}
                  />
                  <input
                    type="hidden"
                    name="support_email"
                    value={`support+${orgInfo.publicId}@restorationx.apps`}
                  />
                  <PrimaryButton type="submit">
                    Purchase ESX Report
                  </PrimaryButton>
                </form>
              </div>
            </div>
            <iframe
              scrolling="true"
              style={{ height: 'calc(100vh - 10rem)' }}
              src={`https://rapi-d-halo-ai.vercel.app/#background=Bing&datasets=fbRoads,msBuildings&disable_features=boundaries&map=21/${projectInfo.lat}/${projectInfo.lng}`}
            ></iframe>
          </MainContent>
        )}
      </div>
    </>
  )
}

export default ResponsiveWrapper
