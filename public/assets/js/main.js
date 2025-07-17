class IdeasPage {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortBy = '-published_at';
        this.totalItems = 0;
        this.totalPages = 0;
        this.lastScrollY = 0;
        this.isLoading = false;
        this.baseURL = '/api/ideas';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromURL();
        this.loadPosts();
        this.setupScrollEffects();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Controls
        document.getElementById('showPerPage').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.updateURL();
            this.loadPosts();
        });

        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.currentPage = 1;
            this.updateURL();
            this.loadPosts();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && this.currentPage > 1) {
                this.goToPage(this.currentPage - 1);
            } else if (e.key === 'ArrowRight' && this.currentPage < this.totalPages) {
                this.goToPage(this.currentPage + 1);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadFromURL();
            this.loadPosts();
        });
    }

    setupMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.querySelector('.nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                menu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                }
            });
        }
    }

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        this.currentPage = parseInt(params.get('page')) || 1;
        this.pageSize = parseInt(params.get('size')) || 10;
        this.sortBy = params.get('sort') || '-published_at';
        
        // Update controls
        document.getElementById('showPerPage').value = this.pageSize;
        document.getElementById('sortBy').value = this.sortBy;
    }

    updateURL() {
        const params = new URLSearchParams();
        params.set('page', this.currentPage);
        params.set('size', this.pageSize);
        params.set('sort', this.sortBy);
        
        const newURL = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newURL);
    }

    async loadPosts() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        const container = document.getElementById('postsContainer');
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Loading posts...
            </div>
        `;

        try {
            const params = new URLSearchParams({
                page: this.currentPage,
                size: this.pageSize,
                sort: this.sortBy
            });

            const response = await fetch(`${this.baseURL}?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            this.totalItems = data.meta.total;
            this.totalPages = data.meta.total_pages;
            
            this.renderPosts(data.data);
            this.renderPagination();
            this.updateShowingInfo();
            
        } catch (error) {
            console.error('Error loading posts:', error);
            container.innerHTML = `
                <div class="error">
                    <h3>Oops! Something went wrong</h3>
                    <p>Failed to load posts. Please check your connection and try again.</p>
                    <button onclick="window.location.reload()" style="
                        margin-top: 15px;
                        padding: 10px 20px;
                        background: #ff6b35;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Retry</button>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    renderPosts(posts) {
        const container = document.getElementById('postsContainer');
        
        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="error">
                    <h3>No posts found</h3>
                    <p>There are no posts to display at the moment.</p>
                </div>
            `;
            return;
        }
        
        const grid = document.createElement('div');
        grid.className = 'posts-grid';
        
        posts.forEach((post, index) => {
            const card = document.createElement('div');
            card.className = 'post-card';
            card.setAttribute('role', 'article');
            card.setAttribute('tabindex', '0');
            
            const date = new Date(post.published_at);
            const formattedDate = this.formatDate(date);
            
            card.innerHTML = `
                <div class="post-image">
                    <img src="${post.small_image}" 
                         alt="${post.title}" 
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 300 200\\"><rect width=\\"300\\" height=\\"200\\" fill=\\"%23f0f0f0\\"/><text x=\\"150\\" y=\\"100\\" text-anchor=\\"middle\\" fill=\\"%23999\\">Image not found</text></svg>'">
                </div>
                <div class="post-content">
                    <div class="post-date">${formattedDate}</div>
                    <h3 class="post-title">${this.escapeHtml(post.title)}</h3>
                </div>
            `;
            
            // Add click and keyboard event listeners
            const handleClick = () => {
                // In a real application, this would navigate to the post detail page
                console.log('Navigate to post:', post.id);
            };
            
            card.addEventListener('click', handleClick);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            });
            
            // Add stagger animation
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.animation = 'fadeInUp 0.6s ease forwards';
            
            grid.appendChild(card);
        });
        
        container.innerHTML = '';
        container.appendChild(grid);
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        container.innerHTML = '';
        
        if (this.totalPages <= 1) return;
        
        // Previous button
        const prevBtn = this.createPaginationButton('←', this.currentPage - 1, this.currentPage === 1);
        container.appendChild(prevBtn);
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            const firstBtn = this.createPaginationButton('1', 1, false);
            container.appendChild(firstBtn);
            
            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.style.padding = '10px';
                dots.style.color = '#666';
                container.appendChild(dots);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = this.createPaginationButton(i.toString(), i, false, i === this.currentPage);
            container.appendChild(pageBtn);
        }
        
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.style.padding = '10px';
                dots.style.color = '#666';
                container.appendChild(dots);
            }
            
            const lastBtn = this.createPaginationButton(this.totalPages.toString(), this.totalPages, false);
            container.appendChild(lastBtn);
        }
        
        // Next button
        const nextBtn = this.createPaginationButton('→', this.currentPage + 1, this.currentPage === this.totalPages);
        container.appendChild(nextBtn);
    }

    createPaginationButton(text, page, disabled = false, active = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = disabled;
        button.className = active ? 'active' : '';
        button.setAttribute('aria-label', `Go to page ${page}`);
        
        if (!disabled) {
            button.addEventListener('click', () => this.goToPage(page));
        }
        
        return button;
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) return;
        
        this.currentPage = page;
        this.updateURL();
        this.loadPosts();
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateShowingInfo() {
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
        
        document.getElementById('showingInfo').textContent = 
            `Showing ${start} - ${end} of ${this.totalItems}`;
    }

    formatDate(date) {
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupScrollEffects() {
        const header = document.getElementById('header');
        const bannerBg = document.getElementById('bannerBg');
        let ticking = false;
        
        const updateScrollEffects = () => {
            const currentScrollY = window.scrollY;
            
            // Header hide/show effect
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            // Header transparency
            if (currentScrollY > 50) {
                header.classList.add('transparent');
            } else {
                header.classList.remove('transparent');
            }
            
            // Parallax effect
            if (bannerBg) {
                const parallaxSpeed = 0.5;
                bannerBg.style.transform = `translateY(${currentScrollY * parallaxSpeed}px)`;
            }
            
            this.lastScrollY = currentScrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
}

// CSS Animation for post cards
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .post-card {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IdeasPage();
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}