export class Logger {
  public static write(source: string, desc: string, err: any) {
    const e = JSON.stringify(err);
    process.stdout.write(`${source}: ${desc}${e ? `: ${e}` : ""}\n`);
  }
}

export const logger = Logger;
