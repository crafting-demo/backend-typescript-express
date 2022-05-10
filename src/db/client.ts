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

  public readEntity(key: string): OpResponse {
    if (!this.entityStore) {
      return {
        key,
        errors: "missing entity store",
      };
    }
    return {
      key,
      errors: `${this.entityStore} client not implemented yet`,
    };
  }

  public writeEntity(key: string, value?: string): OpResponse {
    if (!this.entityStore) {
      return {
        key,
        value,
        errors: "missing entity store",
      };
    }
    return {
      key,
      value,
      errors: `${this.entityStore} client not implemented yet`,
    };
  }
}
