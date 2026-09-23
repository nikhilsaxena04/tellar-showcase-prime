# Software Developer Portfolio MVP

## Build
- Replace the placeholder with a responsive, single-page developer portfolio using the requested warm stone palette, glass navigation, theme switch, motion, and section anchors.
- Add hero, categorized skills, dynamic projects, open-source highlights, about, contact, and footer sections with editable placeholder content for links, profile details, and imagery.
- Use the existing interface library for buttons, forms, switches, and notifications; add Framer Motion for entrances, staggered text, marquee motion, and restrained card interactions.

## Data and contact flow
- Create a public-readable `projects` table and seed representative portfolio projects so the first view is complete.
- Create a write-only `contact_messages` table: visitors can submit messages but cannot read them back.
- Fetch projects from Lovable Cloud and validate contact submissions in the browser before saving them, with success and error notifications.

## Quality checks
- Add page-specific social metadata and accessible labels, keyboard focus states, reduced-motion behavior, loading/empty/error states, and mobile navigation.
- Verify the database policies, current build health, contact submission, theme switching, section navigation, and layouts at desktop and mobile sizes.

## Technical details
- Keep the project’s TanStack Start architecture, React 19, Tailwind CSS v4, and generated Lovable Cloud client.
- Use semantic OKLCH design tokens in the global stylesheet, without hardcoded component colors.
- GitHub repository connection and publishing remain user-controlled in Lovable; the app will include editable GitHub, LinkedIn, demo, and repository links.
