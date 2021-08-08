import {
  Browser,
  DirectNavigationOptions,
  ElementHandle,
  Page
} from "puppeteer";
import {
  USER_AGENTS_MOBILE,
  USER_AGENTS_PC,
  UserAgentType
} from "../model/user-agent";
import { getRandomIntInclusive } from "./number.service";

const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());

const PAGE_TIME_OUT = 600000;

export async function initialisePuppeteer(): Promise<Browser> {
  const currentEnvironment = process.env.ENV || "N/A";

  const puppeteerOptions =
    currentEnvironment === "dev"
      ? {
          headless: false,
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        }
      : {
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          executablePath: "google-chrome-stable"
        };

  return await puppeteer.launch(puppeteerOptions);
}

export function pageGoToOptions(): DirectNavigationOptions {
  return {
    timeout: PAGE_TIME_OUT,
    waitUntil: "domcontentloaded"
  };
}

export async function goToPage(page: Page, url: string): Promise<void> {
  await page.goto(url, pageGoToOptions());
}

export async function goToPageWaitForNetworkIdle(
  page: Page,
  url: string
): Promise<void> {
  await page.goto(url, {
    timeout: PAGE_TIME_OUT,
    waitUntil: "networkidle0"
  });
}

export async function goToPageWaitForLoad(page: Page, url: string): Promise<void> {
  await page.goto(url, {
    timeout: PAGE_TIME_OUT,
    waitUntil: "load"
  });
}

export async function getLastOpenedPage(browser: Browser): Promise<Page> {
  const allCurrentPages = await browser.pages();
  // we assume that the last opened page is the one we just opened
  return allCurrentPages[allCurrentPages.length - 1];
}

export async function finallyTasksAfterScraping(browser: Browser | undefined) {
  if (browser) {
    await browser.close();
  }
}

export async function closePage(page: Page | undefined) {
  if (page && !page.isClosed()) {
    await page.close();
  }
}

export async function createNewPage(
  browser: Browser,
  userAgentType: UserAgentType
): Promise<Page> {
  const page = await browser.newPage();

  if (userAgentType === UserAgentType.desktop) {
    const randomOptionNumber = getRandomIntInclusive(
      0,
      USER_AGENTS_PC.length - 1
    );
    await page.setUserAgent(USER_AGENTS_PC[randomOptionNumber]);
  } else if (userAgentType === UserAgentType.mobile) {
    const randomOptionNumber = getRandomIntInclusive(
      0,
      USER_AGENTS_MOBILE.length - 1
    );
    await page.setUserAgent(USER_AGENTS_MOBILE[randomOptionNumber]);
  }

  // we currently want images
  // await this.setPageInterceptionToIgnoreImages(page);

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(PAGE_TIME_OUT); //10 minutes

  // dismiss dialog if it appears
  page.on("dialog", async dialog => {
    console.log("Dialog appeared, dismissing");
    await dialog.dismiss();
  });

  return page;
}

export async function waitForXPathThenSelectElement(
  page: Page,
  xpath: string
): Promise<ElementHandle> {
  await page.waitForXPath(xpath);
  await sleep(500);
  const elementHandles = await page.$x(xpath);
  if (elementHandles.length !== 1) {
    throw new Error(`Could not find exact element using xpath: ${xpath}`);
  }
  return elementHandles[0];
}

export async function setPageInterceptionToIgnoreImages(page: Page) {
  await page.setRequestInterception(true);
  page.on("request", interceptedRequest => {
    const url = interceptedRequest.url();
    if (
      url.endsWith(".png") ||
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".webp")
    ) {
      return interceptedRequest.abort();
    }

    const headers = interceptedRequest.headers();
    if (headers && headers["sec-fetch-dest"] === "image") {
      return interceptedRequest.abort();
    }

    interceptedRequest.continue();
  });
}

export async function sleep(timeToSleep: number) {
  await new Promise(resolve => setTimeout(resolve, timeToSleep));
}

export async function findElementAndClickIfThereIsOne(page: Page, xpath: string){
  const elementHandles = await page.$x(
      xpath
  );
  await onlyClickIfThereIsAnElement(elementHandles)
}

export async function onlyClickIfThereIsAnElement(elementHandle: ElementHandle[]){
  if(elementHandle.length === 1){
    await elementHandle[0].click();
  }
}
