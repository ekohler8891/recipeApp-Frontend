## 🧩 Page Layout Decisions

### Home Page Layout
- Clean & Modern design.
- Recipe previews in card layout (image, title, tags).
- Floating “+ Add Recipe” button.
- Filter/search at top, categorized by tags or meal type.
- Emphasis on clarity and reducing cognitive load.

### Recipe Adding Page (planning stage)
- Will include form fields for recipe name, ingredients, steps, and image upload.
- Styled to match the Clean & Modern look.

---

## 🎨 Visual Design & Theme

- **Design Style Chosen:** Clean & Modern
- **Base Color:** Blue — evokes trust and dependability.
- **Visual Goals:** Reduce decision fatigue, feel grounded and confident when using the app.
- **Planned Color Palette:** To be chosen using a tool like [Coolors](https://coolors.co/) or similar.

---

## 🔗 Image Format Strategy

- **Early Phase:** Use public image links.
- **Later Phase:** Switch to Azure Blob Storage with SAS-token-protected private links.

--

## Navbar Component
- Refactored navbar links into a reusable `<NavLinkPill />` component.
- Uses `useLocation()` to highlight active routes.
- Handles prefix path matching (e.g., `/view/123` matches `/view`).
- Default style: blue pill with hover. Active: white pill with blue text.

## Routing Behavior
- Home (`/`) will always match `startsWith("/")`, so had to special-case it.
- Consider wrapping routes with a `MainLayout` in the future.

## Idea Added (Phase 2)
- Add a button or route for "Random Recipe" feature — will pull any recipe at random with no prior filters.
