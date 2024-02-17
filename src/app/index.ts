import { zip } from 'lodash';
import { Page } from 'puppeteer';

import { MySQLRepository } from '../database/repository/mysql.repository';

// Prisma Database Connector
const repository = new MySQLRepository();

/**
 *
 * Parse HTML text
 *
 * Use react-parse-html
 */

export async function ProblemScraper(
  page: Page,
  url: string,
  problemNumber: number,
) {
  try {
    const fullURL = `${url}/${problemNumber}`;
    // Load problem location
    await page.goto(fullURL);
    // Title
    const titleSelector = await page.$('#problem_title');
    const titleContent = await page.evaluate(
      (page) => page.textContent,
      titleSelector,
    );

    // Problem Info table
    const tableSelector = await page.$('#problem-info');
    const [timeLimitValue, memoryLimitValue] = await page.evaluate((page) => {
      try {
        const tdSelector = document.querySelectorAll('td');
        const timeLimit = parseInt(tdSelector[0].textContent.split(' ')[0]);
        const memoryLimit = parseInt(tdSelector[1].textContent.split(' ')[0]);
        return [timeLimit, memoryLimit];
      } catch (err) {
        // Syntax Error if querySelectorAll get invalid selector
        return [5, 128];
      }
    }, tableSelector);
    // Description(Problem)
    const descriptionSelector = await page.$('#problem_description');
    const descriptionHTMLText = await page.evaluate((page) => {
      // Trim innerHTML
      const html = page.innerHTML.trim();
      return html ?? '';
    }, descriptionSelector);

    // Input
    const inputSelector = await page.$('#problem_input');
    const inputHTMLText = await page.evaluate((page) => {
      const html = page.innerHTML.trim();
      return html ?? '';
    }, inputSelector);

    // Output
    const outputSelector = await page.$('#problem_output');
    const outputHTMLText = await page.evaluate((page) => {
      const html = page.innerHTML.trim();
      return html ?? '';
    }, outputSelector);

    // Examples
    // CSS Attribute Substring
    // https://drafts.csswg.org/selectors-4/#attribute-substrings
    // Get all of section with id attribute starts with 'sampleinput'
    const exampleInputs = await page.$$eval(
      'section[id^="sampleinput"] > pre',
      (examples) => {
        return examples.map((example) => {
          const html = example.textContent.trim();
          return html ?? '';
        });
      },
    );

    // Output
    const exampleOutputs = await page.$$eval(
      'section[id^="sampleoutput"] > pre',
      (outputs) => {
        return outputs.map((output) => {
          const html = output.textContent.trim();
          return html ?? '';
        });
      },
    );

    const zipInputOutput = zip(exampleInputs, exampleOutputs);
    await repository.saveProblem(
      titleContent,
      descriptionHTMLText,
      inputHTMLText,
      outputHTMLText,
      timeLimitValue,
      memoryLimitValue,
      zipInputOutput,
    );
    // Return true if success
    return true;
  } catch (err) {
    // Retrun false if failed
    return false;
  }
}
