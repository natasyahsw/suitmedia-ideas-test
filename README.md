# Suitmedia Ideas Page

A modern, responsive web application showcasing the Suitmedia Ideas page with dynamic content loading, pagination, and smooth user interactions.

## Features

* **Responsive Design**: Fully responsive layout that works on all devices
* **Dynamic Content Loading**: Fetch posts from API with pagination support
* **Smooth Animations**: Engaging animations and transitions
* **Interactive UI**: Hover effects, loading states, and user feedback
* **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML
* **Performance Optimized**: Lazy loading images, efficient scrolling, and optimized assets
* **SEO Friendly**: Proper meta tags and structured content

## Technologies Used

* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Backend**: Node.js, Express.js
* **Styling**: Modern CSS with Flexbox and Grid
* **Icons**: SVG icons and custom graphics
* **Images**: Placeholder images from Picsum

## Project Structure

```
suitmedia-ideas/
├── public/
│   ├── index.html              # Main HTML file
│   └── assets/
│       ├── css/
│       │   └── styles.css      # Main stylesheet
│       ├── js/
│       │   └── main.js         # Main JavaScript file
│       └── images/
│           ├── logo.svg        # Suitmedia logo
│           └── favicon.ico     # Site favicon
├── server.js                   # Express server
├── package.json                # Dependencies and scripts
├── .gitignore                  # Git ignore file
└── README.md                   # This file
```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd suitmedia-ideas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser** Navigate to `http://localhost:3000`

## Scripts

* `npm start` - Start the production server
* `npm run dev` - Start the development server with auto-restart
* `npm test` - Run tests (not implemented yet)

## API Endpoints

### GET /api/ideas

Fetch paginated ideas/posts

**Query Parameters:**

* `page` (number): Page number (default: 1)
* `size` (number): Items per page (default: 10)
* `sort` (string): Sort order (`-published_at` for newest, `published_at` for oldest)

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Post title",
      "published_at": "2024-01-15T10:30:00Z",
      "small_image": "https://picsum.photos/300/200?random=1",
      "medium_image": "https://picsum.photos/600/400?random=1"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 10,
    "total_pages": 10
  }
}
```

### GET /api/health

Health check endpoint

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Features in Detail

### Responsive Design

* Mobile-first approach
* Flexible grid system
* Touch-friendly interface
* Adaptive navigation menu

### Performance Optimizations

* Lazy loading for images
* Efficient scroll handling with requestAnimationFrame
* Optimized CSS animations
* Minimal HTTP requests

### User Experience

* Smooth scrolling effects
* Loading states and error handling
* Keyboard navigation support
* Hover effects and transitions
* Mobile menu toggle

### Code Quality

* Modular JavaScript architecture
* Clean, semantic HTML
* Organized CSS structure
* Error handling and validation

## Browser Support

* Chrome (latest)
* Firefox (latest)
* Safari (latest)
* Edge (latest)
* Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

### Production Build

```bash
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```


