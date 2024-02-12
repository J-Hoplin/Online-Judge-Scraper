// Puppeteer
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

// Custom Packages
import { ScraperConfig } from './config';
import { allocatePages, closePages } from './tab-management';
import { ProblemScraper } from './app';
import { ColorPrinter, ProgressIndicator } from './printer';
import { config } from 'dotenv';
import { WriteStream } from 'fs';

// Initialzie Dotenv
config();

// Console color printer
const printer = new ColorPrinter();

async function main() {
  // Use default setting
  const config = await ScraperConfig.LoadConfig();
  // const [start, end] = config.range;
  // Initialize Puppeteer
  const browser = await puppeteer.launch();
  // Initialize tabs
  const tabs = await allocatePages(browser, config.chunk);

  const [start, end] = config.range;
  let problemNubmerIndex = start;

  const totalScraped = end - start + 1;
  let finished = 0;
  let successCounter = 0;
  let failCounter = 0;

  ProgressIndicator(0);
  while (true) {
    // Slice by chunk. If it's over range return null and filter
    const problemNumberSet = Array.from({ length: config.chunk }, (_, i) => {
      return problemNubmerIndex + i <= end ? problemNubmerIndex + i : null;
    }).filter((x) => x);

    const result = await Promise.all(
      problemNumberSet.map((nubmer, index) => {
        return ProblemScraper(tabs[index], config.baseURL, nubmer);
      }),
    );
    finished += result.length;
    result.forEach((isSuccess) => {
      isSuccess ? successCounter++ : failCounter++;
    });
    ProgressIndicator((finished / totalScraped) * 100);
    // Save problem number index
    problemNubmerIndex = problemNumberSet[problemNumberSet.length - 1] + 1;
    // While loop exit condition
    if (problemNubmerIndex > end) {
      break;
    }
  }

  await closePages(tabs);
  await browser.close();

  printer.normal(
    `\nSuccess Rate: ${((successCounter / totalScraped) * 100).toFixed(2)}% (${successCounter} problem(s))`,
  );
  printer.error(
    `Failed Rate: ${((failCounter / totalScraped) * 100).toFixed(2)}% (${failCounter} problem(s))`,
  );
}

main();
