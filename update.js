import * as dynamoDbLib from "./libs/dynamodb-lib"
import { success, failure } from "./libs/response-lib"

export async function main(event, context, callback) {
	const data = JSON.parse(event.body)
	const params = {
		TableName: 'notes',
		Key: {
			userId: event.requestContext.identity.congnitoIdentityId,
			noteId: event.pathParameters.id
		},
		UpdateExpression: "SET #content = :content, #attachment = :attachment",
		ExpressionAttributeNames: {
			"#content": "content",
			"#attachment": "attachment"
		},
		ExpressionAttributeValues: {
      ":content": data.content ? data.content : null,
      ":attachment": data.attachment ? data.attachment : null
		},
    RETURN_VALUES: "ALL_NEW"
	}

  try {
    const result = await dynamoDbLib.call('update', params)
    callback(null, success({ status: true }))
  }
  catch(e) {
    console.log(e)
    callback(null, failure({ status: false }))
  }
}