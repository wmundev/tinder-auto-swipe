function setTimeoutWrapper(cb, ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            cb();
            resolve();
        }, ms)
    });
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

async function swiper() {
    const upgradeYourLikeNoThanks = document.evaluate("/html/body/div[2]/div/div/button[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(upgradeYourLikeNoThanks && upgradeYourLikeNoThanks.innerText && upgradeYourLikeNoThanks.innerText.toUpperCase() === "NO THANKS"){
        upgradeYourLikeNoThanks.click()
    }

    const likeButton = document.evaluate("/html/body/div[1]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/div[4]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const dislikeButton = document.evaluate("/html/body/div[1]/div/div[1]/div/main/div[1]/div/div/div[1]/div/div[2]/div[2]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    const randomOption = getRandomIntInclusive(1, 2)
    if(randomOption === 1){
        likeButton.click()
    } else {
        dislikeButton.click()
    }
}

async function tinderSwiper() {
    await setTimeoutWrapper(swiper, Math.floor(Math.random() * 2000) + 1000);
    tinderSwiper();
}

tinderSwiper();
