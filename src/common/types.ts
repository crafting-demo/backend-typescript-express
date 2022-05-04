export enum ActionType {
  Echo = "Echo",
  Read = "Read",
  Write = "Write",
  Call = "Call",
}

export enum StatusType {
  Passed = "Passed",
  Failed = "Failed",
}

export enum ServiceType {
  React = "frontend-typescript-react",
  Gin = "backend-go-gin",
  Express = "backend-typescript-express",
  Rails = "backend-ruby-rails",
  Spring = "backend-kotlin-spring",
  Django = "backend-python-django",
}

export enum DependencyType {
  MySQL = "mysql",
  Postgres = "postgres",
  MongoDB = "mongodb",
  DynamoDB = "dynamodb",
  Redis = "redis",
}

export interface Message {
  meta: Meta;
  actions: Action[];
}

export interface Meta {
  caller: string;
  callee: string;
  callTime: string;
  returnTime?: string;
}

export interface Action {
  serviceName?: string;
  action: string;
  payload: Payload;
  status?: string;
  returnTime?: string;
}

export interface Payload {
  serviceName?: string;
  actions?: Action[];
  key?: string;
  value?: string;
}
