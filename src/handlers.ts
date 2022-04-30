import Express from "express";

import { ActionType, Message, ServiceType } from "common/types";
import { ProducerFactory } from "kafka/producer";
import { logger } from "logger";

// NestedCallHandler handles a "nested call" API.
// Accepts POST requests with a JSON body specifying the nested call.
// It processes the nested call, and returns the result JSON message.
export const NestedCallHandler = (
  req: Express.Request,
  res: Express.Response
) => {
  let message: Message;

  try {
    message = JSON.parse(JSON.stringify(req.body)) as Message;
  } catch (err) {
    logger.write("NestedCallHandler", "failed to parse message", err);
    res.status(500).send("Internal server error");
    return;
  }

  for (let i = 0; i < message.actions.length; i += 1) {
    const action = message.actions[i];
    switch (action.action) {
      case ActionType.Echo:
        break;
      case ActionType.Read:
        break;
      case ActionType.Write:
        break;
      case ActionType.Call:
        break;
      default:
        break;
    }
  }

  message.meta.returnTime = currentTime();

  res.json(message);

  if (message.meta.caller !== ServiceType.React) {
    return;
  }

  enqueueMessage(ServiceType.React, message);
};

export const enqueueMessage = (topic: string, message: Message) => {
  const producer = new ProducerFactory();
  producer.start().then(() => {
    producer.enqueue(topic, JSON.stringify(message));
  });
};

export const currentTime = (): string => new Date().toISOString();
