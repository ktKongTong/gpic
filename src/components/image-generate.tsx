


type StartEvent = { event: 'start', data: null }
type PgEvent = { event: 'progress', data: string }
type ErrEvent = { event: 'error', data: string }
type SuccessEvent = { event: 'success', data: string }
type EndEvent = { event: 'end', data: string }
type HeartbeatEvent =  { event: 'heartbeat', data: string }

export type SSEvent = StartEvent | PgEvent | ErrEvent | SuccessEvent | EndEvent | HeartbeatEvent


export  const useImageGenerate = () => {

}

// event 1. response start => drawing
//       2. error response
//       3. progress
//       4. start
//       5. progress - 1
//       6. progress - 2
//       7. error: cause
//       8. success: url
//       9. heartbeat