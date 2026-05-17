const http = require('http');
const fs = require('fs');
const path = require('path');

// Sunucunun dinleyeceği port (Varsayılan 3000 veya çevre değişkeninden)
const PORT = process.env.PORT || 3000;

// Dosya uzantılarına göre MIME tipleri eşlemesi
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    // İstek yapılan URL
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    // Güvenlik: Dizin dışına sızmayı engellemek için path.normalize kullanıyoruz
    let safeUrl = req.url.split('?')[0]; // Query parametrelerini temizle
    if (safeUrl === '/') {
        safeUrl = '/index.html';
    }

    const filePath = path.join(__dirname, safeUrl);
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Dosyayı oku ve istemciye gönder
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Dosya bulunamadıysa 404 döndür
                fs.readFile(path.join(__dirname, '404.html'), (err404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                    if (!err404) {
                        res.end(content404, 'utf-8');
                    } else {
                        res.end('<h1>404 - Sayfa Bulunamadı</h1><p>Aradığınız dosya bu sunucuda mevcut değil.</p>', 'utf-8');
                    }
                });
            } else {
                // Diğer sunucu hataları (örneğin izin hataları vb.) için 500 döndür
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`<h1>Sunucu Hatası</h1><p>Hata kodu: ${error.code}</p>`, 'utf-8');
            }
        } else {
            // Başarılı durum
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\n======================================================');
    console.log('🚶 YÜRÜYÜŞ & BİLİNÇ ALTI YEREL SUNUCUSU BAŞLATILDI');
    console.log('======================================================');
    console.log(`🌐 Sunucu adresi: \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`📂 Sunucu klasörü: ${__dirname}`);
    console.log('⌨️  Kapatmak için: \x1b[31mCtrl + C\x1b[0m tuşlarına basın');
    console.log('======================================================\n');
});
