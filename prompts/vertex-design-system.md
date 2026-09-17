# Vertex Design System implementation

## Goal

Build a single-page design system showcase matching the supplied reference image for Vertex, using the existing Next.js app structure and Tailwind styling conventions. The page should visually reproduce the design system documentation layout exactly, without introducing extra features or altering the visual system beyond the reference.

## Skills and context reviewed

- AGENTS.md project rules and constraints
- This project’s existing Next.js app setup in [app/page.tsx](../app/page.tsx) and [app/globals.css](../app/globals.css)
- Design reference in [design/vertex-designsystem.png](../design/vertex-designsystem.png)

## Decisions and assumptions

- The page is a static documentation layout; no live data or interactive functionality beyond the visual design is required.
- The design should be implemented as a single responsive page in the app root using semantic HTML and Tailwind utility classes.
- Colors, spacing, typography, card treatment, separators, and button states should follow the reference as closely as possible.
- The page should work as a polished desktop composition and remain sensible on smaller screens by stacking sections.

## Files expected to touch

- [app/page.tsx](../app/page.tsx)
- [app/globals.css](../app/globals.css)

## Requirements

- Match the reference design closely: brand mark on the upper-left, oversized “Design System” headline, intro paragraph, and all labeled sections.
- Recreate the color palette section with primary and neutral swatches and label metadata.
- Recreate the typography section with display and body sizes, weights, and usage descriptions.
- Recreate spacing, radius, shadows, icons, buttons, badges, status pills, progress bar, cards, navigation, and principles section as shown.
- Use a restrained neutral background and off-white panels to match the clean editorial aesthetic.
- Keep typography letter spacing and weights close to the reference; use a serif or high-contrast display style for the headline and a clean sans-serif for the UI labels.
- Use inline SVG or basic shapes for icons where necessary, staying minimal and consistent with the design.

## Security considerations

- No external API usage or secret handling is required for this visual implementation.
- Keep this as a front-end-only static page.

## Acceptance criteria

- The page visually matches the provided design system reference at a high level, with the same sections, spacing, tones, and layout patterns.
- The root page renders successfully in the browser without console errors.
- The design is responsive and remains coherent on narrower widths.
- The project type-checks and lints cleanly.

## Checks to run

- Run the Next.js lint command from the project root.
- Run the TypeScript type check if available via the project tooling.
- Run a local dev server and verify the page visually matches the reference.

## Manual test steps

1. Start the app locally.
2. Open the homepage.
3. Confirm the composition matches the supplied design image in structure and styling.
4. Resize to narrower widths and confirm the layout stacks gracefully without breaking.

## Notes

- This task is intentionally self-contained and does not expand into unrelated app features.
- We should avoid overbuilding beyond the design system rendering.
