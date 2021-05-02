import { Task } from "./Task";
export interface TaskState {
    isRunning: boolean;
    isIdle: boolean;
}
export declare type TaskGroup<U extends Record<string, Task<any, any>>> = TaskState & U;
export default function useTaskGroup<U extends Record<string, Task<any, any>>>(taskMap: U): TaskGroup<U>;
