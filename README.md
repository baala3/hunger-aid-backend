# FOOD WASTE MANAGEMENT

### Project Problem Statement:

Every restaurant has perfectly good food that they cannot sell at the end of their day.
Large amount of these food goes wasted and is thrown away in the dumping zone.
How can one efficiently use this food to kill someone’s hunger? What if there is a
platform which connects restaurants to institutes such as food banks. With this platform
not only, food banks can serve more hungry people additionally restaurants will also
have a meaningful channel to distribute or dispose of the surplus food. It’s a win-win
situation where business can contribute to a sustainable environment in a
meaningful way at the same time charities help fight food poverty.  
For this to happen both food banks and restaurants will have to register
with the platform and exchange information regarding how much food is remaining and
food banks can collect those food from the nearest restaurants

### Proposed Solution/Project Idea:

Using MongoDB, we are developing and hosting a 3-Tier Web Application which enables everyone to post food availablity in their known location.
The application provides a portal where local charities can sign up to this platform. When notified about food availability, the charity responds by accepting to collect the food from the location.

### Features List

1. Sign up form for new user to create an account. A new user record is created in MongoDB. If an already existing user tries to sign up, he is prevented in doing the same.
2. Login Page to allow only authorized users to login. Performs validation for username and password match. A role based login is enabled to redirect users to either Business Home Page or Charity Home Page.
3. Business Home Page provides a widget to upload leftover food images. It also takes in user input for amount of food cooked, food wasted. The food images are uploaded to cloudinary.
4. User can trace food location and directions from his current location.
5. User can update his own profile.
6. User can upvote if the information is helpful.
7. User can contact our team if they face any kind of issues

Tech Stack used:

1. MongoDB, (Mongoose)
2. Node.js
3. React
4. Express
5. Material-UI
6. Mapbox-gl
7. ftp-mail
8. JWT (Authentication)
9. Redux, (React-Redux)
10. React-swipeable-views

# Hosted on Netlify

have a look [live url](https://food-waste-management-system.netlify.app/)
