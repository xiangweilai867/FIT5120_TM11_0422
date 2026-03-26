# Design System Strategy: The Culinary Playground

## 1. Overview & Creative North Star
**Creative North Star: "The Organic Adventure"**

This design system rejects the clinical, rigid grids of traditional health applications in favor of a fluid, layered, and tactile experience. We are moving away from "medical advice" and toward "culinary discovery." The system uses intentional asymmetry, oversized "squircle" geometry, and deep tonal layering to create a digital environment that feels like a premium children’s pop-up book. By breaking the grid with overlapping illustrative elements and high-contrast typography, we create an energetic flow that captures a child’s imagination while maintaining the editorial polish that signals quality and safety to parents.

## 2. Color & Surface Theory
The palette is rooted in nature—leafy greens (`primary`), sun-ripened oranges (`secondary`), and berry reds (`tertiary`). However, the sophistication lies in how these colors interact with the neutral surfaces.

*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. We define space through color blocking. Use a shift from `surface` (#f2f9ea) to `surface-container-low` (#ebf3e3) to denote a new content area.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers. A typical page construction should follow this nesting:
    1.  **Base:** `surface`
    2.  **Section:** `surface-container`
    3.  **Card/Interactive Element:** `surface-container-lowest` (pure white) to provide a "pop" of clean contrast.
*   **The "Glass & Gradient" Rule:** To avoid a flat, "cheap" look, use Glassmorphism for floating navigation or overlays. Apply `surface` with a 70% opacity and a `backdrop-filter: blur(12px)`.
*   **Signature Textures:** Use subtle linear gradients for primary actions. A transition from `primary` (#006b1b) to `primary_container` (#91f78e) at a 135-degree angle adds a "juicy" dimension to buttons that flat color cannot replicate.

## 3. Typography: Editorial Play
We pair the geometric friendliness of **Plus Jakarta Sans** for high-impact displays with the soft readability of **Be Vietnam Pro** for instructional content.

*   **Display & Headline (Plus Jakarta Sans):** These are our "Voice." Use `display-lg` (3.5rem) for hero moments. The rounded terminals of the typeface mirror the "squircle" shapes of our containers, creating a unified visual language.
*   **Body & Title (Be Vietnam Pro):** This is our "Guide." It provides the necessary gravitas for nutritional information. The generous x-height ensures legibility even for early readers.
*   **Hierarchy as Identity:** We lean into extreme scale. A `display-md` headline paired with `body-lg` creates a sophisticated, editorial contrast that feels intentional and high-end.

## 4. Elevation & Depth: Tonal Layering
In this system, "Up" does not mean "Shadow." It means "Lighter."

*   **The Layering Principle:** Use the `surface-container` tiers to create lift. An element on `surface-container-high` (#dce6d4) naturally feels closer to the user than one on `surface-dim` (#ccd8c4).
*   **Ambient Shadows:** For "Floating" gamified elements (like a reward badge), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(42, 49, 39, 0.06)`. Note the use of `on-surface` (#2a3127) as the shadow base rather than pure black, ensuring the shadow feels like a natural reflection of the environment.
*   **The "Ghost Border" Fallback:** If an element requires a container on a matching background, use `outline-variant` (#a8afa2) at 15% opacity. It should be felt, not seen.
*   **Glassmorphism:** Use semi-transparent `surface_container_lowest` for overlays to allow the vibrant "food" colors of the background to bleed through, softening the interface's edges.

## 5. Components

### Buttons & Interactive
*   **Primary Button:** Uses the `xl` (3rem) roundedness scale. Background is a gradient of `primary` to `primary_dim`. Text is `on_primary`. 
*   **Secondary/Action Chips:** Use `secondary_container` with `on_secondary_container` text. These should feel like "stickers" that have been placed on the page.

### Navigation & Lists
*   **Cards:** Forbid divider lines. Separate content using `spacing-6` (2rem) and shifts in surface containers. A card should be a `surface-container-lowest` object on a `surface-container` background.
*   **Progress Bars (Gamification):** Use `primary_fixed` as the track and a glowing `primary` for the progress. The ends must be `full` rounded.

### Inputs & Forms
*   **Text Fields:** Use `surface_container_highest` for the input well with a `sm` (0.5rem) corner radius. On focus, transition the background to `surface_container_lowest` and apply a 2px `primary` ghost border (20% opacity).

### Specialized Components: "The Harvest Deck"
*   **Ingredient Badges:** Small `tertiary_container` "pill" shapes used to tag recipes.
*   **Milestone Modals:** Full-screen overlays using the Glassmorphism rule, featuring `display-sm` typography to celebrate a child's healthy eating progress.

## 6. Do's and Don'ts

### Do:
*   **Do** lean into asymmetry. Overlap a "berry red" (`tertiary`) illustrative icon over the edge of a "leaf green" (`primary`) card.
*   **Do** use the full range of the Spacing Scale. Give the "Display" type room to breathe—whitespace is what makes the design feel "Premium" rather than "Cluttered."
*   **Do** use `on_surface_variant` for secondary text to maintain a soft, accessible contrast.

### Don't:
*   **Don't** use 100% black (#000000) for anything. Use `on_surface` (#2a3127) to keep the vibe organic and warm.
*   **Don't** use sharp corners. If an element isn't at least `sm` (0.5rem) rounded, it doesn't belong in this system.
*   **Don't** use traditional "Error Red." Use our `error` (#b02500) which is balanced to feel like a "Warning" within a friendly ecosystem, rather than a "System Failure."