import chalk from "chalk";

function dateTimePad(value: number, digits: number): string {
  let number = value.toString();
  while (number.length < digits) {
    number = "0" + number;
  }
  return number;
}

function format(tDate: Date): string {
  return (
    tDate.getFullYear() +
    "-" +
    dateTimePad(tDate.getMonth() + 1, 2) +
    "-" +
    dateTimePad(tDate.getDate(), 2) +
    " " +
    dateTimePad(tDate.getHours(), 2) +
    ":" +
    dateTimePad(tDate.getMinutes(), 2) +
    ":" +
    dateTimePad(tDate.getSeconds(), 2) +
    "." +
    dateTimePad(tDate.getMilliseconds(), 3)
  );
}

class Logger {
  private static async logMessage(
    args: any[],
    type: string,
    color: (text: string) => string
  ): Promise<void> {
    const timestamp = new Date();
    const date = `[${format(timestamp)}]:`;
    const coloredType = color(type.toUpperCase());
    console.log(date, coloredType, ...args);
  }

  static log(...args: any[]): void {
    this.logMessage(args, "log", chalk.bgBlue);
  }

  static warn(...args: any[]): void {
    this.logMessage(args, "warn", chalk.black.bgYellow);
  }

  static error(...args: any[]): void {
    this.logMessage(args, "error", chalk.black.bgRed);
  }

  static debug(...args: any[]): void {
    this.logMessage(args, "debug", chalk.green);
  }

  static register(...args: any[]): void {
    this.logMessage(args, "register", chalk.black.bgWhite);
  }

  static execute(...args: any[]): void {
    this.logMessage(args, "execute", chalk.black.bgMagentaBright);
  }
  
  static bot(...args: any[]): void {
    this.logMessage(args, "bot", chalk.black.bgCyan);
  }

  static ready(...args: any[]): void {
    this.logMessage(args, "ready", chalk.black.bgGreen);
  }
}

export default Logger;
