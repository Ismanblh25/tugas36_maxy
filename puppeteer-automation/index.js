const puppeteer = require('puppeteer');
const pool = require('./config');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    const query = 'Puppeteer automation tutorial'; // Kata kunci pencarian
    console.log(`Mencari: ${query}`);
    
    // Buka Google
    await page.goto('https://www.google.com');
    
    // Isi form pencarian
    await page.type('input[name="q"]', query);
    await page.keyboard.press('Enter');
    
    // Tunggu hasil pencarian
    await page.waitForSelector('h3');
    
    // Ambil hasil
    const results = await page.evaluate(() => {
        const items = [];
        const searchResults = document.querySelectorAll('h3');
        searchResults.forEach((result) => {
            const parent = result.closest('a');
            if (parent) {
                items.push({
                    title: result.innerText,
                    url: parent.href
                });
            }
        });
        return items;
    });

    console.log('Hasil pencarian:', results);

    // Simpan ke database
    const connection = await pool.getConnection();
    try {
        const insertQuery = 'INSERT INTO search_results (query, title, url) VALUES (?, ?, ?)';
        for (const result of results) {
            await connection.query(insertQuery, [query, result.title, result.url]);
        }
        console.log('Data berhasil disimpan ke database.');
    } catch (error) {
        console.error('Error menyimpan ke database:', error);
    } finally {
        connection.release();
    }

    // Tutup browser
    await browser.close();
})();
