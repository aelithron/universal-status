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
Selfhosting the app is a bit more complex, but can be done! I suggest using Docker, though I am sadly unable to provide a prebuilt image for now.
1. Set up the following environment variables:
- `MONGODB_URI`: A MongoDB connection string to your database server.
- `MONGODB_DB`: The name of your database. Make sure it contains a collection called `statuses`!
- `AUTH_SECRET`: A random string to secure user sessions. You can generate this with the command `openssl rand -base64 33` on Linux.
- `AUTH_URL`: The URL of your app, formatted as `https://[domain].[tld]`. You can add a subdomain if your instance is on one, and **DO NOT** add an extra slash at the end.
- `DISCORD_ID` and `DISCORD_SECRET`: A Discord OAuth ID and Secret. This will enable Discord login. You can configure this on the [Discord Developers panel](https://discord.com/developers/applications), make sure to create an application and follow their setup. Your OAuth2 Redirect is `https://[domain].[tld]/api/auth/callback/discord`.
- `SLACK_ID` and `SLACK_SECRET`: Optional, a Slack OAuth ID and Secret. This enables Slack login, as well as the ability to set statuses on Slack. You can create a Slack app and add its ID and secret here. No links are provided, as it's a complicated process to set up. Your redirect URLs are `https://[domain].[tld]/api/auth/callback/slack` and `https://[domain].[tld]/api/provider/slack` (add both to the box).
- `GITHUB_ID` and `GITHUB_SECRET`: Optional, a GitHub App ID and Secret. This enables setting statuses on GitHub, as well as login. You can create a GitHub **OAuth app** and add its ID and secret here. Configure an app on the [GitHub developer portal](https://github.com/settings/developers), and your redirect URL is `https://[domain].[tld]/api`. *Note that GitHub Apps will not work, you must create an OAuth App instead.*
2. Build a Docker image for the app. To make sure the build goes smoothly, add a file in the source code directory called `.env.local` with the text `MONGODB_URI=[your connection string]`. Then, I suggest running `docker build -t universal-status:v1.4.0 .` from the same directory.
3. Run the image with either a `docker run` command or Docker Compose. If you're so inclined, you can use Kubernetes also. Make sure to include the environment variables!
## Screenshot
![IMG](https://hc-cdn.hel1.your-objectstorage.com/s/v3/8c39a7bc4836269f0e759571330e5c635b48b03b_image.png)
## Credits
- Inspired by EchoFeed and Status.Cafe
- Icons from Font Awesome
