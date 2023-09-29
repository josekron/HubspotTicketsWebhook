import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as hubspotTickets from "./hubspotTickets";

export class WebhookHubspotTicketsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new hubspotTickets.HubspotTickets(this, "hubspotTickets");
  }
}
