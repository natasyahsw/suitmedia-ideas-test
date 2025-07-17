const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      childSrc: ["'self'"],
      frameSrc: ["'self'"],
      workerSrc: ["'self'"],
      manifestSrc: ["'self'"]
    }
  }
}));

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Mock data for API
const mockPosts = [
  {
    id: 1,
    title: 'Kenali Tingkatan Influencers berdasarkan Jumlah Followers',
    published_at: '2024-01-15T10:30:00Z',
    small_image: 'https://picsum.photos/300/200?random=1',
    medium_image: 'https://picsum.photos/600/400?random=1'
  },
  {
    id: 2,
    title: 'Jangan Asal Pilih Influencer, Berikut Cara Menyusun Strategi Influencer Marketing',
    published_at: '2024-01-14T14:20:00Z',
    small_image: 'https://picsum.photos/300/200?random=2',
    medium_image: 'https://picsum.photos/600/400?random=2'
  },
  {
    id: 3,
    title: 'Tips Memilih Influencer yang Tepat untuk Brand Anda',
    published_at: '2024-01-13T09:15:00Z',
    small_image: 'https://picsum.photos/300/200?random=3',
    medium_image: 'https://picsum.photos/600/400?random=3'
  },
  {
    id: 4,
    title: 'Strategi Content Marketing yang Efektif di Era Digital',
    published_at: '2024-01-12T16:45:00Z',
    small_image: 'https://picsum.photos/300/200?random=4',
    medium_image: 'https://picsum.photos/600/400?random=4'
  },
  {
    id: 5,
    title: 'Mengoptimalkan ROI melalui Influencer Marketing',
    published_at: '2024-01-11T11:30:00Z',
    small_image: 'https://picsum.photos/300/200?random=5',
    medium_image: 'https://picsum.photos/600/400?random=5'
  },
  {
    id: 6,
    title: 'Tren Social Media Marketing 2024',
    published_at: '2024-01-10T13:20:00Z',
    small_image: 'https://picsum.photos/300/200?random=6',
    medium_image: 'https://picsum.photos/600/400?random=6'
  },
  {
    id: 7,
    title: 'Cara Membangun Brand Awareness melalui Digital Marketing',
    published_at: '2024-01-09T15:10:00Z',
    small_image: 'https://picsum.photos/300/200?random=7',
    medium_image: 'https://picsum.photos/600/400?random=7'
  },
  {
    id: 8,
    title: 'Pentingnya Engagement Rate dalam Influencer Marketing',
    published_at: '2024-01-08T08:25:00Z',
    small_image: 'https://picsum.photos/300/200?random=8',
    medium_image: 'https://picsum.photos/600/400?random=8'
  }
];

// Generate more mock data
function generateMockPosts(count = 100) {
  const posts = [];
  const baseTitles = [
    'Kenali Tingkatan Influencers berdasarkan Jumlah Followers',
    'Jangan Asal Pilih Influencer, Berikut Cara Menyusun Strategi Influencer Marketing',
    'Tips Memilih Influencer yang Tepat untuk Brand Anda',
    'Strategi Content Marketing yang Efektif di Era Digital',
    'Mengoptimalkan ROI melalui Influencer Marketing',
    'Tren Social Media Marketing 2024',
    'Cara Membangun Brand Awareness melalui Digital Marketing',
    'Pentingnya Engagement Rate dalam Influencer Marketing'
  ];

  for (let i = 1; i <= count; i++) {
    const randomTitleIndex = Math.floor(Math.random() * baseTitles.length);
    const randomDaysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - randomDaysAgo);

    posts.push({
      id: i,
      title: `${baseTitles[randomTitleIndex]} ${i > 8 ? `(${i})` : ''}`,
      published_at: date.toISOString(),
      small_image: `https://picsum.photos/300/200?random=${i}`,
      medium_image: `https://picsum.photos/600/400?random=${i}`
    });
  }

  return posts;
}

const allPosts = generateMockPosts(100);

// API Routes
app.get('/api/ideas', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query['page[size]']) || parseInt(req.query.size) || 10;
    const sortBy = req.query.sort || '-published_at';

    // Sort posts
    let sortedPosts = [...allPosts];
    if (sortBy === '-published_at') {
      sortedPosts.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    } else if (sortBy === 'published_at') {
      sortedPosts.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
    }

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    // Response
    res.json({
      data: paginatedPosts,
      meta: {
        total: allPosts.length,
        page: page,
        per_page: pageSize,
        total_pages: Math.ceil(allPosts.length / pageSize)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;