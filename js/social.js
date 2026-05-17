// ==================== SETUP SOCIAL SHARING ====================
function setupSocialSharing(articleTitle) {
    const twitterBtn = document.getElementById('share-twitter');
    const facebookBtn = document.getElementById('share-facebook');
    const linkedinBtn = document.getElementById('share-linkedin');
    const whatsappBtn = document.getElementById('share-whatsapp');
    
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(articleTitle);
    
    if (twitterBtn) {
        twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        twitterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(twitterBtn.href, '_blank', 'width=600,height=400');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        facebookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(facebookBtn.href, '_blank', 'width=600,height=400');
        });
    }
    
    if (linkedinBtn) {
        linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        linkedinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(linkedinBtn.href, '_blank', 'width=600,height=400');
        });
    }
    
    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(whatsappBtn.href, '_blank', 'width=600,height=400');
        });
    }
}

// ==================== COPY TO CLIPBOARD ====================
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Bağlantı kopyalandı!');
    }).catch(() => {
        alert('Kopyalama başarısız oldu.');
    });
}
