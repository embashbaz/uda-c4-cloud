//import { TodosAccess } from './todosAcess'
///import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import { getUserId } from '../lambda/utils';

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


