# Hubspot Tickets Lambda

This is a template for an AWS Lambda that will call Hubspot to retrieve the latest updated tickets. This Lambda was developed as a solution to keep updating the Hubspot data in our own database because Hubspot Webhooks are not available in their starter plans.

This lambda is currently scheduled for every 10 mins from 5am to 22pm, Monday to Friday:

`schedule: events.Schedule.expression('cron(0/10 5-21 ? * MON-FRI *)'),`

The lambda can accept more than one environment. The database URL and hubspot token for each environment are retrieved from AWS SSM as SecureStrings.

`ENVIRONMENTS: "staging" // develop, staging, prod`

The Hubspot Token is retrieved from AWS SSM.

# Description

For each environment:

1. Retrieve the last execution (e.g: from the database)
2. Call the Hubspot Tickets API to get the tickets with lastupdatedtime > last execution.
3. Call the Hubspot API to get all the pipelines and stages.
4. Here we can use the Hubspot data to update our database (or whatever we want)
5. Update the last execution (e.g: in the database)

# How to deploy it

- `npm install`
- `cdk synth`: produce a AWS CloudFormation template
- `cdk deploy`: deploy (or modify) the stack (Lambda, Cloudwatch, roles, scheduler)

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk destroy` destroy this stack from your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
