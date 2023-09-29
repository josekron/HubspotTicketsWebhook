import { Construct } from "constructs";
// import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { Duration } from "aws-cdk-lib";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as events from "aws-cdk-lib/aws-events";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";
import { ManagedPolicy, ServicePrincipal } from "aws-cdk-lib/aws-iam";

export class HubspotTickets extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const iamRoleForLambda = new iam.Role(
      this,
      "IAMRoleForHubspotTicketsLambda",
      {
        roleName: "ssm-secure-string-hubspot-tickets-role",
        assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AWSLambdaBasicExecutionRole"
          ),
          ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess"),
        ],
      }
    );

    const nodeJsFnProps: NodejsFunctionProps = {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, `/../resources/main.ts`),
      functionName: "hubspotTicketsLambda",
      handler: "handler",
      timeout: Duration.seconds(900),
      logRetention: logs.RetentionDays.THREE_MONTHS,
      role: iamRoleForLambda,
      environment: {
        MAX_POOL_SIZE: "10",
        ENVIRONMENTS: "staging", //staging,prod
      },
    };

    const handler = new NodejsFunction(
      this,
      "HubspotTicketsHandler",
      nodeJsFnProps
    );

    const scheduler = new events.Rule(this, "hubspotTicketsLambdaScheduler", {
      schedule: events.Schedule.expression("cron(0/15 5-21 ? * MON-FRI *)"),
      // schedule: events.Schedule.expression("rate(10 minutes)"),
    });
    scheduler.addTarget(new targets.LambdaFunction(handler));

    // Uncomment the code for api gateway in case we want to enable an api to call the lambda.
    // Currently, the api is disabled because it's in a default VPC and it would be exposed to the world.

    // const api = new apigateway.RestApi(this, "hubspot-ticket-api", {
    //   restApiName: "This service update tickets status from Hubspot to MongoDB",
    // });

    // const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
    //   requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    // });

    // api.root.addMethod("POST", getWidgetsIntegration);
  }
}
