import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class AppsyncStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AppsyncQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    const api = new appsync.GraphqlApi(this, 'MyAPI',{
      name: 'MyLambdaGraphqlAPI',
      schema: appsync.SchemaFile.fromAsset(path.join(__dirname, '../graphql/schema.graphql')),

      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,

    });
   // Create the Lambda function
    const helloLambda = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      functionName: 'LambdaGraphqlIntegration',
    });

    // Set Lambda as a data source
    const lambdaDs = api.addLambdaDataSource('LambdaDatasource', helloLambda);

    // Attach resolver to the data source
    lambdaDs.createResolver("resolverid",{
      typeName: 'Query',
      fieldName: 'hello'
    });


    // Output the API URL and Key
    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || '',
    });
  }
}

// Run the API

// curl -X POST \
//   -H "Content-Type: application/json" \
//   -H "x-api-key: <api key>" \
//   -d '{"query":"query { hello }"}' \
//   https://rak7nwjyrvhazkxyhiflypn55e.appsync-api.us-east-1.amazonaws.com/graphql
