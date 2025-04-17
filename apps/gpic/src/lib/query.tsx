import {QueryCache, QueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {api} from "@/lib/api";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      toast.error(error.message);
    }
  }),
  defaultOptions: {
    queries: {
      retry: false,
    }
  }
})

export const mutationKeys = {
  task: {
    generate: ['generate-task'],
    retry: ['task', 'retry']
  },
  file: {
    upload: ['file-upload'],
  }

}


export const queryKeys = {
  balance: ['user', 'balance'],
  orders: ['user', 'orders'],
  gallery: ['gallery'],
  tasks: ['tasks']
}

type StyleInput = {
  styleId: string,
} | {
  reference: string[],
  prompt: string
}

export type TaskCreateV2 = {
  files: string[],
  styles: StyleInput[]
  count?: number,
  size?: 'auto' |'1x1'| '3x2' | '2x3',
  batch?: boolean
}

queryClient.setQueryDefaults(queryKeys.balance, {
  queryFn: () => {
    return api.getBalance()
  }
})

queryClient.setMutationDefaults(mutationKeys.task.generate,{
  mutationFn: async (props: TaskCreateV2) => {
    return await api.createTaskV2(props)
  },
  onSuccess: async (data) => {
    toast.success('任务已创建', {
      description: (data as any)?.id,
      action: <Button size={'sm'} variant={'link'} ><Link href={`/task/${data.id}`}>查看详情</Link></Button>
    })
    queryClient.invalidateQueries({queryKey:queryKeys.balance})
  },
  onError: async (err) => {
    toast.error('任务创建失败', { description: err.message })
  }
})


queryClient.setMutationDefaults(mutationKeys.task.retry,{
  mutationFn: async (id: string) => {
    return await api.retryTask(id)
  },
  onSuccess: async (data) => {
    toast.success('任务已开始重试', { description: (data as any)?.id })
  },
  onError: async (err) => {
    toast.error('任务重试创建失败', { description: err.message })
  }
})

