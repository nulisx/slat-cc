<img width="1892" height="941" alt="hero" src="https://github.com/user-attachments/assets/336d92a3-da70-4be9-a036-167c6624dbff" />

<p align="center">
  <a href="https://slat.cc/">
    <h1 align="center">slat.cc</h1>
  </a>
</p>

<p align="center">
Slat.cc is a feature-rich link-in-bio tool with over 80,000 users.
</p>
<p align="center">
  <a href="https://www.linkedin.com/in/maria-nguyen-le">
    <img src="https://img.shields.io/badge/-MariaLe-blue?style=plastic-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/maria-nguyen-le/" alt="LinkedIn" />
  </a>
</p>
<br/>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#introduction">Intro</a>
    </li>
    <li>
      <a href="#techstack">Techstack</a>
    </li>
    <li><a href="#features-technical">Features</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
  </ol>
</details

<hr />

## Introduction

In this repository, you'll find **snippets of code** from my solo development and design of slat.cc.
Additionally, the `/images` folder contains **actual screenshots** of various pages, features and UI elements of the platform.
This repo doesn’t include full business logic or anything sensitive - just the core structure and my coding approach.

Further down, you can explore the **the nearly complete folder structure** of the project.

## Techstack

- nextjs 15 - framework
- typescript - language
- tailwindcss - css
- mysql - database
- drizzle - orm
- zustand - global state management
- zod - validation
- mailersend - emails
- stripe - payments
- vitest - tests

## Features

- server-side rendering (SSR)
- static site genetation (SSG)
- incremental static regeneration (ISR)
- middleware-based routing - subdomains e.g. docs.slat.cc
- react server components (RSC)
- streaming / partial loading (suspense + loading.tsx)
- dynamic routing with catch-all and optional segments
- nested layouts and parallel routes
- multi-tenancy e.g. maria.slat.cc
- file-based and dynamic metadata generation
- mutations via server actions
- tag-based revalidation (on-demand cache updates)
- login/register with discord oauth
- dynamic og:image generation (custom Open Graph API)
- webhooks for syncing external actions
- rich text editor
- 30+ advanced effects/animations created with css and framer-motion
- media proxy
- file uploading (images, audio, videos)
- integrated with spotify, discord, soundcloud, roblox, yt, twitch, steam, deezer, iconify-icons, github api
- reordering links, widgets, badges etc.
- promise-based toast system (auto cancel / status updates)
- analytics (top links, total and unique views, audience geo)
- admin dashboard for user management and editing articles
- state sync with zustand - instant live biolink preview feature
- analyze and visualize audio frequency - audio visualizer feature
- type-safe forms with zod + react-hook-form
- responsive modals – native drawers for mobile, dialogs on desktop
- partial use of shadcn/ui for consistent styling and accessible primitives

For all features, go to [docs](https://slat.cc/docs)

## Project Structure

```
  ├── app
  │   ├── [username]
  │   │   ├── page.tsx
  │   │   └── opengraph-image.tsx
  │   ├── (root)
  │   │   ├── (auth)
  │   │   └── (marketing)
  │   ├── api
  │   ├── casino
  │   ├── dashboard
  │   ├── docs
  │   │   └── [[...slug]]
  │   ├── error.tsx
  │   ├── not-found.tsx
  │   ├── providers.tsx
  │   ├── manifest.ts
  │   ├── robots.ts
  │   ├── sitemap.ts
  │   └── ...
  ├── components
  │   ├── biolink
  │   ├── ui
  │   ├── editor
  │   ├── layout
  │   ├── form
  │   └── email
  ├── lib
  │   ├── analytics
  │   ├── data
  │   │   ├── actions
  │   │   ├── biolink
  │   │   ├── coments
  │   │   ├── embeds
  │   │   ├── users
  │   │   │   ├── actions
  │   │   │   │   │  ├── select-user.ts
  │   │   │   │   │  ├── update-user.ts
  │   │   │   │   │  ├── index.ts
  │   │   │   │   │  ├── ...
  │   │   │   ├── constants.ts
  │   │   │   ├── schemas.ts
  │   │   │   └── utils.ts
  │   │   ├── orders
  │   │   ├── templates
  │   │   ├── links
  │   │   ├── tracks
  │   │   ├── metadata
  │   │   └── ...
  │   ├── auth
  │   ├── api
  │   ├── stores
  │   ├── drizzle
  │   ├── middleware
  │   ├── zod
  │   ├── webhook.ts
  │   ├── email.ts
  │   ├── ip.ts
  │   ├── bcrypt.ts
  │   ├── stripe.ts
  │   ├── types.ts
  │   └── ...
  ├── public
  ├── tests/casino
  └── ...
```

### Showcase (old)

Small showcase of some features such as tilting card, audio visualizer and thunder effect.

https://github.com/user-attachments/assets/250a19aa-0b7a-48ed-9dfb-a129b6cf737f

### Hero (old)

![image](https://github.com/user-attachments/assets/22fbdb42-f2cb-4324-8d61-39435530997d)
