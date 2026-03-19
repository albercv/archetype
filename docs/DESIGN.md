# Design System Document: High-End Editorial

## 1. Overview & Creative North Star
**Creative North Star: The Brutalist Monolith**

This design system is engineered to evoke the atmosphere of a high-end art exhibition held within a subterranean concrete bunker. It is a "Dark Mirror" to the user's psyche—unflinching, architectural, and psychologically immersive. 

To move beyond the "template" look, we reject the safety of symmetry and soft edges. The experience is driven by **intentional asymmetry**, where oversized typography acts as a structural element rather than mere content. We utilize "The Void" (#050505) not as a background, but as a physical space. Elements should feel like they are floating in an abyss or etched into stone. The tension between the aggressive geometric headers and the razor-sharp 1px lines creates a "luxury editorial" feel that is both premium and unsettling.

---

## 2. Colors
The palette is a study in extreme contrast and restraint. 

*   **Surface (The Void):** `#050505`. This is the absolute foundation. 
*   **Primary Text (The Light):** `#F0EDE6` (warm off-white). Used for high-readability and luxury editorial feel.
*   **Secondary Text (The Shadow):** `#666666`. Used for de-emphasized metadata and labels.
*   **Accent (Electric Amber):** `primary_container` (`#FF8C00`). To be used for a single high-impact element per screen (e.g., a "Result" highlight or a critical CTA).

### The "No-Gradient" Mandate
In accordance with the aesthetic of a concrete bunker, **gradients are strictly prohibited.** Depth is achieved through "Tonal Layering."

### Surface Hierarchy & Nesting
Instead of shadows, use the Material Tiers to define depth:
*   **Base Layer:** `surface` (`#050505`)
*   **Nested Containers:** Use `surface_container_low` (`#1C1B1B`) or `surface_container_high` (`#2A2A2A`) to create subtle, monolithic blocks of different "densities" within the void. 
*   **Separation:** Do not use dividers for sections. Use the `surface_container` tokens to create solid blocks of color that abruptly shift from one to the next.

---

## 3. Typography
Typography is the primary visual "image" in this system.

*   **Display & Headlines (Space Grotesk / Bold / Aggressive Sans):** Use `display-lg` (3.5rem) and `display-md` (2.75rem) for section headers. These should be treated as architectural features. Tighten letter-spacing (`-0.02em`) to increase the feeling of aggression and tension.
*   **The "Arquetipo" Exception (Newsreader / Serif Italic):** Whenever the word 'Arquetipo' or specific psychological archetypes appear, switch to `label-md` or `label-sm` using the Newsreader serif. It must be sharp and elegant—a "stiletto" in a room of concrete.
*   **Body (Inter / Lightweight Sans):** Use `body-lg` (1rem) for all prose. The font weight should be 300 or 400 to provide a clean, "gallery-label" feel against the heavy headers.

---

## 4. Elevation & Depth
Traditional elevation (Z-axis) is replaced by **Structural Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking" razor-sharp rectangles. A card does not sit "above" a surface; it is a different density of stone embedded within it. Use `surface_container_lowest` for the deepest recesses and `surface_bright` for interactive "lit" surfaces.
*   **Zero Shadows:** Absolutely no box-shadows are permitted. Depth is 100% tonal.
*   **The 1px Rule:** Borders must be exactly `1px`. Use the `outline` token (`#A48C7A`) at 30% opacity for a "Ghost Border" that suggests a boundary without closing the space.
*   **Sharpness:** The `roundedness` scale is locked at `0px`. Every interaction, from buttons to checkboxes, must maintain a lethal, 90-degree corner.

---

## 5. Components

### Buttons
*   **Primary:** Rectangular, `0px` radius. `1px` border of `#F0EDE6`. 
    *   *Default State:* Transparent background, `#F0EDE6` text.
    *   *Hover State (The Inversion):* Background fills `#F0EDE6`, text flips to `#050505`. The transition should be instant (0.1s) to feel mechanical.
*   **Tertiary:** Text-only, uppercase, `label-md` styling with the `primary_container` (`#FF8C00`) color.

### Input Fields
*   **Form Factor:** A simple `1px` bottom-border using `outline`. 
*   **Active State:** The bottom border changes to `primary_container` (`#FF8C00`). No side or top borders.
*   **Placeholder:** `#666666` in `body-sm`.

### Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Layout:** Use vertical white space (`spacing-12` or `spacing-16`) to separate list items. For cards, use a slight background shift (`surface_container_low`) and an asymmetric layout (e.g., text aligned to the far right, index number on the far left).

### Checkboxes & Radios
*   **Styling:** Square only. `0px` radius.
*   **Selected State:** A solid fill of `primary_container` (`#FF8C00`) with no checkmark icon—just a solid colored block—to maintain minimalist purity.

---

## 6. Do's and Don'ts

### Do:
*   **Use Oversized Type:** Let a single letter or word (e.g., "01") bleed off the edge of the grid.
*   **Embrace Asymmetry:** Place body text in a narrow column on the right, leaving the left 60% of the screen as "The Void."
*   **Use Mono-spacing for numbers:** Treat results and data with a sterile, scientific aesthetic.

### Don't:
*   **Don't use gradients:** They destroy the "concrete bunker" hardness of the system.
*   **Don't use stock photography:** If imagery is needed, use high-contrast, grainy, black-and-white textures or abstract architectural silhouettes.
*   **Don't "Center-Align" everything:** Center-alignment is too safe. Use extreme left or right-justified layouts to create psychological tension.
*   **No Rounded Corners:** Not even 1px. If it isn't a sharp corner, it doesn't belong in the Dark Mirror.
