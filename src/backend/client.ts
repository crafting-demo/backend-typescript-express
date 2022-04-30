import { Message, ServiceType } from "../common/types";

export class Client {
  private url: string;

  constructor(serviceType: string) {
    const suffix = `${process.env.SANDBOX_ENDPOINT_DNS_SUFFIX}`;
    switch (serviceType) {
      case ServiceType.Gin:
        this.url = `https://gin${suffix}`;
        break;
      case ServiceType.Express:
        this.url = `https://express${suffix}`;
        break;
      case ServiceType.Rails:
        this.url = `https://rails${suffix}`;
        break;
      case ServiceType.Spring:
        this.url = `https://spring${suffix}`;
        break;
      case ServiceType.Django:
        this.url = `https://django${suffix}`;
        break;
      default:
        this.url = "unknown";
    }
  }

  public async makeNestedCall(message: Message): Promise<Message | null> {
    const resp = await fetch(this.url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!resp.ok) {
      return null;
    }
    return (await resp.json()) as Message | null;
  }
}
