export class Logger {
  public static LogContext(
    request: string,
    response: string,
    errors: string[],
    receivedAt: string
  ) {
    process.stdout.write(`Started POST "/api" at ${receivedAt}\n`);
    process.stdout.write(`  Request: ${request}\n`);
    process.stdout.write(`  Response: ${response}\n`);
    if (errors.length > 0) {
      process.stdout.write(`  Errors: ${errors.join(", ")}\n`);
    }
    process.stdout.write("\n\n");
  }

  public static Write(source: string, desc: string, err: any) {
    process.stdout.write(`${source}: ${desc}${err ? `: ${err}` : ""}\n\n`);
  }
}

export const logger = Logger;
