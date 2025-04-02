import {taskStatus, taskType} from "../storage/type";
import {mockExecution} from "./mock_execution";

export const mockEvent = [
  {event: 'start', data: ''},
  {event: 'message', data: ''},
  {event: 'message', data: ''},
  {event: 'message', data: ''},
  {event: 'progress', data: '11'},
  {event: 'message', data: ''},
  {event: 'message', data: ''},
  {event: 'progress', data: '21'},
  {event: 'message', data: ''},
  {event: 'progress', data: '31'},
  {event: 'message', data: ''},
  {event: 'progress', data: '52'},
  {event: 'message', data: ''},
  {event: 'progress', data: '72'},
  {event: 'message', data: ''},
  {event: 'progress', data: '90'},
  {event: 'message', data: ''},
  {event: 'success', data: 'https://picit-usercontent.ktlab.io/ai_0195e2c8-754e-7594-bbe9-77b6f919d3f6'},
  {event: 'end', data: 'stop'},
]
const input = {
  "files": [
  "https://picit-usercontent.ktlab.io/ai_01jqr48xw1f6fs7zc2rx47qsde",
  "https://picit-usercontent.ktlab.io/ai_01jqrxd4sjfk7bxv3nmdf9592x"
],
  "prompt": "请参考图1的画面风格，将图2 转为动画风。"
}

const commonTask = {
  input: input,
  userid: "anonymous",
  metadata: {},
  type: taskType.IMAGE_GEN,
  retry: 0,
  status: taskStatus.SUCCESS,
  createdAt: "2021-01-12 23:32:00",
  updatedAt: "2021-01-12 23:32:00",
}
export const mockTask = [
  { id: "task_01jqrxepaefk7bxv3smqm07psh", history: mockExecution[0], name: 'random name', ...commonTask},
  { id: "task_01jqrxepaefk7bxv3smqm032ds", history: mockExecution[1], name: 'random name', ...commonTask},
  { id: "task_01jqrxepaefk7bxv3smqm032df", history: mockExecution[2], name: 'random name', ...commonTask},
]