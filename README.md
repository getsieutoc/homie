# Homie

A multi-tenant domain scanner, keep your domains tight.
Lockin’ down threats, got your back like a homie in a fight!

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

Homie is a compreh eensive security scanning platform designed to help organizations monitor and manage domain security. It provides a centralized dashboard for tracking security scans across multiple domains and projects, with a focus on threat detection and management through VirusTotal integration.

![Screenrecord](https://i.imgur.com/kzUfna7.gif|width=100)

### Key Features

- 🔒 **Domain Security Scanning**: Automated checks using VirusTotal API
- 🏢 **Multi-tenant Management**: Organization-based project isolation
- 🚨 **Threat Detection**: Identification of malicious or suspicious domains
- 📊 **Analytics Dashboard**: Visualization of security scan results
- 👥 **Team Collaboration**: Role-based access control within organizations
- 🔄 **Vendor Management**: Track security vendor assessments

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI (based on Radix UI)
- **State Management**: Jotai
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: SWR
- **Visualization**: Recharts
- **Command Interface**: kbar

### Backend

- **API**: Next.js API routes with server actions
- **Authentication**: Auth.js v5
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Background Jobs**: Trigger.dev
- **Security Scanning**: VirusTotal API

### Development & Tooling

- **Package Manager**: pnpm
- **Testing**: Vitest, React Testing Library
- **Containerization**: Docker
- **Linting & Formatting**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker and Docker Compose (for local development)
- VirusTotal API key

### Environment Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:getsieutoc/homie.git
   cd homie
   ```

2. Copy the example environment files:

   ```bash
   cp env.example .env
   cp docker/env.example docker/.env
   ```

3. Update the environment files with your configuration values, including:
   - Database connection details
   - NextAuth secret
   - VirusTotal API key
   - SMTP settings for email

### Installation

#### Local Development

```bash
# Install dependencies
pnpm install

# Run database migrations on the first time OR when schema has changes
pnpm prisma migrate dev

# Seed the database (run only first time)
pnpm prisma db seed

# Start the development server
pnpm dev

# The application will be available at http://localhost:3000
```

## Project Structure

```txt
homie/
├── actions/              # Server actions for business logics
├── app/                  # Next.js App Router pages and layouts
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages and components
│   └── ...
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Layout components
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configuration
├── mastra/               # Mastra services and agent definitions
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

### System Architecture

Homie uses a layered architecture:

- **UI Layer**: Next.js App Router pages and components
- **API Layer**: Next.js API routes and server actions
- **Service Layer**: Business logic for features
- **Data Layer**: Prisma ORM with PostgreSQL database

### Data Model

- **User**: System user with authentication details
- **Tenant**: Organization that owns projects and vendors
- **Membership**: Relationship between Users and Tenants with roles
- **Project**: Container for domains to be scanned
- **Result**: Security scan results from vendors
- **Vendor**: Security vendors providing domain assessments

## Current Status

| Component               | Status | Notes                       |
| ----------------------- | ------ | --------------------------- |
| Core Infrastructure     | 90%    | Mostly complete             |
| User Management         | 75%    | Basic functionality working |
| Organization Management | 70%    | Core features implemented   |
| Project Management      | 80%    | Main features complete      |
| Security Scanning       | 60%    | Basic integration working   |
| Results Management      | 40%    | Needs enhancement           |
| Analytics               | 30%    | Basic components in place   |
| Reporting               | 15%    | Early development           |

## License

This project is licensed under the MIT License - see the LICENSE file for details.
