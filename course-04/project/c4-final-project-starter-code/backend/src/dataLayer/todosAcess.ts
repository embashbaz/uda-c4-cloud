import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
//import { Token } from 'aws-sdk/lib/token';

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

//const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

const docClient: DocumentClient = createDynamoDBClient()
const todoTable = process.env.TODOS_TABLE
const IndexName = process.env.TODOS_CREATED_AT_INDEX

export async function createTodo (todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todoTable,
      Item: todo
    }).promise()

    return todo
  }

export async function getToDoByUserId(userId: string): Promise<TodoItem[]> {
    const result = await docClient.query({
        TableName : todoTable,
        KeyConditionExpression : 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId' : userId
        }
    }).promise()
    
    return result.Items as TodoItem[]

}

export async function getToDoById(todoId: string): Promise<TodoItem> {
    const result = await docClient.query({
        TableName : todoTable,
        IndexName: IndexName,
        KeyConditionExpression : 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId' : todoId
        }
    }).promise()

    if(result.Items.length !== 0) return result.Items[0] as TodoItem
    else
    return null

}

export async function updateToDos(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
    

  const result = await docClient.update({
      TableName: todoTable,
      Key: {
          "userId": userId,
          "todoId": todoId
      },
      UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
      ExpressionAttributeNames: {
          "#name": "name",
          "#dueDate": "dueDate",
          "#done": "done"
      },
      ExpressionAttributeValues: {
          ":name": todoUpdate['name'],
          ":dueDate": todoUpdate['dueDate'],
          ":done": todoUpdate['done']
      },
    }).promise()


  return result.Attributes as TodoUpdate;
}

export async function deleteToDo(todoId: string, userId: string): Promise<string> {
 
  const result = await docClient.delete({  
      TableName: todoTable,
      Key: {
          "userId": userId,
          "todoId": todoId
      },
    }).promise()

  
  console.log(result);

  return "" as string;
}

export async function updateToDo(todo: TodoItem): Promise<TodoItem> {
    const result = await docClient.update({
        TableName : todoTable,
        Key: {
            userId: todo.userId,
            todoId: todo.todoId
        },
        UpdateExpression : 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl' : todo.attachmentUrl
        }
    }).promise()

    
    return result.Attributes as TodoItem

}


  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }