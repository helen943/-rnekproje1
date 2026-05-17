// ==================== BLOG PAGE VARIABLES ====================
let currentPage = 1;
const articlesPerPage = 6;
let filteredArticles = [];

// ==================== INITIALIZE BLOG PAGE ====================
function initBlogPage() {
    filteredArticles = [...allArticles];
    renderArticles();
    renderPagination();
    setupFilters();
}

// ==================== SETUP FILTERS ====================
function setupFilters() {
    const filterInput = document.getElementById('filter-input');
    const sortSelect = document.getElementById('sort-select');
    
    if (filterInput) {
        filterInput.addEventListener('input', (e) => {
            const query = e.target.value;
            filteredArticles = query ? searchArticles(query) : [...allArticles];
            currentPage = 1;
            renderArticles();
            renderPagination();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const sortType = e.target.value;
            sortArticles(sortType);
            currentPage = 1;
            renderArticles();
            renderPagination();
        });
    }
}

// ==================== SORT ARTICLES ====================
function sortArticles(sortType) {
    switch (sortType) {
        case 'newest':
            filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'title':
            filteredArticles.sort((a, b) => a.title.localeCompare(b.title, 'tr'));
            break;
    }
}

// ==================== RENDER ARTICLES ====================
function renderArticles() {
    const container = document.getElementById('articles-container');
    if (!container) return;
    
    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const paginatedArticles = filteredArticles.slice(start, end);
    
    if (paginatedArticles.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #999;">Makale bulunamadı.</p>';
        return;
    }
    
    container.innerHTML = paginatedArticles.map(article => `
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

// ==================== RENDER PAGINATION ====================
function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;
    
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Önceki sayfa
    if (currentPage > 1) {
        html += `<a onclick="changePage(${currentPage - 1})">← Önceki</a>`;
    } else {
        html += `<span class="disabled">← Önceki</span>`;
    }
    
    // Sayfa numaraları
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            html += `<span class="active">${i}</span>`;
        } else {
            html += `<a onclick="changePage(${i})">${i}</a>`;
        }
    }
    
    // Sonraki sayfa
    if (currentPage < totalPages) {
        html += `<a onclick="changePage(${currentPage + 1})">Sonraki →</a>`;
    } else {
        html += `<span class="disabled">Sonraki →</span>`;
    }
    
    container.innerHTML = html;
}

// ==================== CHANGE PAGE ====================
function changePage(page) {
    currentPage = page;
    renderArticles();
    renderPagination();
    window.scrollTo(0, 0);
}

// ==================== LOAD ARTICLE PAGE ====================
function loadArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    
    if (!articleId) {
        document.getElementById('article-content').innerHTML = '<p>Makale bulunamadı.</p>';
        return;
    }
    
    const article = getArticleById(parseInt(articleId));
    
    if (!article) {
        document.getElementById('article-content').innerHTML = '<p>Makale bulunamadı.</p>';
        return;
    }
    
    // Set meta tags for better SEO
    document.title = `${article.title} - Yürüyüş & Bilinç Altı`;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', article.title);
    }
    
    // Fill article content
    document.getElementById('article-title').textContent = article.title;
    document.getElementById('article-author').textContent = article.author;
    document.getElementById('article-date').textContent = formatDate(article.date);
    document.getElementById('article-category').textContent = article.category;
    document.getElementById('article-image').src = article.image;
    document.getElementById('article-body').innerHTML = article.content;
    
    // Tags
    const tagsContainer = document.getElementById('article-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = article.tags.map(tag => 
            `<span class="tag" onclick="searchByTag('${tag}')">#${tag.replace('-', ' ')}</span>`
        ).join('');
    }
    
    // Load comments
    if (typeof loadComments === 'function') {
        loadComments(articleId);
    }
    
    // Load related articles
    loadRelatedArticles(article.id, article.category);
    
    // Setup social sharing
    if (typeof setupSocialSharing === 'function') {
        setupSocialSharing(article.title);
    }
}

// ==================== LOAD RELATED ARTICLES ====================
function loadRelatedArticles(articleId, category) {
    const container = document.getElementById('related-articles-container');
    if (!container) return;
    
    const related = allArticles
        .filter(a => a.category === category && a.id !== articleId)
        .slice(0, 3);
    
    if (related.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">İlgili makale bulunamadı.</p>';
        return;
    }
    
    container.innerHTML = related.map(article => `
        <div class="article-card">
            <img src="${article.image}" alt="${article.title}">
            <div class="article-card-content">
                <h3>${article.title}</h3>
                <p class="summary">${article.summary}</p>
                <div class="meta">
                    <span>${formatDate(article.date)}</span>
                </div>
                <a href="article.html?id=${article.id}">Devamını Oku →</a>
            </div>
        </div>
    `).join('');
}

// ==================== SEARCH BY TAG ====================
function searchByTag(tag) {
    // Redirect to search page with tag query
    window.location.href = `search.html?q=${encodeURIComponent(tag)}`;
}
