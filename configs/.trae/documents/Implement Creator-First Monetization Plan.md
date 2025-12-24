I will implement the **Creator-First Monetization Plan** by updating the pricing configuration, creating new feature views, and integrating them into the app's navigation and dashboard.

### 1. Update Pricing Configuration
**File:** `web/src/config/pricing.ts`
- Update `PRICING_TIERS` to match the new plan:
  - **Free:** 1 anim/day, Preview only.
  - **Pro ($49/mo):** 200 anims/day, Full export, Character Creator (5), Marketplace selling.
  - **Team ($199/mo):** 500 anims/day, Unlimited Character Creator, Team tools, API (10k).
  - **Enterprise ($999+):** Unlimited API, White-label.

### 2. Create New Feature Views (Placeholders with Logic Hooks)
I will create the following components to visualize the new features and implement basic access control logic (e.g., "Upgrade to access"):
- `web/src/components/MarketplaceView.tsx`: Browse assets; Sell button (Pro+).
- `web/src/components/EducationView.tsx`: Tutorials list; Premium courses (Pro+).
- `web/src/components/CharacterCreatorView.tsx`: Character builder interface; limit check (5 vs Unlimited).
- `web/src/components/ProfessionalToolsView.tsx`: Timeline editor placeholder; Advanced export options.
- `web/src/components/ApiDashboardView.tsx`: API key management and usage stats.

### 3. Update Pricing Page UI
**File:** `web/src/components/PricingPage.tsx`
- Update the pricing cards to reflect the new 4-tier structure (Free, Pro, Team, Enterprise).
- Highlight key differentiators (Marketplace, Character Creator, API).

### 4. Update User Dashboard
**File:** `web/src/components/UserDashboard.tsx`
- Add "Quick Actions" or sidebar links to navigate to:
  - Marketplace
  - Education Platform
  - Character Creator
  - Professional Tools

### 5. Update App Routing
**File:** `web/src/App.tsx`
- Update `View` type to include `'marketplace' | 'education' | 'character-creator' | 'tools' | 'api-dashboard'`.
- Add routing logic to render the new components based on `currentView` state.

This approach ensures the entire monetization plan is visible and navigable within the app immediately.
