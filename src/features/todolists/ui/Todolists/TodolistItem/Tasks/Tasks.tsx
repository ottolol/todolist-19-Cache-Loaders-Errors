import { TaskStatus } from "@/common/enums"
import { useGetTasksQuery } from "@/features/todolists/api/tasksApi"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"
import List from "@mui/material/List"
import { TaskItem } from "./TaskItem/TaskItem"
import { TasksSkeleton } from "./TasksSkeleton/TasksSkeleton"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { useEffect, useState } from "react"

type Props = {
  todolist: DomainTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const { data, isLoading, error } = useGetTasksQuery(id)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!error) return
    if ('status' in error) {
      // FetchBaseQueryError
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
      dispatch(setAppErrorAC({ error: errMsg }))
    } else {
      // SerializedError
      dispatch(setAppErrorAC({ error: error.message || 'Some error occurred' }))
    }
  }, [error])

  let filteredTasks = data?.items
  if (filter === "active") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
  }
  if (filter === "completed") {
    filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
  }

  if (isLoading) {
    return <TasksSkeleton />
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolist={todolist} />)}</List>
      )}
    </>
  )
}
