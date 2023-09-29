import { APIGatewayProxyHandler } from "aws-lambda";
import { HubspotClient } from "./hubspotClient";
import { Ticket } from "./ticket";
import { getConnection, disconnect } from "./database/database";
import { getParameterWorker } from "./utils";

export const handler: APIGatewayProxyHandler = async (event: any) => {
  let lastModifiedDate: number = 0;
  let request: any;
  if (event.body) {
    request = JSON.parse(event.body);
  }

  if (request?.lastModifiedDate) {
    // TODO: retrieve lastModifiedDate from the database
    lastModifiedDate = request.lastModifiedDate;
  }

  // Environments:
  const environments = process.env.ENVIRONMENTS?.split(",");
  if (!environments) {
    return {
      statusCode: 200,
      headers: {},
      body: "no environments to process",
    };
  }

  let processedTickets = new Map<string, Ticket[]>();
  try {
    for (const environment of environments) {
      console.log(`processing ${environment}...`);

      // Create connection to the database:
      const db = await getConnection(environment);

      // Get tickets from Hubspot:
      if (!process.env[`HUBSPOT_${environment}_TOKEN`]) {
        const hubspotToken: string = await getParameterWorker(
          `/hubspot/${environment}/token`,
          true
        );
        process.env[`HUBSPOT_${environment}_TOKEN`] = hubspotToken;
      }

      const hubspotClient = new HubspotClient(
        process.env[`HUBSPOT_${environment}_TOKEN`] as string
      );

      console.log(
        `${environment} - calling hubspot tickets for last modified date ${lastModifiedDate}`
      );
      const ticketsResponse = await hubspotClient.getTicketsByLastModifiedDate(
        lastModifiedDate
      );

      if (!ticketsResponse.results.length) {
        console.log(
          `${environment} - no tickets to update since ${lastModifiedDate}`
        );
        processedTickets.set(environment, []);
      } else {
        // Get Pipeline and stages from Hubspot:
        const pipelinesResponse = await hubspotClient.getPipelinesAndStages();

        // TODO:
        // Here we have the list of modified tickets from Hubspot and also the Pipelines and
        // Stages in Hubspot. Therefore, we have enough information for updating the tickets
        // in our database.
      }

      // TODO: update the lastModifiedDate in our database.
      await disconnect();
      console.log(`${environment} - updated tickets finished`);
    }

    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify(Array.from(processedTickets.entries())),
    };
  } catch (error) {
    console.error(
      `Something went wrong with processing hubspot tickets: ${error}`
    );
    return {
      statusCode: 503,
      headers: {},
      body: JSON.stringify(error),
    };
  } finally {
    await disconnect();
  }
};
