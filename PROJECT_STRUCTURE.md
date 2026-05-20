# Medipark Codebase Structure and Design Guidelines

This file serves as a guide to the file structure and architectural decisions of the **Medipark** project. Review this document before making design, styling, type definition, or API decisions.

---

## 🛠️ Technology Stack & Libraries

- **Framework**: React (Vite-based build system)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & custom Vanilla CSS (`src/index.css` & `src/App.css`)
- **State Management**: Redux Toolkit (RTK)
- **API Orchestration**: RTK Query (endpoints defined inside `src/services/`)
- **Routing**: React Router
- **Component Kit**: Custom UI components styled with Tailwind CSS (`src/components/ui/`)

---

## 📂 File and Folder Structure

```
medipark/
├── .cursor/               # IDE configuration
├── public/                # Static public assets (images, logos, navbar icons)
├── src/
│   ├── assets/            # Embedded resources and images
│   ├── components/        # Component definitions
│   │   ├── admin/         # Components specific to Admin views
│   │   ├── admin-panel/   # Dashboard sidebar and admin layout shells
│   │   ├── ui/            # Reusable core elements (Button, Input, Select, Badge, Dialog)
│   │   └── website/       # Public-facing components (PricingSection, DoctorsSection, etc.)
│   ├── data/              # Mock data or static client data files
│   ├── hooks/             # Custom typed React hooks (e.g. useAppSelector, useAppDispatch)
│   ├── lib/               # Utility helper functions (e.g. clsx/tailwind-merge wrapper)
│   ├── pages/             # Route pages organized by functional areas
│   │   ├── admin/         # Administration control pages (pricing, career, doctors, etc.)
│   │   ├── auth/          # Login and registration templates
│   │   ├── packages/      # Public packages list and package details page
│   │   ├── home/          # Main website homepage components
│   │   └── [...]          # Other public route pages (about, blog, telemedicine, etc.)
│   ├── routes/            # Route configurations (protected routes & main router.tsx mapping)
│   ├── services/          # RTK Query service endpoints and Type Interfaces
│   │   ├── baseApi.ts     # Configures baseQuery with headers and base URL
│   │   ├── [...]Api.ts    # Specific API slices (homepagePricingApi.ts, doctorApi.ts, etc.)
│   └── store/             # Redux Store config
│       ├── slices/        # Standard Redux slices for global UI/auth states
│       └── index.ts       # Configures and combines Redux Store middleware and APIs
```

---

## 🔑 Crucial Coding & Architecture Rules

### 1. Data Integrity and Casting
- **Type Compatibility**: Type interfaces should be defined in the respective service files inside `src/services/` (e.g. `src/services/homepagePricingApi.ts`).
- **Nullable Columns**: Databases and backend tables often support `null` for non-required fields. Type definitions for optional fields should be declared as `number | string | null | undefined` to support payload transformations.
- **Form Submissions**: Cast numerical values (like `price`, `discount_price`, `final_price`) using `Number(val)` or `null` (if blank) before submitting payloads. Never send empty strings (`""`) to backend endpoints expecting numbers.

### 2. Design System and Visual Guidelines
- **Modern & Premium Styling**: Strive for clean aesthetics. Use subtle gradients, soft shadows (`shadow-sm`), rounded-2xl/rounded-3xl corners, and glassmorphism elements where appropriate.
- **Harmonious Color Palettes**:
  - Main color: `#0B1B3D` (Navy Blue) for text headings, primary buttons.
  - Accent/Primary color: Tailwind `primary` (Teal/Blue) for highlights, visual links, hover states.
  - Green highlights (`bg-green-50 text-green-700`): reserved for discounts, success status, positive badges.
- **Responsive Layouts**: Design components with mobile-first layout rules using Tailwind breakpoints (e.g. `grid-cols-1 md:grid-cols-3` or `flex-col md:flex-row`).

### 3. Pricing Display Standard
When displaying item prices, always check for active discounts. Standard format:
1. **Final Price**: Displayed as the primary, prominent price (e.g. `plan.final_price`).
2. **Original Price**: Displayed right next to it with a strikethrough (e.g. `plan.price` with class `line-through text-gray-400`).
3. **Discount Badge**: If `plan.discount_price > 0`, display a badge labeled `TK {amount} Discount` below the pricing block.
4. **Ordering**: Always stack elements in this order inside cards: **Title** -> **Description** -> **Price Details** -> **Call to Action (Button)**.

### 4. State Management Integration
- Use RTK Query hooks (e.g., `useGetItemsQuery`, `useUpdateItemMutation`) to fetch and update data.
- For loading states, display skeleton animations or the `<Loader2 className="animate-spin" />` spinner.
- Always check for server-side responses and present toast notifications on success or failure.
