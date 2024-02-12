import chalk from 'chalk';

export class ColorPrinter {
  protected standardWrite(text: string) {
    process.stdout.write(text + '\n');
  }

  normal(...text: any[]) {
    this.standardWrite(chalk.green(...text));
  }

  error(...text: any[]) {
    this.standardWrite(chalk.red(...text));
  }

  warn(...text: any[]) {
    this.standardWrite(chalk.yellow(...text));
  }
}
