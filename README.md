# Universal Status
Put your status on many platforms at once :3

![IMG](https://hackatime-badge.hackclub.com/U08RJ1PEM7X/universal-status)

<div align="center">
  <a href="https://shipwrecked.hackclub.com/?t=ghrm" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/739361f1d440b17fc9e2f74e49fc185d86cbec14_badge.png" 
         alt="This project is part of Shipwrecked, the world's first hackathon on an island!" 
         style="width: 35%;">
  </a>
</div>

(I'm also shipping some new work on this to [Fudge Fudge Fudge](https://fudge.hackclub.com/), another Hack Club event :3c)

## Features
- Status history
- Expiring statuses
- Minimalist user interface
- Updates your status on other platforms
  - Slack (via OAuth)
  - GitHub (via OAuth)
  - Status.Cafe (via direct authentication)
- Coming soon platforms:
  - Discord (via [Rich Presence](https://github.com/aelithron/universal-status-discord))
  - possibly others
- Simple APIs for reading and writing statuses (both REST and GraphQL)
## Usage
The app is quite easy to use! Go to [status.novatea.dev](https://status.novatea.dev) and sign in with either Discord (suggested), GitHub, or (only if you are in Hack Club) Slack. Then, if you want to store status updates on other platforms, go to the Settings page and authorize accounts on other platforms.
### Selfhosting
Selfhosting the app is a bit more complex, but can be done! I suggest using Docker, and these instructions are for a Docker image.
1. Set up the following environment variables:
- `MONGODB_URI`: A MongoDB connection string to your database server.
- `MONGODB_DB`: The name of your database. Make sure it contains a collection called `statuses`!
- `AUTH_SECRET`: A random string to secure user sessions. You can generate this with the command `openssl rand -base64 33` on Linux.
- `AUTH_URL`: The URL of your app, formatted as `https://[domain].[tld]`. You can add a subdomain if your instance is on one, and **DO NOT** add an extra slash at the end.
- `DISCORD_ID` and `DISCORD_SECRET`: Optional, a Discord OAuth ID and Secret. This will enable Discord login. You can configure this on the [Discord Developers panel](https://discord.com/developers/applications), make sure to create an application and follow their setup. Your OAuth2 Redirect is `https://[domain].[tld]/api/auth/callback/discord`.
- `SLACK_ID` and `SLACK_SECRET`: Optional, a Slack OAuth ID and Secret. This enables Slack login, as well as the ability to set statuses on Slack. You can create a Slack app and add its ID and secret here. No links are provided, as it's a complicated process to set up. Your redirect URLs are `https://[domain].[tld]/api/auth/callback/slack` and `https://[domain].[tld]/api/provider/slack` (add both to the box).
- `GITHUB_ID` and `GITHUB_SECRET`: Optional, a GitHub App ID and Secret. This enables setting statuses on GitHub, as well as login. You can create a GitHub **OAuth app** and add its ID and secret here. Configure an app on the [GitHub developer portal](https://github.com/settings/developers), and your redirect URL is `https://[domain].[tld]/api`. *Note that GitHub Apps will not work, you must create an OAuth App instead.*
2. You can use either of the below methods to quickly deploy.
**Make sure to fill in the empty quotation marks with the environment variables from step 1!**
Also, optional variables are commented out, but you can uncomment them to use them.
**Finally, make sure you enable at least one authentication method!**
#### With Docker Compose
Copy the following Compose file to your server or computer, and name it `compose.yaml`:
```yaml
services:
  universal-status:
    image: ghcr.io/aelithron/universal-status:latest
    container_name: universal-status
    restart: unless-stopped
    environment:
      MONGODB_URI: ""
      MONGODB_DB: ""
      AUTH_SECRET: ""
      AUTH_URL: ""
      # DISCORD_ID: ""
      # DISCORD_SECRET: ""
      # SLACK_ID: ""
      # SLACK_SECRET: ""
      # GITHUB_ID: ""
      # GITHUB_SECRET: ""
    ports:
      - 3000:3000
```
Then, simply run `docker compose up -d` in the directory of the file!
#### With `docker run`
Run the following command on your server or computer:
```bash
docker run -d \
  --name universal-status \
  -p 3000:3000 \
  -e MONGODB_URI="" \
  -e MONGODB_DB="" \
  -e AUTH_SECRET="" \
  -e AUTH_URL="" \
  # -e DISCORD_ID="" \
  # -e DISCORD_SECRET="" \
  # -e SLACK_ID="" \
  # -e SLACK_SECRET="" \
  # -e GITHUB_ID="" \
  # -e GITHUB_SECRET="" \
  --restart unless-stopped \
  ghcr.io/aelithron/universal-status:latest
```
- Note: If you want to use something else (like Kubernetes), the Docker image can be found on the Packages tab (or simply pulled as `ghcr.io/aelithron/universal-status:latest`). Make sure to include the environment variables!
## Screenshot
![IMG](https://hc-cdn.hel1.your-objectstorage.com/s/v3/9154f332f0b0e82d_image.png)
## Credits
- Inspired by EchoFeed and Status.Cafe
- Icons from Font Awesome
