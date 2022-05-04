export class Logger {
  public static write(source: string, desc: string, err: any) {
    process.stdout.write(
      `${new Date().toLocaleString()} ${source}: ${desc}${
        err ? `: ${err}` : ""
      }\n`
    );
  }
}

export const logger = Logger;
