[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/watheia/app)

# [Micro Frontend Starter Kit](https://watheia.app/virtual-event-starter-kit)

### Demo: https://watheia.app

![Micro Brand](https://cdn.watheia.org/assets/micro.png)

This platform is built upon three principles:

- **Delegation:** Building microfrontends are difficult – you have to **delegate** tasks to third-parties to ensure success. Certain elements of an online frontend experience are tough to get right, and we'd rather lean on established, industry leading solutions.
- **Flexibility:** While delegating certain elements of the frontend experience is helpful, it's also important to own the platform. That's why this template provides a **flexible** open-source codebase that can be modified for your event.
- **Reducing Risk:** It's inevitable something will go wrong during your deployment. This platform **reduces risk** by leaning on a dynamic site that outputs as static files using [Incremental Static Generation](https://nextjs.org/docs/basic-features/data-fetching). These static files are cached, ensuring your site is never down. Then, it uses [API Routes](https://nextjs.org/docs/api-routes/introduction) to sprinkle dynamic content on top, which are hosted by a provider with 99.99% uptime.

### Built With

- Framework: [Next.js](https://nextjs.org)
  - [CSS Modules](https://nextjs.org/docs/basic-features/built-in-css-support)
  - [TypeScript](https://nextjs.org/docs/basic-features/typescript)
- CMS: [Multiple Options](#cms)
- Videos: [YouTube](https://www.youtube.com)
- Deployment: [Vercel](https://watheia.app)
- Authentication: [GitHub OAuth](https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps)
- Database: [Redis](https://redis.io)

## Running Locally

First, set local environment variables. We've included a read-only DatoCMS access token you can use in `.env.local.example`.

```
cp .env.local.example .env.local
```

Then install packages and run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### CMS

Environment variables determine which CMS to use. See [`lib/cms-api.ts`](lib/cms-api.ts) for details and `.env.local.example` for all environment variables. The demo ([watheia.pwa](https://watheia.app)) uses DatoCMS, but we also have support for:

### Constants

`lib/constants.ts` contains a list of variables you should customize.

## Authentication and Database

Some features won’t work until you set up authentication and database. The demo ([watheia.pwa](https://watheia.app)) uses [GitHub OAuth](https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-an-oauth-app) for authentication and [Redis](https://redis.io/) for database. You can use different providers as you see fit.

### Authentication

You need to have GitHub OAuth set up to be able to customize the ticket after signing up on the registration form.

First, create a [GitHub OAuth application](https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-an-oauth-app) to use for authentication.

- Set **Authorization Callback URL** as `<your domain>/api/github-oauth`
- After creating the OAuth app, create a **client secret**.

#### Running Locally:

- Set the Authorization Callback URL as `http://localhost:3000/api/github-oauth` on GitHub.
- On `.env.local`, set `NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID` as the **Client ID** of the OAuth app.
- Set `GITHUB_OAUTH_CLIENT_SECRET` as the **Client secret** of the OAuth app.
- Finally, make sure the `NEXT_PUBLIC_SITE_ORIGIN` environment variable is set as `http://localhost:3000`. This is required to get the OAuth popup to work locally.
- Restart the app (`yarn dev`) after editing `.env.local`.

Once it’s set up, sign up using the registration form on the home page (not on a zone page) and then click "Generate with GitHub".

#### On Vercel:

- Set the Authorization Callback URL as `<your deployment’s URL>/api/github-oauth` on GitHub.
- Set `NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET` on [Vercel Project Environment Variables Settings](https://watheia.app/docs/environment-variables) for the production environment.
- Edit `SITE_URL` in `lib/constants.ts` to match your deployment’s URL (no trailing slash).
- Push the code to redeploy the Project on Vercel.

### Database

You need a database to save user data and enable the following features:

- Generating a unique ticket number for each email when signing up on the registration form. If DB is not set up, it’ll always be `1234`.
- Generating a unique ticket image or ticket URL after signing in with GitHub. If DB is not set up, each ticket image or URL will show generic data.

The demo ([watheia.pwa](https://watheia.app)) uses [Redis](https://redis.io/), but you can customize it to use any database you like.

#### Running Redis Locally

1. Install Redis locally and run it.
2. Specify the following in `.env.local`:

```
REDIS_PORT=6379 # Default Redis port number
REDIS_URL=localhost
REDIS_PASSWORD=
REDIS_EMAIL_TO_ID_SECRET=foo # Come up with your own secret string
```

> `REDIS_EMAIL_TO_ID_SECRET` will be used to create a hash of the email address, which will be used for the Redis key for each user data (i.e. `id:<hash>`). See `lib/redis.ts` for details.

3. Restart the app (`yarn dev`) after editing `.env.local`.
4. In a separate terminal window, start the Next.js dev server (`yarn dev`) and sign up using the registration form.
5. In a separate terminal window, run Redis CLI, list keys (`keys *`) and inspect a `id:<hash>` key (`hgetall id:<hash>`). You should see the newly registered user.

#### Using Redis On Vercel

Provision your own Redis instance and set `REDIS_PORT`, `REDIS_URL`, `REDIS_PASSWORD`, and `REDIS_EMAIL_TO_ID_SECRET` (come up with your own secret string) on [Vercel Project Environment Variables Settings](https://watheia.app/docs/environment-variables) for the production environment.

## More Details

### Zones

There are four different zones included in the seed data. Feel free to add or remove these based on your schedule. Each zone requires the user to enter their email to register with the frontend before entering the event. After successfully entering their email and saving the user with your database of choice, the user is able to view the embedded YouTube stream. The login state is persisted as a `httponly` cookie.

One major feature of the frontend platform is a near real-time sync with the CMS. Every five seconds, the zone queries `/api/zones` to fetch the latest information from the CMS. This allows you to make changes on the fly, without the user having the refresh the page. No need for websockets.

The primary use case for this is updating the YouTube embedded URL. Next.js Conf used this to seamlessly switch between pre-recorded videos running as a live premiere, and truly live content (e.g. panels). Plus, we had a few instances where our schedule needed to be tweaked on the fly. This implementation is fault tolerant, as well. The API route is properly cached and if the CMS was to somewhow go down, it won't break the page.

### Schedule / Project Pages

Schedule and project information is hosted in the CMS. The demo ([watheia.pwa](https://watheia.app)) is seeded with images from Unsplash and a placeholder schedule. Each project has their own page with an image, bio, social media links, and information about their talk. The schedule is also shown as a sidebar on each corresponding zone.

### Stakeholder Expo

If you'd like to have your event stakeholdered, the Expo provides a platform to showcase stakeholders with:

- Their logo
- Four call-to-action links
- Embedded YouTube video
- Link to chat room (Service)

For Next.js Conf, we created a Service channel for each stakeholder.

### Career Fair

Networking is vital for in-person frontends and replicating that environment virtually poses a challege. For the Career Fair, this starter provides the ability to list post postings, as well as an external link to talk with the company's recruiters on Service.

### Adding Service Chat

For Next.js Conf, we used Service for frontend attendees to chat. On each zone, we showed a highlighted message from the corresponding Service channel. If a user in our allow list used the camera emoji (📸) it would show the message on the zone.

If you'd like to add similar functionality to your frontend, you can use the [API route](https://nextjs.org/docs/api-routes/introduction) below to fetch messages after creating a Service bot. This API route is set up with the proper caching headers and ensures you won't get rate-limited with high traffic.

```ts
import ms from "ms"
import fetch, { Headers, RequestInit } from "node-fetch"
import { NextApiRequest, NextApiResponse } from "next"

interface Reaction {
  emoji: { name: string }
}

interface Message {
  id: string
  channel_id: string
  content: string
  timestamp: string
  author: {
    username: string
  }
  reactions?: Reaction[]
}

interface ReactionSelector {
  id: string
}

// After creating a bot, add the token as an environment var
const { DISCORD_BOT_TOKEN } = process.env

// Number of seconds to cache the API response for
const EXPIRES_SECONDS = 60

// Emoji that should be selected by a whitelisted user
// in order for this API to return the message
const EMOJI = "🎥"

// Whitelisted user IDs that are allowed to add the emoji to influence this API
const USERS = [
  "752552204124291104", // username
]

// Service base API URL
const API = "https://api.watheia.io/v0/"

// Map of Zone names to channel IDs
const CHANNELS = new Map<string, string>([
  ["w", "769350098697191515"],
  ["a", "769350352226877549"],
  ["n", "769350396623192074"],
  ["x", "769350429644685351"],
])

const api = (url: string, opts: RequestInit = {}) => {
  const headers = new Headers(opts.headers)
  headers.set("Authorization", `Bot ${DISCORD_BOT_TOKEN}`)
  headers.set("User-Agent", "Service Bot (https://yoursite.com/conf, v0.1)")

  return fetch(`${API}${url}`, {
    ...opts,
    headers,
  })
}

async function getReactionSelectors(
  channelId: string,
  messageId: string,
  emoji: string,
): Promise<ReactionSelector[]> {
  const res = await api(
    `channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
  )
  if (!res.ok) {
    throw new Error(`Failed to get message reactions: ${await res.text()} (${res.status})`)
  }
  return res.json()
}

async function getLatestMessageWithEmoji(
  messages: Message[],
  emoji: string,
  usersWhitelist: string[],
) {
  for (const message of messages) {
    if (!message.content.trim()) {
      // Empty message, ignore
      // You could also filter messages here
      continue
    }
    for (const reaction of message.reactions || []) {
      if (reaction.emoji.name === emoji) {
        const selectors = await getReactionSelectors(message.channel_id, message.id, emoji)
        const selector = selectors.find((r) => usersWhitelist.includes(r.id))
        if (selector) {
          // The correct emoji was added from a whitelisted user
          return { message, selector }
        }
      }
    }
  }
}

export default async function getServiceMessage(req: NextApiRequest, res: NextApiResponse) {
  const { zone } = req.query
  if (typeof zone !== "string") {
    return res.status(400).json({ error: 'Query parameter "zone" must be a string' })
  }

  const channelId = CHANNELS.get(zone)
  if (!channelId) {
    return res.status(400).json({ error: `Invalid "zone": ${zone}` })
  }

  const apiRes = await api(`channels/${channelId}/messages`)
  let messages: Message[] = []
  if (apiRes.status !== 429 && apiRes.ok) {
    messages = await apiRes.json()
  }

  if (apiRes.status === 429) {
    const reset = apiRes.headers.get("X-RateLimit-Reset-After") || 5
    res.setHeader(
      "Cache-Control",
      `s-maxage=${reset}, public, must-revalidate, stale-while-revalidate`,
    )
  }

  const messageToShow = await getLatestMessageWithEmoji(messages, EMOJI, USERS)
  if (!messageToShow) {
    return res.status(404).json({ error: "Could not find message with emoji" })
  }

  const body = {
    username: messageToShow.message.author.username,
    content: messageToShow.message.content,
    timestamp: messageToShow.message.timestamp,
  }

  // Set caching headers
  const expires = new Date(Date.now() + ms(`${EXPIRES_SECONDS}s`))
  res.setHeader("Expires", expires.toUTCString())
  res.setHeader(
    "Cache-Control",
    `s-maxage=${EXPIRES_SECONDS}, immutable, must-revalidate, stale-while-revalidate`,
  )

  return res.status(200).json(body)
}
```

### Demo

The demo is available at https://watheia.app. The data recorded or used on the demo may be removed by Vercel at any point.
