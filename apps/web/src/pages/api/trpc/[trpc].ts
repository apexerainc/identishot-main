import { createNextApiHandler } from '@trpc/server/adapters/next'

import { appRouter, createContext } from '@restorationx/api'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`)
        }
      : undefined,
})
