# gpic

## 简介

[gpic.ink](https://gpic.ink)

GPIC 利用 cloudflare worker 对 openAI 4o 模型 API 进行封装。


将 openAI 4o 的图片生成服务从 chat 模式转为 API 支持的异步任务、批量处理。

利用 Cloudflare Worker 提供的完整生态，可以非常轻松的自行部署。


## API 的使用
在 `dashboard -> APIKey`  中，创建APIKey，调用时添加 `X-API-Key` 请求头即可。

## Task API

#### 任务创建
```ts

// POST /api/v2/task/image/flavor-image

type Style = {
    styleId: string
} | {
    prompt: string
    // reference file urls
    reference: string[]
}

type TaskCreate = {
    version: '1'
    // file url
    files: string[]
    styles: Style[]
    count: number
    size: 'auto' | '1x1' | '2x3' | '3x2'
}
```

#### 获取任务详情
```ts
// GET api/v1/task/${task_id}

type TaskExecutionStatus = 'pending' | 'running' | 'completed' | 'failed'

type TaskExecutionState = {
    version: '1',
    // ai message
    message: string
    progress: number
    success: boolean
}

type Execution = {
    id: string
    taskId: string
    input: { version: '1', files: string[] }
    output: { url: string } | null
    state: TaskExecutionState
    status: 'running' | 'completed' | 'failed'
    startedAt: Date
    endedAt: Date | null
    // ...common fields
}

type Task = {
    id: string
    name: string
    parentId: string
    userId: string
    retry: number
    input: TaskCreate
    metadata: any
    status: TaskStatus
    type: 'image-gen' | 'batch'
    startedAt: Date | null
    endedAt: Date | null
    // ...common fields
    executions: Execution[]
    children: Task[]

}
```


#### 获取任务列表
```ts
// GET /api/v1/task

type TaskList = Task[]
```


#### 任务重试
`GET /api/v1/task/${taskId}/retry`

对于失败的任务，可以进行重试。如果是批量任务，会批量重试失败子任务。

#### 获取任务实时状态 websocket
`Websocket /api/v1/task/${taskId}/ws`
仅当任务状态为 pending/processing 时，才会成功建立 websocket 连接。当状态更新时，会发送当前任务详情。



## 如何生效

1. 通过 API进行任务创建

2. 将任务推送至队列

3. 任务消费者消费任务
- 批量任务
  - 创建子任务，将子任务入队，同步状态至数据库和 Durable Object
- 单任务
  - 调用 API，同步状态至数据库和 Durable Object
- 按照执行情况，更新任务状态