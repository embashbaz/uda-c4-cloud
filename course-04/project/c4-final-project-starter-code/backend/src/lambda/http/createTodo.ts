import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { getUserId } from '../utils';
import { createTodo } from '../../dataLayer/todosAcess'
import { buildToDo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item

   const finalToDo = buildToDo(newTodo, event)

   if(finalToDo.name.length < 1){
    return {
      statusCode: 400,  
      headers: {
        "Access-Control-Allow-Origin": "*",
      }, 
      body: JSON.stringify({
        item: "Name can not be blank"
      })
    }
   }

    const toDoToCreate = await createTodo(finalToDo)

    
  return {
    statusCode: 201,  
    headers: {
      "Access-Control-Allow-Origin": "*",
    }, 
    body: JSON.stringify({
      item: toDoToCreate
    })
  }
}
)

handler.use(
  cors({
    credentials: true
  })
)
