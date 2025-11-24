# Professional Fullstack Developer Portfolio

A modern, fully modular, and JSON-driven portfolio website designed for fullstack developers. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Fully Dynamic Content**: All content loaded from JSON files or API endpoints
- **API-Ready Architecture**: Switch between local JSON and remote API with a simple config change
- **Modern Design**: Premium tech aesthetic with smooth animations and glass morphism effects
- **Dark/Light Mode**: Built-in theme switching with persistent preferences
- **Fully Responsive**: Optimized for all screen sizes and devices
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Modular Architecture**: Clean, maintainable, and scalable codebase

## 📁 Project Structure

```
portfolio/
├── public/
│   └── data/              # JSON data files
│       ├── about.json
│       ├── skills.json
│       ├── projects.json
│       ├── experience.json
│       └── contact.json
├── src/
│   ├── components/
│   │   ├── sections/      # Page sections
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── config/            # Configuration
│   │   └── index.ts       # Main config file
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.tsx
│   ├── lib/               # Utilities
│   │   └── dataLoader.ts  # Universal data loader
│   └── pages/
│       └── Index.tsx      # Main page
```

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:8080`

## ⚙️ Configuration

### Switching Between JSON and API

Edit `src/config/index.ts`:

```typescript
export const CONFIG = {
  use_api: false,  // Set to true to use API
  base_url: "",    // Your API base URL
  // ... rest of config
};
```

**Local JSON Mode (default):**
```typescript
use_api: false
```
All content is loaded from `/public/data/*.json` files.

**API Mode:**
```typescript
use_api: true
base_url: "https://your-api.com"
```
All content is fetched from your backend API.

### Customizing Content

#### JSON Files
Edit the JSON files in `public/data/` to customize content:

- `about.json` - Personal information and stats
- `skills.json` - Technical skills organized by category
- `projects.json` - Project portfolio
- `experience.json` - Work experience timeline
- `contact.json` - Contact information and form config

#### API Integration
When `use_api: true`, the app expects these endpoints:

- `GET /about` - About data
- `GET /skills` - Skills data
- `GET /projects` - Projects data
- `GET /experience` - Experience data
- `GET /contact` - Contact data

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize the color scheme:

```css
:root {
  --primary: 189 94% 43%;     /* Main brand color */
  --secondary: 32 95% 58%;    /* Accent color */
  /* ... more colors */
}
```

### Design System
All colors use HSL format and are defined as CSS variables for easy theming. Both light and dark modes are fully supported.

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Shadcn/ui** - UI components
- **Lucide React** - Icons
- **Framer Motion** - Animations (ready to use)

## 🔧 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 Adding New Content

### Adding a Project

Edit `public/data/projects.json`:

```json
{
  "id": 7,
  "name": "New Project",
  "description": "Project description...",
  "images": ["/img/projects/new-project.jpg"],
  "tech": ["React", "Node.js"],
  "tags": ["Web App"],
  "github": "https://github.com/...",
  "liveUrl": "https://...",
  "status": "public",
  "featured": true
}
```

### Adding a Skill Category

Edit `public/data/skills.json`:

```json
{
  "name": "New Category",
  "icon": "Code2",
  "skills": [
    { "name": "Skill Name", "level": 85 }
  ]
}
```

## 🌐 Deployment

### Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to Lovable

1. Click "Publish" in Lovable
2. Your site will be deployed automatically

### Deploy to Other Platforms

The built site is a static SPA and can be deployed to:
- Vercel
- Netlify  
- GitHub Pages
- Any static hosting service

## 🔒 Environment Variables

If using API mode, you can use environment variables:

```env
VITE_API_BASE_URL=https://your-api.com
```

Then in `src/config/index.ts`:

```typescript
base_url: import.meta.env.VITE_API_BASE_URL || ""
```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Future Enhancements

Ready to add:
- [ ] Blog section
- [ ] Testimonials
- [ ] Contact form backend
- [ ] Analytics integration
- [ ] Multi-language support
- [ ] CMS integration

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email hanna@example.com or open an issue.

---

Built with ❤️ using Lovable
