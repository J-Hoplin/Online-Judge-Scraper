import { Page } from 'puppeteer';

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
        return [0, 0];
      }
    }, tableSelector);
    // Description
    const description = await page.$('#problem_description');
    const descriptionHTMLText = await page.evaluate((page) => {
      return page.innerHTML.trim();
    }, description);

    return true;
  } catch (err) {
    // Retrun false if failed
    return false;
  }
}
