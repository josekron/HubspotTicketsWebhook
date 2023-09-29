export class Ticket {
  private hubspotTicketId: number;
  private hubspotOwnerId: number;
  private stage: string;

  public constructor(
    hubspotTicketId: number,
    hubspotOwnerId: number,
    stage: string
  ) {
    this.hubspotTicketId = hubspotTicketId;
    this.hubspotOwnerId = hubspotOwnerId;
    this.stage = stage;
  }

  public getHubspotTicketId = (): number => {
    return this.hubspotTicketId;
  };

  public getHubspotOwnerId = (): number => {
    return this.hubspotOwnerId;
  };

  public getStage = (): string => {
    return this.stage;
  };
}
