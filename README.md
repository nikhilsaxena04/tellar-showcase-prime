# Portfolio Spotlight

Role & Goal Act as an expert 10x frontend developer and UI/UX designer. I need you to build a working MVP for my Software Developer Portfolio. Our previous backend had issues, so I need you to handle the frontend and seamlessly integrate a reliable backend using your native integrations (Supabase).

Tech Stack & Connectors

Framework: React (Vite)

Styling: Tailwind CSS

Core UI: shadcn/ui

Advanced UI (For smooth aesthetics): Integrate components from Aceternity UI or Magic UI (for things like glowing borders, spotlight effects, or smooth text reveals).

Animations: Framer Motion

Icons: Lucide React

Backend/DB Connector: Supabase (Set this up natively in Lovable for data storage).

Email Connector (Optional): Resend (If you can wire the contact form to trigger an email).

Deployment Connector: Connect the final output to GitHub so I can easily deploy to Vercel/Netlify.

Design & Aesthetics (Premium & Smooth Feel)

Implement a stunning, modern design with a warm stone-toned dark mode as the default, but include a seamless Light/Dark theme toggle.

Use a modern typography system (e.g., Inter, Outfit, or Geist).

Add highly polished micro-animations (e.g., smooth section-level entrance animations on scroll, magnetic buttons, or hover-lift effects on cards).

Use glassmorphism (backdrop-blur) effects for the sticky navigation and project cards.

Core Sections & Layout Please build a single-page application (or multi-page if needed) with the following sections in order:

Navigation (Sticky & Glassmorphic)

Logo/Name on the left.

Links to all sections: Home, Skills, Projects, Open Source, About, Contact.

Theme toggle switch.

Hero Section

Catchy headline with a smooth typing effect or a staggered text fade-in (using Framer Motion).

Subheadline stating my role (e.g., Full Stack / Software Developer).

Two CTA buttons: "View Projects" (primary, maybe with a glow effect) and "Contact Me" (secondary).

Include icon links to GitHub and LinkedIn.

Skills Section

Categorized grid (e.g., Frontend, Backend, Tools).

Use Lucide icons for each skill.

Add a subtle infinite marquee or a staggered grid reveal when scrolling into view.

Projects Section

A grid of premium project cards (Image/Placeholder, Title, Description, Tech Stack tags).

Include "Live Demo" and "GitHub" buttons on each card.

Backend Connector: Set up a Supabase table for projects. Fetch the projects dynamically so I can easily add new ones without touching the code later.

Open Source Section (NEW)

A dedicated section highlighting my open-source contributions.

Design it as a sleek timeline or a grid of PR cards.

Fields should include: Repository Name, PR Title/Description, Status (Merged/Open), and a link to the PR.

Include a stats highlight banner (e.g., "X+ Contributions", "X Repositories").

About Section

A brief bio about my background and passion for coding.

A stylized image placeholder for a profile picture (e.g., with a subtle floating animation).

Contact Section

A clean, validated contact form (Name, Email, Message, Submit Button).

Backend Connector: Connect this form to a Supabase table called contact_messages. Ensure that when a user submits the form, it successfully writes to the database and triggers a beautiful success toast notification.

Footer

Copyright notice and repeated social links.

MVP Functionality Checklist for Lovable

Fully responsive on mobile, tablet, and desktop.

Smooth scrolling between sections (using Lenis scroll if possible, or CSS smooth scroll).

Theme toggle works flawlessly.

Supabase is initialized and connected.

Contact form successfully writes data to the Supabase backend.

Provide clear placeholders where I need to swap in my own text or images.

Please generate the complete working application based on these specifications.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7c5c28d9-4b7b-464d-8d9e-c5814997ec96).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
