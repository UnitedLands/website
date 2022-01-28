# UnitedLands

## Development
This repo has been developed with [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VSCode extension in-mind. Using the remote container is the recommended way to start development on this repo since it will do 90% of the setup for you and at the end you'll just need to run `yarn dev` to start

To get started, simply clone this repo to your local computer and open the folder in vscode. If you have the Remote Containers extension installed, VSCode should prompt you to open the folder in the container. Once you click open, VSCode will then start building the container using docker. It will also install all dependencies required for the app to run configure them properly.

If you are having issues getting VSCode's Remote Containers extension to work, please refer to [this](https://www.google.com/search?q=vscode+remote+containers+not+working&oq=vscode+remote+containers+not+working&aqs=chrome..69i57.4166j0j1&sourceid=chrome&ie=UTF-8). Otherwise if everything worked perfectly, you can just run `yarn dev` to start the app.

### Database
The remote container comes pre-configured with a mysql database. You can find the creds for the database in `.devcontainer/container.env`.

### _IT IS IMPORTANT TO NOTE THAT THESE ARE DEVELOPMENT CREDS AND SHOULD NOT BE USED FOR ANYTHING IN PRODUCTION_

To access the database from outside the app, forward port 3306 in your vscode editor. If you already have a local database running on your computer on port 3306, then it will map the port to a random number. 
