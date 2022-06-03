import fetch from "node-fetch";

import { Message, ServiceType } from "../common/types";

export class Client {
  private url: string;

  constructor(serviceType: string) {
    let host: string | undefined;
    let port: string | undefined;

    switch (serviceType) {
      case ServiceType.Gin:
        host = process.env.GIN_SERVICE_HOST;
        port = process.env.GIN_SERVICE_PORT;
        break;
      case ServiceType.Express:
        host = process.env.EXPRESS_SERVICE_HOST;
        port = process.env.EXPRESS_SERVICE_PORT;
        break;
      case ServiceType.Rails:
        host = process.env.RAILS_SERVICE_HOST;
        port = process.env.RAILS_SERVICE_PORT;
        break;
      case ServiceType.Spring:
        host = process.env.SPRING_SERVICE_HOST;
        port = process.env.SPRING_SERVICE_PORT;
        break;
      case ServiceType.Django:
        host = process.env.DJANGO_SERVICE_HOST;
        port = process.env.DJANGO_SERVICE_PORT;
        break;
      default:
        break;
    }

    this.url = `http://${host}:${port}/api`;
  }

  public async makeServiceCall(message: Message): Promise<Message | null> {
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
