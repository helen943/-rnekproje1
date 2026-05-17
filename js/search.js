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
            <div class="no-results">
                <h2>"${query}" için sonuç bulunamadı</h2>
                <p>Lütfen başka bir terim deneyin.</p>
            </div>
        `;
        return;
    }
    
    let html = `<h2>"${query}" için ${results.length} sonuç bulundu</h2>`;
    html += '<div class="article-grid">';
    
    html += results.map(article => `
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
    
    html += '</div>';
    resultsContainer.innerHTML = html;
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
