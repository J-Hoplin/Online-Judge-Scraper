import { Exclude } from 'class-transformer';
import { IsUrl, Max, Min, validate } from 'class-validator';
import { ColorPrinter } from '../printer';

const printer = new ColorPrinter();

interface IScraperConfig {
  readonly BOJ_ROOT: string; // Root url of individual problem
  readonly CHUNK: number; // Reffers to maximum chunk of request of browser. Recommend to use maximum 5
  readonly RANGE_START: number;
  readonly RANGE_END: number; // End of question
}

const DefaultConfig = {
  BOJ_ROOT: 'https://www.acmicpc.net/problem',
  CHUNK: 3,
  RANGE_START: 1000,
  RANGE_END: 1100,
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

  private constructor() {
    const finalConfig: IScraperConfig = {
      BOJ_ROOT: process.env.BOJ_ROOT
        ? process.env.BOJ_ROOT
        : DefaultConfig.BOJ_ROOT,
      CHUNK: parseInt(process.env.CHUNK) ?? DefaultConfig.CHUNK,
      RANGE_START: process.env.RANGE_START
        ? parseInt(process.env.RANGE_START)
        : DefaultConfig.RANGE_START,
      RANGE_END: process.env.RANGE_END
        ? parseInt(process.env.RANGE_END)
        : DefaultConfig.RANGE_END,
    };

    const setConfig = Object.assign(this, finalConfig);
  }

  public static async LoadConfig(): Promise<ScraperConfig> {
    if (!ScraperConfig.configInstance) {
      ScraperConfig.configInstance = new ScraperConfig();
      // Validate Range
      if (
        ScraperConfig.configInstance.RANGE_START >
        ScraperConfig.configInstance.RANGE_END
      ) {
        printer.error('❌Invalid range defined');
        process.exit(1);
      }

      // Validate entire value
      const validationResult = await validate(ScraperConfig.configInstance);
      if (validationResult.length) {
        printer.error('❌Fail to load config datas');
        for (const err of validationResult) {
          const message = `🔧${err.property}: ${Object.values(err.constraints)}`;
          printer.warn(message);
        }
        process.exit(1);
      }
      printer.normal('✨Config datas successfully loaded!');
    }

    return ScraperConfig.configInstance;
  }
}
