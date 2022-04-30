import Express from "express";

import { Client as BackendClient } from "./backend";
import {
  ActionType,
  Message,
  Payload,
  ServiceType,
  StatusType,
} from "./common/types";
import { Client as DBClient } from "./db";
import { ProducerFactory } from "./kafka";
import { logger } from "./logger";

// NestedCallHandler handles a "nested call" API.
// Accepts POST requests with a JSON body specifying the nested call.
// It processes the nested call, and returns the result JSON message.
export const NestedCallHandler = async (
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
        message.actions[i].status = StatusType.Passed;
        break;
      case ActionType.Read: {
        const readClient = new DBClient(action.payload.serviceName);
        const readOp = readClient.readEntity(action.payload.key || "");
        if (readOp.errors) {
          logger.write(
            "NestedCallHandler",
            "failed to read key",
            readOp.errors
          );
          message.actions[i].status = StatusType.Failed;
          break;
        }
        message.actions[i].status = StatusType.Passed;
        message.actions[i].payload.value = readOp.value;
        break;
      }
      case ActionType.Write: {
        const writeClient = new DBClient(action.payload.serviceName);
        const writeOp = writeClient.writeEntity(
          action.payload.key || "",
          action.payload.value
        );
        if (writeOp.errors) {
          logger.write(
            "NestedCallHandler",
            "failed to write key/value pair",
            writeOp.errors
          );
          message.actions[i].status = StatusType.Failed;
          break;
        }
        message.actions[i].status = StatusType.Passed;
        break;
      }
      case ActionType.Call: {
        // eslint-disable-next-line no-await-in-loop
        const resp = await serviceCall(action.payload);
        if (!resp) {
          logger.write(
            "NestedCallHandler",
            `failed to call ${action.payload.serviceName}`,
            null
          );
          message.actions[i].status = StatusType.Failed;
          break;
        }
        message.actions[i].status = StatusType.Passed;
        message.actions[i].payload.actions = resp.actions;
        break;
      }
      default:
        break;
    }

    message.actions[i].serviceName = ServiceType.Express;
    message.actions[i].returnTime = currentTime();
  }

  message.meta.returnTime = currentTime();

  res.json(message);

  if (message.meta.caller !== ServiceType.React) {
    return;
  }

  enqueueMessage(ServiceType.React, message);
};

const serviceCall = async (payload: Payload): Promise<Message | null> => {
  const message: Message = {
    meta: {
      caller: ServiceType.Express,
      callee: payload.serviceName!,
      callTime: currentTime(),
    },
    actions: payload.actions!,
  };

  const client = new BackendClient(message.meta.callee);
  return client.makeServiceCall(message);
};

const enqueueMessage = (topic: string, message: Message) => {
  const producer = new ProducerFactory();
  producer.start().then(() => {
    producer.enqueue(topic, JSON.stringify(message));
  });
};

const currentTime = (): string => new Date().toISOString();
