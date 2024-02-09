// Index.ts
import { ScraperConfig } from './config';

async function main() {
  // Use default setting
  const config = await ScraperConfig.LoadConfig();
  const [start, end] = config.range;
  for (let init = start; start < end; init += config.chunk) {}
}

main();
