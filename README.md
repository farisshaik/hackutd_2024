# What's The Move
HackUTD 2024 Submission

[Figma Demo](https://www.figma.com/design/zMe4fgzklZ31hd1UpH5qsT/What's-The-Move-Figma?node-id=0-1&node-type=canvas&t=mp1OTd1lu8r1LJ1l-0)

## Inspiration
Our friend group lives scattered across DFW, so it can be very time-consuming to decide on a place to meet where the drive isn't too out of the way for one person. This led to us coming up with the idea of WTM. A survey by Eventbrite revealed that 69% of individuals find it difficult to coordinate plans with friends due to varying schedules and locations. We want to ensure that meeting spots can be conveniently decided on without the hassle of checking the distance from everyone.

## What it does
WTM calculates a user's inverse weighted midpoint between them and their friends and then uses that coordinate to find a point of interest of choice near the midpoint. This ensures everyone has a proportional drive to stay efficient on gas and time.

## How we built it
We used react.js for the frontend, and hosted the website on a serverless backend using express.js and firebase functions. We used a lot of the features from the Google Maps API such as geocoding to get the coordinates, and the query to find locations of interest near a coordinate. We also made our own API to calculate the inverse weighted midpoint formula.

## Challenges we ran into
At first, we were using React Native and it gave us a lot of trouble attempting to run the emulators, so we switched to React. After the switch, the Google Places API was giving many errors that took hours to solve. Also, the Pinata API was giving errors with uploading media files near the deadline.

## Accomplishments that we're proud of
We are proud of how the Midpoint API turned out and how the main purpose of the application works. The calculated midpoint is effectively found despite the number of friends entered, and a suitable list of locations is provided too.

## What we learned
We learned that you can never have enough time and that it's important to figure out the tech stack as early as possible, so any late changes do not happen

## What's next for What's The Move
In the future, we plan to implement group voting, personalized recommendations, and a feature to aid with availability and booking.


