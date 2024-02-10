import puppeteer from 'puppeteer';
import { ScraperConfig } from './config';
import { allocatePages, closePages } from './tab-management';

async function main() {
  // Use default setting
  const config = await ScraperConfig.LoadConfig();
  const [start, end] = config.range;
  // Initialize Puppeteer
  const browser = await puppeteer.launch();
  // Initialize tabs
  const tabs = await allocatePages(browser, config.chunk);

  let problemNubmerIndex = start;
  while (true) {
    // Slice by chunk. If it's over range return null and filter
    const problemNumberSet = Array.from({ length: config.chunk }, (_, i) => {
      return problemNubmerIndex + i <= end ? problemNubmerIndex + i : null;
    }).filter((x) => x);

    // Save problem number index
    problemNubmerIndex = problemNumberSet[problemNumberSet.length - 1];
    // While loop exit condition
    if (problemNubmerIndex >= end) {
      break;
    }
  }

  await closePages(tabs);
  await browser.close();
}

main();
