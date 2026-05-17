// ==================== COMMENTS STORAGE ====================
const STORAGE_KEY = 'article_comments';

// ==================== GET COMMENTS FROM STORAGE ====================
function getCommentsFromStorage(articleId) {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allComments = stored ? JSON.parse(stored) : {};
    return allComments[articleId] || [];
}

// ==================== SAVE COMMENTS TO STORAGE ====================
function saveCommentsToStorage(articleId, comments) {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allComments = stored ? JSON.parse(stored) : {};
    allComments[articleId] = comments;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
}

// ==================== ADD COMMENT ====================
function addComment(articleId, name, email, text) {
    const comments = getCommentsFromStorage(articleId);
    
    const newComment = {
        id: Date.now(),
        name: name,
        email: email,
        text: text,
        date: new Date().toISOString(),
        approved: true // In real app, admin approval needed
    };
    
    comments.push(newComment);
    saveCommentsToStorage(articleId, comments);
    
    return newComment;
}

// ==================== LOAD COMMENTS ====================
function loadComments(articleId) {
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    
    if (!commentsList) return;
    
    const comments = getCommentsFromStorage(articleId);
    
    // Setup form submission
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value.trim();
            const email = document.getElementById('comment-email').value.trim();
            const text = document.getElementById('comment-text').value.trim();
            
            if (!name || !email || !text) {
                alert('Lütfen tüm alanları doldurun.');
                return;
            }
            
            // Validate email
            if (!isValidEmail(email)) {
                alert('Geçerli bir e-posta adresi girin.');
                return;
            }
            
            addComment(articleId, name, email, text);
            commentForm.reset();
            loadComments(articleId);
        });
    }
    
    // Display comments
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">Henüz yorum yok. İlk yorumu yapan siz olun!</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-author">${escapeHtml(comment.name)}</div>
            <div class="comment-date">${formatDate(comment.date)}</div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
        </div>
    `).join('');
}

// ==================== EMAIL VALIDATION ====================
function isValidEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
}

// ==================== ESCAPE HTML ====================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
