# petsoft

A simple web application that allows users to sign up and pay for a lifetime subscription to a pet-list software that allows pet daycares to keep track of their furry clientele!

<img width="1920" alt="Screenshot 2024-09-02 at 2 46 59 PM" src="https://github.com/user-attachments/assets/b32a7320-d50b-46fb-98b0-f2b3e289bf6d">


## Motivation

This is the second project that I've done with NextJS. This is the final project from an online course made by ByteGrad that has helped me navigate through the current tech used in websites today. The whole course had taken two months for me to get through and has not only given me a strong foundation in HTML, CSS, and JS, but also has instructed me in current practice of ReactJS and NextJS! This project is the culmination of everything I've learned in these two months, and I am excited to apply this newfound and learned knowledge to future web applications that I will be building. Please do look forward to my future work!

## Description

- allow users to sign up for an account
- allow users to log in to their existing account
- used stripe to handle our transaction side of the web app
- implemented middleware that will not allow the user to use the application unless they've paid for access to the web app through stripe
- allows users to keep track of furry clientele they may be watching over at the moment
- allows users to observe various information on their clients like their name, age, picture, owner's name, and notes about their clients
- allows users to checkout their clients
- allows users to edit information on their clients
- allows users to add additional clients to their list and fill out information concerning their clients for their records
- allows users to log out of their accounts to which they would need to log back in if they want access to the web app again'
- used prism to help interact with our database
- used Zod to help enforce the information submitted through forms as well as type check information in and out of the database
- used tailwind css to style and format our website into a minimalistic and clean format
- used vercel to host our website
- used postgres for our database
- used ngrok as our api endpoint due to security issues and was only used in development
- worked with JWT for our sign in features as well as store information about our user in the JWT to facilitate proper sign in and payment for our services
- used optmistic UI to help make our UI more snappy for a beter user experience
- used shadcn for UI components like dialogue boxes for our forms and button components for changes in button style

## Video

Check out a video demo here! https://youtu.be/xU_DOwHtLyM

## Website Link

Check out the web app here! https://petsoft-flax-two.vercel.app

NOTE: Please do not use your actual payment information in stripe. Please input "4242424242424242" as the card number, and you can input anything else into the other form items. This should allow you to pass through the stripe and play with the rest of the web app. Thanks!

## Tech Stack

NextJS, Typescript, TailwindCSS, ReactJS, Vercel, Postgress, Prism
