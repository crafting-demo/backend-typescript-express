import { MongoDBClient } from "./mongodb";
import { MySQLClient } from "./mysql";

export interface OpResponse {
  key: string;
  value?: string;
  errors?: string;
}

export class Client {
  private entityStore?: string;

  constructor(entityStore?: string) {
    this.entityStore = entityStore;
  }

  public async readEntity(key: string): Promise<OpResponse> {
    if (!this.entityStore) {
      return {
        key,
        errors: "missing entity store",
      };
    }
    switch (this.entityStore) {
      case "mysql": {
        const client = new MySQLClient();
        const result = await client.read(key);
        return { key, value: result.value };
      }

      case "mongodb": {
        const client = new MongoDBClient();
        const result = await client.read(key);
        return { key, value: result.value };
      }

      default:
        break;
    }
    return {
      key,
      errors: `${this.entityStore} not supported`,
    };
  }

  public async writeEntity(key: string, value?: string): Promise<OpResponse> {
    if (!this.entityStore) {
      return {
        key,
        value,
        errors: "missing entity store",
      };
    }
    switch (this.entityStore) {
      case "mysql": {
        const client = new MySQLClient();
        const result = await client.write(key, value || "");
        return { key, value: result.value };
      }

      case "mongodb": {
        const client = new MongoDBClient();
        const result = await client.write(key, value || "");
        return { key, value: result.value, errors: result.error };
      }

      default:
        break;
    }
    return {
      key,
      value,
      errors: `${this.entityStore} not supported`,
    };
  }
}
