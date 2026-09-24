# Vertex Home Page Implementation Prompt

## Goal

Replace the placeholder home page with the provided Vertex learning-platform home screen. Match the reference image's hierarchy, spacing, colors, typography, card layout, controls, and decorative lower section while keeping the page responsive on narrow screens.

## Skills and guidance read

- `AGENTS.md`: approval-first workflow, exact reference reproduction, reuse existing Tailwind patterns, and required checks.
- Existing `app/design-system/page.tsx`: Vertex palette, display typography, spacing, border, and icon conventions.
- Existing Next.js App Router files: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, and `package.json`.

## Current code inspected

- `app/page.tsx` is a small placeholder linking to the design system.
- `app/globals.css` imports Tailwind v4 and defines the cream/orange Vertex tokens plus display font utility.
- `app/layout.tsx` uses Next 16 metadata and Google Geist fonts.
- `public/` contains only starter SVGs, so the course marks and avatar will be CSS/SVG treatments rather than external image dependencies.

## Decisions and assumptions

- The home page remains a server component; search and navigation controls are presentational links/forms only because no backend/search route exists yet.
- The search field will be a labeled, non-submitting form with accessible placeholder text and a keyboard shortcut badge matching the reference.
- Course cards use representative static course content from the screenshot: Next.js for Production, Docker Essentials, and TypeScript Deep Dive.
- The avatar is a neutral CSS portrait treatment because no user asset is available; it will not imply authenticated behavior.
- Inline SVGs are limited to the existing Vertex mark and simple interface icons, keeping the page dependency-free.
- The lower coral bar motif is decorative and implemented with responsive CSS bars, preserving the visual cue without adding an image asset.

## Expected files

- `app/page.tsx`: replace placeholder with the complete home-page structure and small local presentational components.
- `app/globals.css`: add only page-level background texture/utility rules that are awkward or noisy as Tailwind classes, if needed.
- `app/layout.tsx`: update the default metadata to Vertex-specific title and description.

## Requirements

- Header with Vertex brand, Courses and My Learning links, notification icon, and avatar.
- Hero with the `INTELLIGENT LEARNING` eyebrow, two-line editorial heading, supporting copy, orange Explore Courses CTA, and prominent search field.
- All Courses section with section link and three bordered course cards. Each card includes a course mark, title, description, and metadata row for level, duration, and module count.
- Responsive behavior: preserve the desktop composition, stack cards and wrap header/hero controls gracefully on mobile, and keep all text within its containers.
- Use the existing cream, white, charcoal, muted slate, and orange palette. Keep corners restrained and borders subtle.
- Preserve semantic headings, nav landmarks, labels, focus states, and keyboard-accessible controls.
- Avoid introducing packages, data fetching, authentication, or unrelated route changes.

## Security considerations

- No secrets, client tokens, network calls, or user data are needed.
- The search form must not claim to execute a search until a real route exists.

## Acceptance criteria

- `/` renders the attached Vertex home screen rather than the placeholder.
- At desktop width, the visual order and proportions match the reference: header, hero, search, course grid, weekly-update divider, and coral bar motif.
- At mobile width, content remains readable without horizontal overflow.
- Links and form controls have visible focus styles and accessible names.
- The existing `/design-system` route continues to render unchanged.

## Checks

- `npm run lint`
- `npm run build`
- Manually inspect `/` at desktop and mobile widths.

## Manual test steps

1. Start the app with `npm run dev`.
2. Open `/` at a desktop viewport and compare against the supplied reference.
3. Resize to a narrow mobile viewport and verify header wrapping, hero text, search field, and card stacking.
4. Tab through the header links, CTA, search field, and course links to verify focus visibility.
5. Open `/design-system` and confirm it is unaffected.
