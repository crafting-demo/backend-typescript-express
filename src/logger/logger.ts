export class Logger {
  public static Write(message: string) {
    process.stdout.write(`${message}\n`);
  }
}

export const logger = Logger;
