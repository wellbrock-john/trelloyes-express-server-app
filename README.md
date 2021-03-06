# Express Server for the Trelloyes Repo

This is an express server project used for communicating with my trelloyes app and storing data for GET, POST, PUT and DELETE requests!

## Set up

Complete the following steps to use the project properly:

1. Clone this repository to your local machine `git clone URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "current-name",`
7. Test GET and POST requests using Postman

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`
