// ==================== GLOBAL VARIABLES ====================
let allArticles = [];

// ==================== LOAD ARTICLES ====================
async function loadArticles() {
    try {
        const response = await fetch('data/articles.json');
        allArticles = await response.json();
        console.log('✓ Makaleler yüklendi:', allArticles.length, 'makale');
    } catch (error) {
        console.error('Makaleler yüklenemedi:', error);
        allArticles = [];
    }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', async () => {
    await loadArticles();
    
    // Ana sayfada featured articles yükle
    if (document.getElementById('featured-articles')) {
        loadFeaturedArticles();
    }
    
    // Blog sayfasını kontrol et
    if (document.querySelector('.article-grid#articles-container')) {
        initBlogPage();
    }
    
    // Makale sayfasını kontrol et
    if (document.getElementById('article-content')) {
        loadArticlePage();
    }
});

// ==================== FEATURED ARTICLES ====================
function loadFeaturedArticles() {
    const container = document.getElementById('featured-articles');
    if (!container) return;
    
    // İlk 3 makaleyi göster
    const featured = allArticles.slice(0, 3);
    
    container.innerHTML = featured.map(article => `
        <div class="article-card">
            <img src="${article.image}" alt="${article.title}">
            <div class="article-card-content">
                <h3>${article.title}</h3>
                <p class="summary">${article.summary}</p>
                <div class="meta">
                    <span>${formatDate(article.date)}</span>
                    <span class="category">${article.category}</span>
                </div>
                <a href="article.html?id=${article.id}">Devamını Oku →</a>
            </div>
        </div>
    `).join('');
}

// ==================== DATE FORMATTING ====================
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('tr-TR', options);
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
console.log('%c🚶 Yürüyüş & Bilinç Altı Sitesine Hoş Geldiniz', 'color: #3498db; font-size: 16px; font-weight: bold;');
