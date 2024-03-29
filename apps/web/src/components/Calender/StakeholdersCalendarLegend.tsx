import UserAvatar from '@components/DesignSystem/UserAvatar'
import { Stakeholders } from '@restorationx/db/queries/project/getUsersForProject'
import clsx from 'clsx'

const StakeholdersCalendarLegend = ({
  stakeholders,
}: {
  stakeholders: Stakeholders[]
}) => {
  if (!stakeholders) return null

  return (
    <div className="hidden sm:block">
      <div
        className={`relative flex h-full ${
          stakeholders.length > 0 &&
          'mr-36 h-4 min-h-[1rem] w-4 min-w-[1rem] sm:h-8 sm:min-h-[2rem] sm:w-8 sm:min-w-[2rem]'
        }`}
      >
        {stakeholders?.map((a, i) => (
          <div
            key={a.userId}
            className="h-full "
            style={{ left: `${i * 15}px` }}
          >
            <UserAvatar
              className={clsx(
                'h-4 min-h-[1rem] w-4 min-w-[1rem] sm:h-8 sm:min-h-[2rem] sm:w-8 sm:min-w-[2rem]'
              )}
              textSize="text-xs"
              userId={a.userId}
              firstName={a.user.firstName}
              lastName={a.user.lastName}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StakeholdersCalendarLegend
