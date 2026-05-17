// ==================== SEARCH PAGE ====================
function initSearchPage() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    
    if (searchInput && initialQuery) {
        searchInput.value = decodeURIComponent(initialQuery);
        performSearch(initialQuery);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
                // Update URL
                window.history.pushState({}, '', `search.html?q=${encodeURIComponent(query)}`);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

// ==================== PERFORM SEARCH ====================
function performSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    const results = searchArticles(query);
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results glass-box" style="width: 100%; text-align: center;">
                <h2 style="color: var(--text-main);">"${query}" için sonuç bulunamadı</h2>
                <p style="color: var(--text-muted);">Lütfen başka bir terim deneyin.</p>
            </div>
        `;
        return;
    }
    
    let html = `<h2>"${query}" için ${results.length} sonuç bulundu</h2>`;
    html += '<div class="article-grid">';
    
    html += results.map((article, index) => `
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
    
    html += '</div>';
    resultsContainer.innerHTML = html;
    
    // Trigger reveal for newly added elements
    setTimeout(() => { if(typeof initRevealAnimations === 'function') initRevealAnimations(); }, 50);
}

// ==================== INITIALIZE ON PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for articles to be loaded
    let retries = 0;
    const checkInterval = setInterval(() => {
        if (allArticles.length > 0) {
            clearInterval(checkInterval);
            initSearchPage();
        } else if (retries < 10) {
            retries++;
        } else {
            clearInterval(checkInterval);
            console.error('Makaleler yüklenemedi');
        }
    }, 100);
});
