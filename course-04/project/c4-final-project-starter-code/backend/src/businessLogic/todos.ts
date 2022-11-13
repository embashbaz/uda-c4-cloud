//import { TodosAccess } from './todosAcess'
///import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import { getUserId } from '../lambda/utils';
import { TodoUpdate } from '../models/TodoUpdate';
import { updateToDos } from '../dataLayer/todosAcess'
import { deleteToDo } from '../dataLayer/todosAcess'
import { updateToDo } from '../dataLayer/todosAcess'

import { getToDoById } from '../dataLayer/todosAcess'

import {getToDoByUserId} from '../dataLayer/todosAcess'

const bucket = process.env.ATTACHMENT_S3_BUCKET

// TODO: Implement businessLogic

export function buildToDo(request: CreateTodoRequest, event): TodoItem{
    const actualNewTodo = {
        todoId: uuid.v4(),
        createdAt: new Date().toISOString(),
        userId: getUserId(event),
        done: false,
        attachmentUrl: '',
        ...request        
    }
    return actualNewTodo
}

export function updateAToDo(todoUpdate: TodoUpdate, todoId: string, userId: string) : Promise<TodoUpdate>{
        return updateToDos(todoUpdate, todoId, userId)
}

export async function generateToImageLink(todoId: string): Promise<TodoItem> {
    const todo = await getToDoById(todoId)
    todo.attachmentUrl = `https://${bucket}.s3.amazonaws.com/${todoId}`
    return updateToDo(todo)
}

export async function deleteAToDo(todoId: string, userId: string): Promise<string> {
    return deleteToDo(todoId, userId)
}

export async function getToDosByUserId(userId: string): Promise<TodoItem[]> {
    return getToDoByUserId(userId)
}


