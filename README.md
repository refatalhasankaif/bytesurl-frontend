# BytesURL

A modern, full-featured URL shortener built with Next.js and Tailwind CSS, designed for performance, scalability, and an exceptional user experience. This platform goes beyond simple link shortening by combining powerful analytics, flexible subscription plans, and an intelligent AI assistant.

![Page](https://i.ibb.co.com/NddPjJYp/Screenshot-From-2026-04-09-13-34-57.png)

## Live URLs

| Service   | Link |
|----------|------|
| Frontend | https://bytesurl.vercel.app |
| Backend  | https://bytesurl.onrender.com |

## Repositories

| Service   | Link |
|----------|------|
| Frontend | https://github.com/refatalhasankaif/bytesurl-frontend |
| Backend  | https://github.com/refatalhasankaif/bytesurl-backend |


## Tech Stack

**Frontend**
- Next.js 16
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Stripe Payments
- TanStack Query
- EmailJS (contact form)

**Backend**
- Node.js, Express, and TypeScript
- PostgreSQL (NeonDB) with Prisma ORM
- Firebase Admin SDK
- Stripe Webhooks
- nanoid, ua-parser-js, geoip-lite
- AI integration using the Groq API

## Features

- Shorten long URLs with optional custom aliases
- Unique links generated using nanoid (8-character random string)
- Detailed click analytics (device, browser, OS, country, referrer)
- Firebase Authentication (email/password + Google)
- Three subscription plans: FREE (10 URLs), PRO (500 URLs/month), ULTIMATE (unlimited)
- One-time payments via Stripe
- User dashboard for managing shortened links
- Administrative panel for users, URLs, analytics, and payments
- Password reset with custom email templates
- Fully responsive light-themed UI
- AI integration using the Groq API for in-app assistance