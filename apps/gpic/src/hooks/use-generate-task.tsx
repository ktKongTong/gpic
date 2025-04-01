import {fetchEventSource} from "@microsoft/fetch-event-source";
import {states} from "@/hooks/use-generate";
import {useMutation, useQuery} from "@tanstack/react-query";

type MultiFile = {
  files: string[],
  style?: string,
  prompt?: string,
}

type GenerateProps = MultiFile

export const useGenerateTasks = () => {
  // const {data: tasks} = useQuery({
  //   queryKey: ['tasks'],
  //   queryFn: async () => {
  //     return await fetch('/api/tasks/ai/image-flavor-style').then(res => res.json())
  //   }
  // })
  // create tasks
  const {mutate: generateMutation, data } = useMutation({
    mutationKey: ["generateTask"],
    mutationFn: async (props: GenerateProps) => {
      return await fetch('/api/ai/image/flavor-style/task', {
        method: 'POST',
        body: JSON.stringify(props),
      }).then(res => res.json())
    },
    onSuccess: async (data) => {
      // taskId
    }
  })
  // 预计耗时，执行中，耗时，更新状态，
  return {
    generateTask: generateMutation,
  }
}