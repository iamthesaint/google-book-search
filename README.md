# Google Books Search (Refactor)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Table of Contents

- [Description](#description)
- [Visuals](#visuals)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Key Features](#key-features)
- [Usage](#usage)
- [Support](#support)
- [Contributing](#contributing)
- [License](#license)

## Description
A Google Books API search engine -- refactored from RESTful API, now powered by GraphQL, built with Apollo Server. This search engine allows users to create a personal account to organize books they have read and/or would like to read. Utilizing the Google Books API, the app provides a Title, Author(s), Image, Description, and Link to more information. The backend is built using a GraphQl API that interfaces with the MongoDB, allowing users to securely save and remove books as their reading habits progress and change.

## Visuals
<img width="1102" alt="Screenshot 2024-10-20 at 7 25 37 PM" src="https://github.com/user-attachments/assets/67dfb6e1-1f36-46dc-a5fb-a8e348b3805e">
<img width="1512" alt="Screenshot 2024-10-20 at 7 26 28 PM" src="https://github.com/user-attachments/assets/3efb4e6d-298a-4097-9aa1-11eba1dbe38f">
<img width="1103" alt="Screenshot 2024-10-20 at 7 29 39 PM" src="https://github.com/user-attachments/assets/295cd99f-71dd-47cb-945b-44147090b99b">

## Installation
```npm install``` ```npm run build``` ```npm run start```

## Technologies Used
GraphQL: for performing queries and mutations from MongoDB

MongoDB Atlas: cloud-based NoSQL database

Apollo Server: for serving GraphQL queries and mutations

React: for building interactive front-end

Vite: for fast front-end build processes

## Key Features
Book Search: Search for books within the Google Books API

User Authentication: Secure login and signup using JSON Web Tokens

Save and Manage Books: Logged-in users are able to save and delete books from their personal collection

Responsive Design: Optimized for desktop and mobile usage

Queries: GraphQL allows minimal API requests using queries

## Usage
Click the Signup button on the homepage to create a new account, or Login to start saving books. Use the search bar to search for books by title or author. Results appear allowing you to view details about each book. Click the 'Save this book' button to save to your collection. Choose to view your Saved Books or Search for Books via the navigation bar.

## Support
For support with this app, contact me at stephenie2@me.com or visit my Github Account: github.com/iamthesaint

## Contributing
Open to contributions; Feel free to reach out for more information!

For contributions: clone the repo https://github.com/iamthesaint/google-book-search, npm install, create a .env file for the server with the following: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority, npm run start:dev

## License
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the MIT license.
Please see https://opensource.org/licenses/MIT for more information.

## Project status
This project was refactored to improve performance. Future improvements will include pagination, advanced user profiles allowing different "libraries" and collections, a list of recommended books based on current reading style, as well as a social feature to share books among friends.
