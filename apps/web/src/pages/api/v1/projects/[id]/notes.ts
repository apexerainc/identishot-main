import createRoomNote from '@restorationx/db/queries/room/notes/createRoomNote'
import deleteRoomNote from '@restorationx/db/queries/room/notes/deleteRoomNote'
import updateRoomNote from '@restorationx/db/queries/room/notes/updateRoomNote'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

const handlePatch = async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = req.headers
  const jwt = headers['auth-token']
  if (!jwt || Array.isArray(jwt)) {
    res.status(500).json({ status: 'Missing token' })
    return
  }
  if (!req.query.id || Array.isArray(req.query.id)) {
    res.status(500).json({ status: 'Invalid id' })
    return
  }
  const supabase = createServerSupabaseClient({
    req,
    res,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser(jwt)
  if (!user) {
    console.error('Session does not exist.')
    res.status(500).json({ status: 'failed' })
    return
  }

  const body = JSON.parse(req.body)
  const id = req.query.id
  if (Array.isArray(id) || !id) {
    res.status(400).json({ status: 'failed', reason: 'invalid query param' })
    return
  }

  try {
    if (!body.body) {
      res.status(500).json({ status: 'failed' })
      return
    }
    const result = await updateRoomNote(
      user.id,
      id,
      body.roomId,
      body.noteId,
      body.body
    )
    // @ts-expect-error
    if (result?.failed) {
      console.log(result)
      res.status(500).json({ status: 'failed' })
      return
    }
    res.status(200).json({ status: 'ok', result })
    return
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 'failed' })
    return
  }
}
const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = req.headers
  const jwt = headers['auth-token']
  if (!jwt || Array.isArray(jwt)) {
    res.status(500).json({ status: 'Missing token' })
    return
  }
  if (!req.query.id || Array.isArray(req.query.id)) {
    res.status(500).json({ status: 'Invalid id' })
    return
  }
  const supabase = createServerSupabaseClient({
    req,
    res,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser(jwt)
  if (!user) {
    console.error('Session does not exist.')
    res.status(500).json({ status: 'failed' })
    return
  }

  const body = req.body
  const id = req.query.id
  const roomId = req.query.roomId || ''

  if (Array.isArray(id) || !id) {
    res.status(400).json({ status: 'failed', reason: 'invalid query param' })
    return
  }

  try {
    // @ts-expect-error
    const result = await createRoomNote(user.id, id, roomId, body.body)
    console.log('room created', result)
    // @ts-expect-error
    if (result?.failed) {
      console.log(result)
      res.status(500).json({ status: 'failed' })
      return
    }
    res.status(200).json({ status: 'ok', result })
    return
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 'failed' })
    return
  }
}
const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = req.headers
  const jwt = headers['auth-token']
  if (!jwt || Array.isArray(jwt)) {
    res.status(500).json({ status: 'Missing token' })
    return
  }
  if (!req.query.id || Array.isArray(req.query.id)) {
    res.status(500).json({ status: 'Invalid id' })
    return
  }
  const supabase = createServerSupabaseClient({
    req,
    res,
  })

  const {
    data: { user },
  } = await supabase.auth.getUser(jwt)
  if (!user) {
    console.error('Session does not exist.')
    res.status(500).json({ status: 'failed' })
    return
  }

  const body = JSON.parse(req.body)
  const id = req.query.id
  if (Array.isArray(id) || !id) {
    res.status(400).json({ status: 'failed', reason: 'invalid query param' })
    return
  }

  try {
    const result = await deleteRoomNote(user.id, id, body.roomId, body.noteId)
    // @ts-expect-error
    if (result?.failed) {
      console.log(result)
      res.status(500).json({ status: 'failed' })
      return
    }
    res.status(200).json({ status: 'ok' })
    return
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: 'failed' })
    return
  }
}
export default async function ProtectedRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PATCH') await handlePatch(req, res)
  else if (req.method === 'POST') await handlePost(req, res)
  else if (req.method === 'DELETE') await handleDelete(req, res)
  else res.status(405).json({ Error: `Operation ${req.method} not allowed` })
  return
}
