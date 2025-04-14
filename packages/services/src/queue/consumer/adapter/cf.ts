type Consume<T> = (msg: T) => Promise<void>
export const CFAdapter = async <T>(
  batch: MessageBatch<T>,
) => {
  const handler = async (consume: Consume<T>, msg:Message<T>) => {
    console.log("receive message", msg.id, msg.attempts, msg.timestamp, msg.body)
    msg.ack()
    try {
      await consume(msg.body)
    }catch (e) {
      console.error(e)
      msg.retry({delaySeconds: 30})
    }
    console.log("message-handler-over", msg.id, msg.attempts, msg.timestamp)
  }
  return {
    consume : async (consume: Consume<T>) => {
      await Promise.all(batch.messages.map(it => handler(consume, it)))
    }
  }
}