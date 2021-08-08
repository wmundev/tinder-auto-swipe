# Auto swiper for tinder
Simple application that helps you to auto swipe on matches so you don't have to do it manually

# Running the app
For automatic login to facebook and then to auto swipe on matches randomly

1. create a `.env` file in the root directory
2. Add in the following configuration
```
ENV=dev
FACEBOOK_USERNAME=(yourfacebookusername)
FACEBOOK_PASSWORD=(yourfacebookpassword)
```
replacing `(yourfacebookusername)` with your actual facebook username and `(yourfacebookpassword)` with your facebook password 
3. type `npm install` to install the relevant packages
4. type `npm start` to start the running of the app and watch the magic unfold


# Manual Instructions
If you want to run it manually using the browser console

1. Open the console and copy and paste the code from `autoSwiper.js`
2. Press enter to run and it will randomly like or dislike profiles
