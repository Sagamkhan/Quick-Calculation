# Quick Calculator & Developer Tools

A client-side web application featuring 250+ calculators, AI prompt generators, PDF utilities, financial engines, developer converters, and tool comparison features.

## 🚀 GitHub Deployment Guide (GitHub Pages / Vercel / Netlify)

Haan, ye project GitHub par perfectly deploy ho jayega! Target static build (`npm run build`) pure client-side code, PWA support, and static assets produce karta hai.

### Option 1: Automatic GitHub Pages Deployment (Recommended)

Iss repository me `.github/workflows/deploy.yml` pehle se add kar diya gaya hai.

1. **GitHub Repository me Push karein**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Quick Calculator"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **GitHub Pages Settings Enable karein**:
   - Apne GitHub repository ki **Settings** > **Pages** me jayein.
   - **Source** option me **GitHub Actions** select karein.
   - Code push hote hi GitHub Action automatic build karke aapki site ko `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` par live deploy kar dega!

---

### Option 2: Deploy on Vercel / Netlify (1-Click)

1. [Vercel](https://vercel.com) ya [Netlify](https://netlify.com) par login karein.
2. Apne GitHub account ko connect karke iss repository ko import karein.
3. Framework Preset me **Vite** automatically select ho jayega.
4. **Deploy** button dabaayein!

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

## ✨ Features
- 250+ Interactive Client-side Tools & Calculators
- Side-by-side Tool Comparison Modal
- Confetti explosion animations on successful calculations
- PWA & Offline Support with Service Workers
- Full Keyboard Navigation & Command Shortcuts (`/` or `Cmd+K` for search, `Esc` to close)
