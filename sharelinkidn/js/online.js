const axios = require('axios');

// Fungsi untuk membaca file dari URL
async function loadFileFromUrl(url) {
    try {
        const response = await axios.get(url);
        return response.data.split('\n').map(line => line.trim()).filter(line => line);
    } catch (err) {
        console.error(`Tidak dapat mengunduh file dari ${url}: ${err.message}`);
        return [];
    }
}

// Fungsi untuk melakukan permintaan HTTP
async function fetchUrl(url, headers, referers) {
    try {
        const randomReferer = referers[Math.floor(Math.random() * referers.length)];
        headers['Referer'] = randomReferer;

        const response = await axios.get(url, { headers, timeout: 10000 });

        console.log(`Request ke ${url} berhasil dengan Referer: ${randomReferer}`);
        console.log(`Status Code: ${response.status}`);
        return response.status;
    } catch (error) {
        console.error(`Error saat mengakses ${url}: ${error.message}`);
        return null;
    }
}

// Fungsi utama
(async () => {
    // URL file remote untuk mengambil data
    const urlFile = 'https://raw.githubusercontent.com/pajadadev/traffic/refs/heads/main/sharelinkidn/js/url.txt';
    const referersFile = 'https://raw.githubusercontent.com/pajadadev/traffic/refs/heads/main/sharelinkidn/js/referers.txt';
    const userAgentFile = 'https://raw.githubusercontent.com/pajadadev/traffic/refs/heads/main/sharelinkidn/js/user-agent.txt';

    // Memuat file remote
    const urls = await loadFileFromUrl(urlFile);
    const referers = await loadFileFromUrl(referersFile);
    const userAgents = await loadFileFromUrl(userAgentFile);

    // Cek apakah file yang diperlukan kosong
    if (urls.length === 0) {
        console.error("Daftar URL kosong. Pastikan file url.txt tidak kosong.");
        process.exit(1);
    }

    if (referers.length === 0) {
        console.error("Daftar Referer kosong. Pastikan file referers.txt tidak kosong.");
        process.exit(1);
    }

    if (userAgents.length === 0) {
        console.error("Daftar User-Agent kosong. Pastikan file user-agent.txt tidak kosong.");
        process.exit(1);
    }

    const maxIterations = 1500; // Batas jumlah iterasi
    let iteration = 1;

    while (iteration <= maxIterations) {
        console.log(`Iterasi ke-${iteration}`);

        // Pilih User-Agent secara acak untuk setiap iterasi
        const chosenUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        const headersTemplate = { 'User-Agent': chosenUserAgent };
        console.log(`User-Agent yang digunakan: ${headersTemplate['User-Agent']}`);

        for (const url of urls) {
            await fetchUrl(url, headersTemplate, referers);

            const delay = Math.random() * (15 - 5) + 5; // Waktu tunggu acak antara 5-15 detik
            console.log(`Menunggu ${delay.toFixed(2)} detik sebelum permintaan berikutnya...`);
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }

        iteration++;
    }

    console.log("Selesai. Semua iterasi telah dijalankan.");
})();
