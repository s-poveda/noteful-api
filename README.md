# express-boilerplate
Basic boilerplate for initializing express projects

## Set up
Use `npm run setup` to set up your project automatically. See **Scripts** for defaults.

If `npm run setup` fails, or you want to configure manually, complete the following steps to start a new project:

1. Clone this repository to your local machine `git clone https://github.com/s-poveda/express-boilerplate [NEW-PROJECT-NAME]`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Set up the application `npm run setup -- [name of your project]`

- `package.json`

	* `name` will be the current directory name if no argument is passed. Always lower case.


- `example.env` will be replaced with `.env`


- Git history will be reinitialized.


- Installs all dependencies


Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Run the tests and watch for changes `npm tw`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
