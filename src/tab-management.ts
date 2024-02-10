import { Browser, Page } from 'puppeteer';

export const allocatePages = async (browser: Browser, chunk: number) => {
  const pages: Page[] = [];
  for (let i = 0; i < chunk; i++) {
    pages.push(await browser.newPage());
  }
  return pages;
};

export const closePages = async (pages: Page[]) => {
  await Promise.all(
    pages.map((page) => {
      return page.close();
    }),
  );
  return true;
};
