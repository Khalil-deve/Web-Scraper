# Web Scraper

A modern web scraping application built with [Next.js](https://nextjs.org), [React](https://react.dev), and [Supabase](https://supabase.com). This project demonstrates how to build a full-stack web app that scrapes movie data and manages a watchlist.

## Features

- Movie search and display
- Add/remove movies to a personal watchlist
- User authentication via Supabase
- Responsive UI with [Tailwind CSS](https://tailwindcss.com)
- Fast development with Next.js App Router

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` and add your Supabase credentials.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` – Next.js App Router pages and layouts
- `components/` – Reusable React components (Header, MovieCard, Watchlist, etc.)
- `lib/supabase.js` – Supabase client setup
- `.next/` – Build output (ignored in Git)
- `public/` – Static assets

## Technologies Used

- Next.js
- React
- Supabase
- Puppeteer (for scraping)
- Tailwind CSS

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred platform. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
