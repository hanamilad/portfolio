# Portfolio Architecture Documentation

## 🏗️ System Architecture

This portfolio is built with a highly modular, data-driven architecture that separates content from presentation and makes it easy to switch between local and remote data sources.

## 📊 Data Flow

```
┌─────────────────┐
│  Configuration  │
│  (config/index) │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│   Data Loader       │
│  (lib/dataLoader)   │
│                     │
│  - Checks config    │
│  - Routes to JSON   │
│    or API           │
│  - Error handling   │
│  - Debug logging    │
└────────┬────────────┘
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌───────┐  ┌───────┐
│ JSON  │  │  API  │
│ Files │  │ Calls │
└───┬───┘  └───┬───┘
    │          │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│   Components    │
│                 │
│  - Hero         │
│  - About        │
│  - Skills       │
│  - Projects     │
│  - Experience   │
│  - Contact      │
└─────────────────┘
```

## 🔧 Core Systems

### 1. Configuration System (`src/config/index.ts`)

**Purpose**: Centralized control for data sources

**Key Features**:
- Single source of truth for data loading behavior
- Toggle between JSON and API modes
- Type-safe configuration
- Debug mode for development

**Usage**:
```typescript
import { CONFIG } from '@/config';

// Check current mode
if (CONFIG.use_api) {
  // Using API
} else {
  // Using JSON
}
```

**Switching Modes**:
```typescript
// Local JSON mode
export const CONFIG = {
  use_api: false,
  base_url: "",
  // ...
};

// API mode
export const CONFIG = {
  use_api: true,
  base_url: "https://api.yoursite.com",
  // ...
};
```

### 2. Data Loader (`src/lib/dataLoader.ts`)

**Purpose**: Universal data loading with automatic routing

**Architecture**:
```
loadData(type)
    │
    ├─> Check CONFIG.use_api
    │
    ├─> if false: fetchJSON(type)
    │   └─> Load from /data/{type}.json
    │
    └─> if true: fetchAPI(type)
        └─> Fetch from {base_url}/{endpoint}
```

**Functions**:

#### `loadData(type: DataType): Promise<any>`
Main function to load any data type.

```typescript
// Load about data
const aboutData = await loadData('about');

// Load projects
const projects = await loadData('projects');
```

#### `loadMultiple(types: DataType[]): Promise<Record<DataType, any>>`
Load multiple data types in parallel.

```typescript
const { about, skills, projects } = await loadMultiple([
  'about', 
  'skills', 
  'projects'
]);
```

**Error Handling**:
```typescript
try {
  const data = await loadData('about');
} catch (error) {
  if (error instanceof DataLoadError) {
    console.error(`Failed to load ${error.dataType}`);
    console.error(`Source: ${error.source}`);
  }
}
```

### 3. Theme System (`src/contexts/ThemeContext.tsx`)

**Purpose**: Manage light/dark theme with persistence

**Features**:
- Context-based theme management
- localStorage persistence
- CSS class-based switching
- Type-safe hooks

**Usage in Components**:
```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

### 4. Design System (`src/index.css`)

**Architecture**:
```
CSS Variables (HSL)
    ↓
Tailwind Config
    ↓
Utility Classes
    ↓
Components
```

**Color System**:
All colors use HSL format for easy manipulation:

```css
:root {
  --primary: 189 94% 43%;  /* hsl(189, 94%, 43%) */
}

.dark {
  --primary: 189 94% 53%;  /* Lighter in dark mode */
}
```

**Using in Tailwind**:
```tsx
<div className="bg-primary text-primary-foreground">
  <div className="bg-gradient-primary">
    Gradient background
  </div>
</div>
```

## 📂 Component Architecture

### Section Components Pattern

All section components follow the same pattern:

```typescript
// 1. Import dependencies
import { useEffect, useState } from "react";
import { loadData } from "@/lib/dataLoader";

// 2. Define data types
interface DataType {
  // ... fields
}

// 3. Component with data loading
export default function SectionName() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);

  // 4. Load data on mount
  useEffect(() => {
    loadData("dataType")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 5. Loading state
  if (loading) return <LoadingState />;
  
  // 6. Error state
  if (!data) return null;

  // 7. Render with data
  return <section>{/* Render content */}</section>;
}
```

### Benefits:
- ✅ Consistent data loading
- ✅ Automatic error handling
- ✅ Loading states
- ✅ Type safety
- ✅ Easy to test

## 🔄 Data Sources

### JSON Files (`public/data/`)

**Structure**:
```
public/data/
├── about.json       # Personal info, stats
├── skills.json      # Skills by category
├── projects.json    # Project portfolio
├── experience.json  # Work history
└── contact.json     # Contact info, form config
```

**Benefits**:
- ✅ No backend required
- ✅ Easy to edit
- ✅ Version controlled
- ✅ Fast loading
- ✅ Works offline

**Limitations**:
- ❌ Manual updates
- ❌ No dynamic content
- ❌ No user-specific data

### API Endpoints

When `use_api: true`, expects these endpoints:

```
GET {base_url}/about
GET {base_url}/skills
GET {base_url}/projects
GET {base_url}/experience
GET {base_url}/contact
```

**Expected Response Format**:
```json
{
  "data": { /* Same structure as JSON files */ },
  "success": true
}
```

Or simply return the data directly (no wrapper).

**Benefits**:
- ✅ Dynamic content
- ✅ Real-time updates
- ✅ User-specific data
- ✅ CMS integration
- ✅ Analytics

**Requirements**:
- Backend server
- CORS configuration
- API authentication (optional)

## 🎨 Design System

### Color Categories

1. **Base Colors**
   - `background` - Main background
   - `foreground` - Main text color

2. **Brand Colors**
   - `primary` - Main brand color (cyan)
   - `secondary` - Accent color (amber)
   - `accent` - Highlight color (blue)

3. **Semantic Colors**
   - `destructive` - Error/danger
   - `success` - Success states
   - `muted` - Subtle elements

4. **UI Colors**
   - `card` - Card backgrounds
   - `border` - Border colors
   - `input` - Form inputs

### Gradient System

Pre-defined gradients in CSS variables:

```css
--gradient-primary: linear-gradient(135deg, cyan → blue)
--gradient-secondary: linear-gradient(135deg, amber → orange)
--gradient-subtle: linear-gradient(180deg, bg → bg-lighter)
--gradient-mesh: radial-gradient(cyan + blue mesh)
```

**Usage**:
```tsx
<div className="bg-gradient-primary">
  Gradient background
</div>

<h1 className="gradient-text">
  Gradient text
</h1>
```

### Glass Morphism

Built-in glass effect:

```tsx
<div className="glass">
  Semi-transparent with blur
</div>
```

CSS:
```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
}
```

### Shadow System

```css
--shadow-glow: 0 0 30px primary-color
--shadow-glow-secondary: 0 0 30px secondary-color
```

**Usage**:
```tsx
<div className="shadow-glow">
  Glowing effect
</div>
```

## 🔒 Type Safety

### Configuration Types
```typescript
export type ConfigType = typeof CONFIG;
export type DataType = keyof typeof CONFIG.endpoints;
```

### Data Types
Each section has TypeScript interfaces:

```typescript
// About section
interface AboutData {
  name: string;
  title: string;
  bio: string;
  // ...
}

// Projects section
interface Project {
  id: number;
  name: string;
  description: string;
  // ...
}
```

## 🚀 Performance Optimizations

1. **Code Splitting**
   - Components lazy-loaded
   - Route-based splitting

2. **Image Optimization**
   - Images in public folder
   - Lazy loading for project images
   - Responsive images

3. **Data Loading**
   - Parallel loading with `loadMultiple()`
   - Error boundaries
   - Loading states

4. **CSS Optimization**
   - Tailwind purging unused styles
   - CSS variables for theming
   - Minimal custom CSS

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Test data loader
describe('loadData', () => {
  it('should load from JSON when use_api is false', async () => {
    const data = await loadData('about');
    expect(data).toBeDefined();
  });
});
```

### Integration Tests
```typescript
// Test component with data loading
describe('Hero Component', () => {
  it('should display loaded data', async () => {
    render(<Hero />);
    await waitFor(() => {
      expect(screen.getByText('Hanna')).toBeInTheDocument();
    });
  });
});
```

## 🔧 Extending the System

### Adding a New Section

1. **Create JSON file**: `public/data/newsection.json`

2. **Update config**: 
```typescript
endpoints: {
  // ... existing
  newsection: "/newsection"
},
local_json: {
  // ... existing
  newsection: "/data/newsection.json"
}
```

3. **Update types**:
```typescript
export type DataType = 
  | 'about' 
  | 'skills' 
  | 'newsection';
```

4. **Create component**: `src/components/sections/NewSection.tsx`

5. **Add to page**: 
```tsx
<NewSection />
```

### Adding API Middleware

```typescript
// In dataLoader.ts
async function fetchAPI(type: DataType): Promise<any> {
  const endpoint = `${CONFIG.base_url}${CONFIG.endpoints[type]}`;
  
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
}
```

## 🎯 Best Practices

1. **Always use the data loader**
   ```typescript
   // ✅ Good
   const data = await loadData('about');
   
   // ❌ Bad
   const data = await fetch('/data/about.json');
   ```

2. **Use semantic tokens**
   ```tsx
   {/* ✅ Good */}
   <Button className="bg-primary">

   {/* ❌ Bad */}
   <Button className="bg-blue-500">
   ```

3. **Handle loading states**
   ```typescript
   if (loading) return <Skeleton />;
   if (!data) return <ErrorState />;
   ```

4. **Type your data**
   ```typescript
   // ✅ Good
   const [data, setData] = useState<AboutData | null>(null);
   
   // ❌ Bad
   const [data, setData] = useState<any>(null);
   ```

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Contributing

When contributing:
1. Follow the established patterns
2. Add TypeScript types
3. Update documentation
4. Test both JSON and API modes
5. Ensure responsive design

---

Built with ❤️ using modern web technologies
