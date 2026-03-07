# Brandon Michelson Portfolio

Premium portfolio website showcasing UX/UI design and frontend development work. Built with modern web technologies and advanced animations.

## Tech Stack

### Core
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)** - Modern vanilla JS

### Libraries (via CDN)
- **[GSAP 3.12](https://greensock.com/gsap/)** - Professional-grade animations
- **[ScrollTrigger](https://greensock.com/scrolltrigger/)** - Scroll-based animations
- **[Lenis](https://lenis.studiofreight.com/)** - Smooth scroll library
- **[Font Awesome 6](https://fontawesome.com/)** - Icons
- **[Google Fonts](https://fonts.google.com/)** - Space Grotesk & Inter

## Features

### Design
- Dark, cinematic theme with coral orange accents
- Premium typography with Space Grotesk headings
- Magazine-style asymmetric project grid
- Generous whitespace and breathing room
- Mobile-first responsive design

### Animations
- Cinematic hero entrance with staggered reveals
- Scroll-triggered section animations
- Parallax effects on hero content
- Smooth hover interactions on cards
- 60fps performance target

### Accessibility
- Skip to content link
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators visible
- Reduced motion support
- WCAG AA color contrast

### Performance
- Transform/opacity-only animations (GPU-accelerated)
- Lazy loading ready for images
- Minimal layout shifts (CLS)
- Fast first contentful paint

## Project Structure

```
brandon-portfolio/
├── index.html      # Main HTML file
├── style.css       # All styles with CSS variables
├── script.js       # GSAP animations, Lenis, interactions
└── README.md       # This file
```

## Getting Started

### Local Development

1. **Clone or download the project**
   ```bash
   cd brandon-portfolio
   ```

2. **Start a local server**

   Using VS Code Live Server extension, or:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (http-server)
   npx http-server
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Adding Your Photos

Replace the placeholder elements with actual images:

1. **Hero Photo** - Add your professional headshot
   - Recommended: 400x500px or similar aspect ratio
   - Replace the `.hero-image-placeholder` div with an `<img>` tag

2. **Project Images** - Add screenshots of your work
   - Featured project: 800x500px
   - Standard projects: 600x400px
   - Replace `.project-image-placeholder` divs with `<img>` tags

### Customization

#### Colors
Edit CSS variables in `style.css`:
```css
:root {
    --accent: #e94560;        /* Your accent color */
    --accent-dim: #b83a4f;    /* Darker accent */
    --black: #0a0a0a;         /* Background */
}
```

#### Fonts
Change Google Fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YOUR+FONT&display=swap" rel="stylesheet">
```

Update CSS variables:
```css
:root {
    --font-heading: 'Your Font', sans-serif;
    --font-body: 'Your Font', sans-serif;
}
```

#### Animation Timing
Adjust in `script.js`:
```javascript
// Lenis smoothness
const lenis = new Lenis({
    lerp: 0.08,  // Lower = smoother (0.05-0.15)
});

// GSAP animation durations
duration: 1.2,  // Seconds
ease: 'expo.out',  // Easing function
```

## Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo to Netlify
3. Deploy with default settings

### Vercel
1. Push to GitHub
2. Import to Vercel
3. Deploy

### GitHub Pages
1. Push to GitHub
2. Settings > Pages > Deploy from branch

### Manual Upload
Upload all files to your web host's public directory.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| First Paint | < 1.5s |

## Adding More Projects

1. Copy an existing `.project-card` in `index.html`
2. Update:
   - Category tag
   - Title
   - Description
   - Tech tags
   - Link
3. For featured layout, add `featured` class

## Contact Form

The form is demo-only by default. To make it functional:

### Option 1: Formspree
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

### Option 2: Netlify Forms
```html
<form name="contact" netlify>
```

### Option 3: Custom Backend
Replace the form submit handler in `script.js`.

## Credits

- Built with [Claude Code](https://claude.ai/claude-code)
- Animations by [GSAP](https://greensock.com/)
- Smooth scroll by [Lenis](https://lenis.studiofreight.com/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

## License

This portfolio template is for Brandon Michelson's personal use.

---

**Questions?** Contact [bmichelson56@gmail.com](mailto:bmichelson56@gmail.com)
