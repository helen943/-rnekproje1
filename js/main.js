// ==================== GLOBAL VARIABLES ====================
let allArticles = [];

// ==================== LOAD ARTICLES ====================
async function loadArticles() {
    try {
        const response = await fetch('data/articles.json');
        allArticles = await response.json();
        console.log('✓ İncelemeler yüklendi:', allArticles.length, 'makale');
    } catch (error) {
        console.error('İncelemeler yüklenemedi:', error);
        allArticles = [];
    }
}

// ==================== SCROLL REVEAL ANIMATIONS ====================
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    
    function checkReveal() {
        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Trigger on initial load
}

// ==================== NAVBAR SCROLL EFFECT ====================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Trigger on initial load in case page is loaded scrolled
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', async () => {
    initNavbarScroll();
    
    await loadArticles();
    
    // Ana sayfada featured articles yükle
    if (document.getElementById('featured-articles')) {
        loadFeaturedArticles();
    }
    
    // Blog sayfasını kontrol et
    if (document.querySelector('.article-grid#articles-container')) {
        if(typeof initBlogPage === 'function') initBlogPage();
    }
    
    // Makale sayfasını kontrol et
    if (document.getElementById('article-content')) {
        if(typeof loadArticlePage === 'function') loadArticlePage();
    }
    
    // Initialize reveal animations after DOM is fully constructed
    setTimeout(initRevealAnimations, 100);
});

// ==================== FEATURED ARTICLES ====================
function loadFeaturedArticles() {
    const container = document.getElementById('featured-articles');
    if (!container) return;
    
    // İlk 3 makaleyi göster
    const featured = allArticles.slice(0, 3);
    
    container.innerHTML = featured.map((article, index) => `
        <div class="article-card reveal" style="animation-delay: ${index * 0.1}s">
            <div class="img-wrapper">
                <img src="${article.image}" alt="${article.title}">
            </div>
            <div class="article-card-content">
                <div class="meta">
                    <span class="category">${article.category}</span>
                    <span>${formatDate(article.date)}</span>
                </div>
                <h3>${article.title}</h3>
                <p class="summary">${article.summary}</p>
                <a href="article.html?id=${article.id}" class="read-more">Devamını Oku</a>
            </div>
        </div>
    `).join('');
    
    // Trigger reveal for newly added elements
    setTimeout(initRevealAnimations, 50);
}

// ==================== DATE FORMATTING ====================
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    // Eğer tarih stringi zaten 'T' içeriyorsa doğrudan parse et, yoksa yerel gün başlangıcı ekle
    const hasTime = dateString.includes('T');
    const date = new Date(hasTime ? dateString : dateString + 'T00:00:00');
    return isNaN(date.getTime()) ? 'Bilinmeyen Tarih' : date.toLocaleDateString('tr-TR', options);
}

// ==================== UTILITY: GET ARTICLE BY ID ====================
function getArticleById(id) {
    return allArticles.find(article => article.id === parseInt(id));
}

// ==================== UTILITY: SEARCH ARTICLES ====================
function searchArticles(query) {
    const q = query.toLowerCase();
    return allArticles.filter(article => 
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q) ||
        article.tags.some(tag => tag.toLowerCase().includes(q)) ||
        article.author.toLowerCase().includes(q)
    );
}

// ==================== SHARE ON SOCIAL ====================
function shareOnSocial(platform, title, url) {
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);
    
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// ==================== CONSOLE GREETING ====================
console.log('%c🚶 WalkMind Platformuna Hoş Geldiniz', 'color: #d4af37; font-size: 16px; font-weight: bold;');
