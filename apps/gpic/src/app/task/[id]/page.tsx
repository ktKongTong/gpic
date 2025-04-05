import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import TaskDetail from "./task";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const taskId = (await params).id
  return <>
    <main className="flex-1 flex flex-col w-full items-start p-4 md:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/task">Task</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {taskId}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

    <TaskDetail id={taskId} />
    </main>
  </>
}