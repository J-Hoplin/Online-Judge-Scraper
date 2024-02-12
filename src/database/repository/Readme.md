## Repository Directory

For future plan to migrate database from MySQL to PostgreSQL.

And internal use of this scraper

### Common rule to define repository

```typescript
import { PrismaConnector } from '../connector';
import { IRepository } from './repository.interface';

export class (RepositoryName) extends PrismaConnector implements IRepository{
    consturctor(){
      super();
    }
    async saveProblem(
        title: string,
        problemHTML: string,
        inputHTML: string,
        outputHTML: string,
        timeLimit: number,
        memoryLimit: number
        examples:string[][]
    ): Promise<void> {
        // Implement your repository
    }
}

```
