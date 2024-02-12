import { PrismaConnector } from '../connector';
import { IRepository } from './repository.interface';

export class MySQLRepository extends PrismaConnector implements IRepository {
  constructor() {
    super();
  }

  async saveProblem(
    title: string,
    problemHTML: string,
    inputHTML: string,
    outputHTML: string,
    timeLimit: number,
    memoryLimit: number,
    examples: string[][],
  ): Promise<void> {
    await this.problem.create({
      data: {
        title,
        problem: problemHTML,
        input: inputHTML,
        output: outputHTML,
        timeLimit,
        memoryLimit,
        contributerId: this.adminId,
        tags: [],
        examples: {
          createMany: {
            data: examples.map(([input, output]) => {
              return {
                input,
                output,
              };
            }),
          },
        },
      },
    });
  }
}
