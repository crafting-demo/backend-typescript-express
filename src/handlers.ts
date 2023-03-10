import Express from "express";

import { ResponseMessage, RequestMessage, BackendType } from "./common/types";
import { KafkaProducer } from "./kafka";
import { logger } from "./logger";

const currentTime = (): string => new Date().toISOString();

async function makeServiceCall(
  url: string,
  message: RequestMessage
): Promise<ResponseMessage | null> {
  const resp = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  if (!resp.ok) {
    return null;
  }
  return (await resp.json()) as ResponseMessage | null;
}

export const ApiHandler = async (
  req: Express.Request,
  res: Express.Response
) => {
  const receivedAt = currentTime();

  logger.Write(
    `At ${receivedAt} handling request: ${JSON.stringify(req.body)}`
  );

  let request: RequestMessage;
  try {
    request = JSON.parse(JSON.stringify(req.body)) as RequestMessage;
  } catch (err) {
    logger.Write("Error parsing message");
    res.status(400).send();
    return;
  }

  let result: string = "";
  request.callTime = currentTime();
  logger.Write(`Backend Type: ${request.target}`);
  if (request.target === BackendType.GinKafka) {
    KafkaProducer.getInstance().enqueue(
      "backend-go-gin",
      JSON.stringify(request)
    );
    result = "Message posted to Kafka for Go Gin service";
  } else {
    let responseFromBackend: ResponseMessage | null = null;
    switch (request.target) {
      case BackendType.Gin:
        responseFromBackend = await makeServiceCall(
          `http://${process.env.GIN_SERVICE_HOST}:${process.env.GIN_SERVICE_PORT}/api`,
          request
        );
        break;
      case BackendType.Django:
        responseFromBackend = await makeServiceCall(
          `http://${process.env.DJANGO_SERVICE_HOST}:${process.env.DJANGO_SERVICE_PORT}/api`,
          request
        );
        break;
      case BackendType.Rails:
        responseFromBackend = await makeServiceCall(
          `http://${process.env.RAILS_SERVICE_HOST}:${process.env.RAILS_SERVICE_PORT}/api`,
          request
        );
        break;
      case BackendType.Spring:
        responseFromBackend = await makeServiceCall(
          `http://${process.env.SPRING_SERVICE_HOST}:${process.env.SPRING_SERVICE_PORT}/api`,
          request
        );
        break;
      default:
        responseFromBackend = null;
        break;
    }
    logger.Write(
      `Response from ${request.target} : ${responseFromBackend?.message}`
    );
    result = responseFromBackend?.message || "FAILED!";
  }

  const response: ResponseMessage = {
    receivedTime: receivedAt,
    returnTime: currentTime(),
    message: result,
  };
  logger.Write(`At ${response.returnTime} finish handling request`);
  res.json(response);
};
