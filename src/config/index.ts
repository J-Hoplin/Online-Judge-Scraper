import chalk from 'chalk';
import { Exclude } from 'class-transformer';
import { IsUrl, Max, Min, validate } from 'class-validator';

interface IScraperConfig {
  BOJ_ROOT: string; // Root url of individual problem
  CHUNK: number; // Reffers to maximum chunk of request of browser. Recommend to use maximum 5
  RANGE_START: number;
  RANGE_END: number; // End of question
}

const DefaultConfig = {
  BOJ_ROOT: 'https://www.acmicpc.net/problem',
  CHUNK: 3,
  RANGE_START: 1000,
  RANGE_END: 1006,
};

/**
 * Encapsulate Config datas
 *
 * Make all validation each field and set readonly
 *
 * Exclude fields if illegal extraction happens
 */
export class ScraperConfig {
  private static configInstance: ScraperConfig;

  @Exclude() @IsUrl() private readonly BOJ_ROOT: string;

  @Exclude() @Min(1) @Max(5) private readonly CHUNK: number;

  @Exclude() @Min(1000) private readonly RANGE_START: number;

  @Exclude() @Max(31000) private readonly RANGE_END: number;

  get baseURL() {
    return this.BOJ_ROOT;
  }

  get chunk() {
    return this.CHUNK;
  }

  get range() {
    return [this.RANGE_START, this.RANGE_END];
  }

  private constructor(config: IScraperConfig = DefaultConfig) {
    Object.assign(this, config);
  }

  public static async LoadConfig(
    config?: IScraperConfig,
  ): Promise<ScraperConfig> {
    if (!ScraperConfig.configInstance) {
      ScraperConfig.configInstance = new ScraperConfig(config);
      // Validate Range
      if (
        ScraperConfig.configInstance.RANGE_START >
        ScraperConfig.configInstance.RANGE_END
      ) {
        process.stdout.write(chalk.red('❌Invalid range defined') + '\n');
        process.exit(1);
      }

      // Validate entire value
      const validationResult = await validate(ScraperConfig.configInstance);
      if (validationResult.length) {
        process.stdout.write(chalk.red('❌Fail to load config datas') + '\n');
        for (const err of validationResult) {
          const message = `🔧${err.property}: ${Object.values(err.constraints)}`;
          process.stdout.write(chalk.yellow(message) + '\n');
        }
        process.exit(1);
      }
      process.stdout.write(
        chalk.green('✨Config datas successfully loaded!' + '\n'),
      );
    }

    return ScraperConfig.configInstance;
  }
}
