export enum MessageType {
  Hello = "Hello! How are you?",
  Echo = "Please echo",
  Read = "Read from database",
  Write = "Write to database",
}

export enum BackendType {
  Gin = "Gin",
  Rails = "Rails",
  Spring = "Spring",
  Django = "Django",
  GinKafka = "GinKafka",
}

export interface RequestMessage {
  callTime: string;
  target: BackendType;
  message: MessageType;
  key?: string;
  value?: string;
}

export interface ResponseMessage {
  receivedTime: string;
  returnTime: string;
  message: string;
}
