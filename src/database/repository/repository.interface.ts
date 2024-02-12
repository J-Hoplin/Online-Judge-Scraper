/**
 * Common Interface for all types of Database Repository
 */

export interface IRepository {
  saveProblem(
    title: string,
    problemHTML: string,
    inputHTML: string,
    outputHTML: string,
    timeLimit: number,
    memoryLimit: number,
    examples: string[][],
  ): Promise<void>;
}
