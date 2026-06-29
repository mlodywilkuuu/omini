const fs = require('fs');
const path = require('path');
const https = require('https');

const MOD_ROOT = path.join(process.env.APPDATA, 'HybridMod');
const VERSION_URL = "https://raw.githubusercontent.com/TWOJ_USER/TWOJ_REPO/main/version.json";

// Automatyczne sprawdzanie wersji: v1.0 (major) / v1.5 (minor)
async function updateManager() {
    https.get(VERSION_URL, (res) => {
        let data = '';
        res.on('data', (c) => data += c);
        res.on('end', () => {
            const remote = JSON.parse(data);
            const local = fs.existsSync(path.join(MOD_ROOT, 'version.json')) ? JSON.parse(fs.readFileSync(path.join(MOD_ROOT, 'version.json'))) : { major: 0, minor: 0 };

            if (remote.major > local.major) {
                console.log("[Hybrid] Krytyczna aktualizacja - pobieram wszystko...");
                // Logika pobierania pełnej paczki
            } else if (remote.minor > local.minor) {
                console.log("[Hybrid] Aktualizacja wtyczek...");
                // Logika tylko dla pluginów
            }
        });
    });
}

// Ładowanie modów
const vencord = path.join(MOD_ROOT, 'vencord/dist/index.js');
if (fs.existsSync(vencord)) require(vencord);

// Czekaj na Discorda i załaduj BD
const interval = setInterval(() => {
    if (window && window.webpackChunkdiscord_app) {
        clearInterval(interval);
        const bd = path.join(MOD_ROOT, 'betterdiscord/index.js');
        if (fs.existsSync(bd)) require(bd);
    }
}, 500);

updateManager();
module.exports = require('./index.original.js');