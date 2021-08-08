require("dotenv").config();
import {getRandomIntInclusive} from "./service/number.service";
import {Browser, Page} from "puppeteer";
import {UserAgentType} from "./model/user-agent";
import {
  createNewPage,
  findElementAndClickIfThereIsOne,
  goToPage,
  initialisePuppeteer,
  sleep,
  waitForXPathThenSelectElement
} from "./service/puppeteer.service";

const config = {
  facebookUsername: process.env.FACEBOOK_USERNAME,
  facebookPassword: process.env.FACEBOOK_PASSWORD
};

if (!config.facebookUsername || !config.facebookPassword) {
  throw new Error("Need to configure env variables for facebook login");
}

async function loginViaFacebook(browser, page) {
  await goToPage(page, "https://tinder.com");

  const loginButton = await waitForXPathThenSelectElement(
    page,
    `/html/body/div[1]/div/div[1]/div/main/div[1]/div/div/div/div/header/div/div[2]/div[2]/a/span`
  );
  await loginButton.click();
  console.log("clicking login button");

  const loginFacebookButton = await waitForXPathThenSelectElement(
    page,
    `/html/body/div[2]/div/div/div[1]/div/div[3]/span/div[2]/button/span[2]`
  );
  await loginFacebookButton.click();
  console.log("clicking login facebook button");

  await sleep(5000);

  const pages = await browser.pages();
  const facebookPopupPage = pages[pages.length - 1];

  const emailFacebookInput = await waitForXPathThenSelectElement(
    facebookPopupPage,
    `//*[@id='email']`
  );
  await emailFacebookInput.type(config.facebookUsername, { delay: 100 });

  const passwordFacebookInput = await waitForXPathThenSelectElement(
    facebookPopupPage,
    `//*[@id='pass']`
  );
  await passwordFacebookInput.type(config.facebookPassword, { delay: 100 });
  await passwordFacebookInput.press("Enter");
}

async function handleTinderPopups(page: Page) {
  await findElementAndClickIfThereIsOne(
    page,
    `//*[@class='Pos(r) Z(1) Fz($xs)']`
  );
  await sleep(1000);
  await findElementAndClickIfThereIsOne(
    page,
    `//*[@class='Pos(r) Z(1) Fz($xs) C($c-bluegray)']`
  );
  await sleep(1000);
  await findElementAndClickIfThereIsOne(page, `//*[@class='Pos(r) Z(1)']`);
}

async function runTinderAutoSwiper(config) {
  const browser: Browser = await initialisePuppeteer();
  const page: Page = await createNewPage(browser, UserAgentType.desktop);
  try {
    //enable location permissions
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://tinder.com/app/recs", [
      "geolocation"
    ]);

    await loginViaFacebook(browser, page);

    await handleTinderPopups(page);
    await sleep(70000);

    for (let i = 0; i < 100; i++) {
      const randomNumber = getRandomIntInclusive(1, 2);
      if (randomNumber === 1) {
        // like
        await page.keyboard.press("ArrowRight");
        console.log("pressed arrow right");
      } else {
        // unlike
        await page.keyboard.press("ArrowLeft");
        console.log("pressed arrow left");
      }

      const randomSleep = Math.random();
      await sleep(5000 * randomSleep + 2000);
    }
  } catch (error) {
    console.error(error);
  } finally {
  }
}

runTinderAutoSwiper(config).then(() => {});
