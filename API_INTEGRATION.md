# API Integration Guide

Complete guide for connecting your portfolio to a backend API.

## 🚀 Quick Start

### Step 1: Enable API Mode

Edit `src/config/index.ts`:

```typescript
export const CONFIG = {
  use_api: true,              // Enable API mode
  base_url: "https://api.yoursite.com",  // Your API URL
  // ... rest stays the same
};
```

### Step 2: That's it! 

Your portfolio will now fetch all data from your API instead of JSON files.

## 📡 Required Endpoints

Your backend must provide these endpoints:

```
GET {base_url}/about       → About/personal information
GET {base_url}/skills      → Technical skills
GET {base_url}/projects    → Project portfolio
GET {base_url}/experience  → Work experience
GET {base_url}/contact     → Contact information
```

## 📋 Endpoint Specifications

### GET /about

**Response Format:**
```json
{
  "name": "Your Name",
  "title": "Job Title",
  "subtitle": "Tagline",
  "bio": "Biography text...",
  "image": "/path/to/image.jpg",
  "resumeUrl": "/path/to/resume.pdf",
  "links": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username",
    "twitter": "https://twitter.com/username",
    "email": "email@example.com"
  },
  "stats": [
    {
      "label": "Years Experience",
      "value": "5+"
    }
  ]
}
```

### GET /skills

**Response Format:**
```json
{
  "categories": [
    {
      "name": "Frontend",
      "icon": "Code2",
      "skills": [
        {
          "name": "React",
          "level": 90
        }
      ]
    }
  ]
}
```

**Icon Names:** Use Lucide React icon names (Code2, Server, Database, Wrench, Lightbulb, etc.)

### GET /projects

**Response Format:**
```json
[
  {
    "id": 1,
    "name": "Project Name",
    "description": "Project description...",
    "images": ["/path/to/image.jpg"],
    "tech": ["React", "Node.js"],
    "tags": ["Web App", "Full Stack"],
    "github": "https://github.com/...",
    "liveUrl": "https://...",
    "status": "public",
    "featured": true
  }
]
```

**Status Options:** `"public"`, `"private"`, `"beta"`

### GET /experience

**Response Format:**
```json
[
  {
    "id": 1,
    "company": "Company Name",
    "role": "Job Title",
    "type": "Full-time",
    "location": "Remote",
    "from": "2022",
    "to": "Present",
    "current": true,
    "logo": "/path/to/logo.png",
    "details": [
      "Achievement 1",
      "Achievement 2"
    ],
    "technologies": ["React", "Node.js"]
  }
]
```

### GET /contact

**Response Format:**
```json
{
  "email": "email@example.com",
  "phone": "+1234567890",
  "location": "City, Country",
  "availability": "Available for work",
  "social": [
    {
      "platform": "GitHub",
      "url": "https://github.com/username",
      "icon": "Github"
    }
  ],
  "formConfig": {
    "title": "Get In Touch",
    "subtitle": "Have a project in mind?",
    "submitText": "Send Message",
    "successMessage": "Message sent successfully!",
    "errorMessage": "Failed to send message.",
    "fields": [
      {
        "name": "name",
        "label": "Name",
        "type": "text",
        "placeholder": "Your name",
        "required": true
      }
    ]
  }
}
```

## 🔐 Authentication

### Adding Bearer Token

Edit `src/lib/dataLoader.ts`:

```typescript
async function fetchAPI(type: DataType): Promise<any> {
  const endpoint = `${CONFIG.base_url}${CONFIG.endpoints[type]}`;
  
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  debugLog(`✓ API loaded successfully for: ${type}`, data);
  
  return data;
}

function getToken(): string {
  return localStorage.getItem('auth_token') || '';
}
```

### Adding API Key

```typescript
async function fetchAPI(type: DataType): Promise<any> {
  const endpoint = `${CONFIG.base_url}${CONFIG.endpoints[type]}`;
  
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "your-api-key-here",
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  debugLog(`✓ API loaded successfully for: ${type}`, data);
  
  return data;
}
```

### Using Environment Variables

1. Create `.env` file:
```env
VITE_API_BASE_URL=https://api.yoursite.com
VITE_API_KEY=your-api-key
```

2. Update config:
```typescript
export const CONFIG = {
  use_api: true,
  base_url: import.meta.env.VITE_API_BASE_URL,
  api_key: import.meta.env.VITE_API_KEY,
  endpoints: {
    about: "/about",
    skills: "/skills",
    projects: "/projects",
    experience: "/experience",
    contact: "/contact",
  },
  local_json: {
    about: "/data/about.json",
    skills: "/data/skills.json",
    projects: "/data/projects.json",
    experience: "/data/experience.json",
    contact: "/data/contact.json",
  },
  debug: false,
};
```

## 🔄 Mixed Mode (Advanced)

Load some data from JSON, some from API:

```typescript
async function loadDataCustom(type: DataType) {
  if (type === 'projects') {
    return fetchAPI(type);
  }
  
  return fetchJSON(type);
}
```

## 🛠️ Backend Examples

### Node.js + Express

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/about', (req, res) => {
  res.json({
    name: "Your Name",
    title: "Developer",
    subtitle: "Building amazing things",
    bio: "Full bio here...",
    image: "/img/profile.jpg",
    resumeUrl: "/resume.pdf",
    links: {
      github: "https://github.com/username",
      linkedin: "https://linkedin.com/in/username",
      twitter: "https://twitter.com/username",
      email: "email@example.com"
    },
    stats: [
      { label: "Years Experience", value: "5+" },
      { label: "Projects Completed", value: "50+" }
    ]
  });
});

app.get('/skills', (req, res) => {
  res.json({
    categories: [
      {
        name: "Frontend",
        icon: "Code2",
        skills: [
          { name: "React", level: 90 },
          { name: "TypeScript", level: 85 }
        ]
      }
    ]
  });
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
```

### Python + Flask

```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/about')
def get_about():
    return jsonify({
        'name': 'Your Name',
        'title': 'Developer',
        'subtitle': 'Building amazing things',
        'bio': 'Full bio here...',
        'image': '/img/profile.jpg',
        'resumeUrl': '/resume.pdf',
        'links': {
            'github': 'https://github.com/username',
            'linkedin': 'https://linkedin.com/in/username',
            'twitter': 'https://twitter.com/username',
            'email': 'email@example.com'
        },
        'stats': [
            {'label': 'Years Experience', 'value': '5+'},
            {'label': 'Projects Completed', 'value': '50+'}
        ]
    })

@app.route('/skills')
def get_skills():
    return jsonify({
        'categories': [
            {
                'name': 'Frontend',
                'icon': 'Code2',
                'skills': [
                    {'name': 'React', 'level': 90},
                    {'name': 'TypeScript', 'level': 85}
                ]
            }
        ]
    })

if __name__ == '__main__':
    app.run(port=3000)
```

### PHP + Laravel

```php
// routes/api.php
Route::get('/about', function () {
    return response()->json([
        'name' => 'Your Name',
        'title' => 'Developer',
        'subtitle' => 'Building amazing things',
        'bio' => 'Full bio here...',
        'image' => '/img/profile.jpg',
        'resumeUrl' => '/resume.pdf',
        'links' => [
            'github' => 'https://github.com/username',
            'linkedin' => 'https://linkedin.com/in/username',
            'twitter' => 'https://twitter.com/username',
            'email' => 'email@example.com'
        ],
        'stats' => [
            ['label' => 'Years Experience', 'value' => '5+'],
            ['label' => 'Projects Completed', 'value' => '50+']
        ]
    ]);
});

Route::get('/skills', function () {
    return response()->json([
        'categories' => [
            [
                'name' => 'Frontend',
                'icon' => 'Code2',
                'skills' => [
                    ['name' => 'React', 'level' => 90],
                    ['name' => 'TypeScript', 'level' => 85]
                ]
            ]
        ]
    ]);
});
```

## 🗄️ Database Integration

### Example with MongoDB

```javascript
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const client = new MongoClient('mongodb://localhost:27017');

app.get('/projects', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('portfolio');
    const projects = await db.collection('projects')
      .find({ status: 'public' })
      .toArray();
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Example with PostgreSQL

```javascript
const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  connectionString: 'postgresql://...'
});

app.get('/experience', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM experience ORDER BY from_date DESC'
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

## 🎯 Contact Form Submission

When API mode is enabled, you can handle form submissions:

1. **Update Contact Component** (`src/components/sections/Contact.tsx`):

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    if (CONFIG.use_api && CONFIG.base_url) {
      const response = await fetch(`${CONFIG.base_url}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({});
      } else {
        toast.error('Failed to send message');
      }
    } else {
      toast.info('Backend not connected');
    }
  } catch (error) {
    toast.error('An error occurred');
  } finally {
    setSubmitting(false);
  }
};
```

2. **Backend Endpoint** (Node.js example):

```javascript
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  res.json({ success: true, message: 'Message received' });
});
```

## 🔍 Debugging

### Enable Debug Mode

In `src/config/index.ts`:

```typescript
export const CONFIG = {
  use_api: false,
  base_url: "",
  endpoints: {
    about: "/about",
    skills: "/skills",
    projects: "/projects",
    experience: "/experience",
    contact: "/contact",
  },
  local_json: {
    about: "/data/about.json",
    skills: "/data/skills.json",
    projects: "/data/projects.json",
    experience: "/data/experience.json",
    contact: "/data/contact.json",
  },
  debug: true,
};
```

This will log all data loading operations to the console:

```
[DataLoader] Initiating data load for: about
[DataLoader] Loading from API: https://api.yoursite.com/about
[DataLoader] ✓ API loaded successfully for: about
```

### Common Issues

**1. CORS Errors**

Your API needs to allow requests from your frontend:

```javascript
// Node.js
app.use(cors({
  origin: 'https://yoursite.com',
  methods: ['GET', 'POST'],
}));
```

**2. Wrong Data Format**

Ensure your API returns data in the exact format expected by the components.

**3. Network Errors**

Check:
- API URL is correct
- API is running
- Network connectivity
- Firewall settings

## 📈 Caching

Add caching to improve performance:

```typescript
const cache = new Map();

async function loadData(type: DataType): Promise<any> {
  if (cache.has(type)) {
    debugLog(`Using cached data for: ${type}`);
    return cache.get(type);
  }
  
  const data = CONFIG.use_api 
    ? await fetchAPI(type)
    : await fetchJSON(type);
  
  cache.set(type, data);
  
  return data;
}
```

## 🔄 Real-time Updates

For real-time data updates, use WebSockets or polling:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    loadData('projects').then(setProjects);
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

## 🚀 Deployment

### Environment Variables

Set in your hosting platform:

```
VITE_API_BASE_URL=https://api.yoursite.com
VITE_API_KEY=your-api-key
```

### Platforms

- **Vercel**: Add in Project Settings → Environment Variables
- **Netlify**: Add in Site Settings → Environment Variables  
- **Heroku**: Use `heroku config:set`

## 📚 Additional Resources

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [REST API Best Practices](https://restfulapi.net/)

---

Need help? Check the main README.md or open an issue.
