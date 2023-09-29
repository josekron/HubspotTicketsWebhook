import * as axios from "axios";

const BaseURL: string = "https://api.hubapi.com";

export class HubspotClient {
  private hubspotToken: string;

  public constructor(hubspotToken: string) {
    this.hubspotToken = hubspotToken;
  }

  public getTicketsByLastModifiedDate = async (
    lastModifiedDate: Number
  ): Promise<any> => {
    const hubspotTicketsAPI = axios.default.create({
      baseURL: BaseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.hubspotToken,
      },
    });

    const response = await hubspotTicketsAPI.post(
      "/crm/v3/objects/tickets/search",
      {
        limit: 100,
        filterGroups: [
          {
            filters: [
              {
                propertyName: "hs_lastmodifieddate",
                operator: "GT",
                value: lastModifiedDate,
              },
            ],
          },
        ],
        properties: [
          "subject",
          "hs_pipeline",
          "hs_pipeline_stage",
          "hubspot_owner_id",
        ],
      }
    );

    return response.data;
  };

  public getPipelinesAndStages = async (): Promise<any> => {
    const hubspotTicketsAPI = axios.default.create({
      baseURL: BaseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.hubspotToken,
      },
    });

    const response = await hubspotTicketsAPI.get(
      "/crm-pipelines/v1/pipelines/tickets"
    );

    return response.data;
  };
}
