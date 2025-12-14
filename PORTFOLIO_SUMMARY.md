# Personal Knowledge Tracker - Portfolio Summary

## Overview

Personal Knowledge Tracker (PKT) is a full-stack web application designed to help users capture, summarize, and retain knowledge from online content. The platform combines AI-powered summarization with spaced repetition techniques to enhance long-term learning and information retention.

## Key Features

- **AI-Powered Summarization**: Automatically generates structured summaries from URLs or text using Google Gemini API
- **Chrome Extension**: Browser extension (Manifest V3) for quick content capture directly from web pages
- **Spaced Repetition System**: Automated email reminders scheduled at optimal intervals (immediate, 2 days, 3 days) to reinforce learning
- **Content Management**: Search, edit, categorize, and organize saved summaries with an intuitive dashboard
- **Smart Content Extraction**: Uses readability algorithms to extract clean, readable content from web pages
- **User Authentication**: Secure JWT-based authentication with password hashing

## Technology Stack

**Backend:**

- Go (Golang) with Gin framework
- PostgreSQL for data persistence
- Redis for caching
- Background workers for reminder scheduling

**Frontend:**

- Next.js 15 with React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Redux Toolkit for state management

**Additional:**

- Chrome Extension (Manifest V3)
- Google Gemini API for AI summarization
- Docker Compose for infrastructure

## Technical Highlights

- RESTful API architecture with proper middleware and authentication
- Background job processing for automated reminder delivery
- CORS configuration supporting both web app and browser extension
- Responsive, modern UI with protected routes and session management
- Efficient content extraction and processing pipeline
