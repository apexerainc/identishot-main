import React from 'react'
import Warning from '@components/DesignSystem/Alerts/Warning'
import { useRecoilState } from 'recoil'
import orgInfoState from '@atoms/orgInfoState'
import projectInfoState from '@atoms/projectInfoState'

const requiredAttributes = {
  name: 'Client name',
  location: 'Client address',
  insuranceClaimId: 'Insurance claim Id',
  insuranceCompanyName: 'Insurance carrier',
  adjusterName: 'Adjuster name',
  adjusterEmail: 'Adjuster email',
}

const requiredOrgAttributes = {
  name: 'Organization name',
  address: 'Organization address',
}
export default function MissingDataWarning() {
  const [projectInfo] = useRecoilState(projectInfoState)
  const [orgInfo] = useRecoilState(orgInfoState)

  const isMissingProjectInfo = Object.keys(requiredAttributes).find(
    (key) => !projectInfo[key as keyof typeof requiredAttributes]
  )
  const isMissingOrgInfo = Object.keys(requiredOrgAttributes).find(
    (key) => !orgInfo[key as keyof typeof requiredOrgAttributes]
  )
  return (
    <>
      {(isMissingProjectInfo || isMissingOrgInfo) && (
        <Warning title="Certain information about the project is missing. This can lead to an incomplete report.">
          <ul role="list" className="list-disc space-y-1 pl-5">
            {Object.keys(requiredAttributes).map((key) => {
              if (projectInfo[key as keyof typeof requiredAttributes]) return
              return (
                <li key={key}>
                  {requiredAttributes[key as keyof typeof requiredAttributes]}
                </li>
              )
            })}
            {Object.keys(requiredOrgAttributes).map((key) => {
              if (orgInfo[key as keyof typeof requiredOrgAttributes]) return
              return (
                <li key={key}>
                  {
                    requiredOrgAttributes[
                      key as keyof typeof requiredOrgAttributes
                    ]
                  }
                </li>
              )
            })}
          </ul>
        </Warning>
      )}
    </>
  )
}
