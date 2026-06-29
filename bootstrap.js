const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const MOD_ROOT = path.join(process.env.APPDATA, 'HybridMod');
const VERSION_FILE = path.join(MOD_ROOT, 'version.json');
const ZIP_URL = "https://github.com/mlodywilkuuu/omini/raw/main/build.zip";
const VERSION_URL = "https://raw.githubusercontent.com/mlodywilkuuu/omini/main/version.json";

async function boot() {
    if (!fs.existsSync(MOD_ROOT)) fs.mkdirSync(MOD_ROOT, { recursive: true });

    // Sprawdź update
    https.get(VERSION_URL, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
            const remote = JSON.parse(body);
            const local = fs.existsSync(VERSION_FILE) ? JSON.parse(fs.readFileSync(VERSION_FILE)) : { version: "0.0" };
            if (remote.version !== local.version) {
                console.log("[Hybrid] Pobieranie aktualizacji...");
                const file = fs.createWriteStream(path.join(MOD_ROOT, 'update.zip'));
                https.get(ZIP_URL, (r) => {
                    r.pipe(file);
                    file.on('finish', () => {
                        execSync(`powershell -Command "Expand-Archive -Path '${path.join(MOD_ROOT, 'update.zip')}' -DestinationPath '${MOD_ROOT}' -Force"`);
                        fs.writeFileSync(VERSION_FILE, JSON.stringify(remote));
                        console.log("[Hybrid] Gotowe!");
                    });
                });
            }
        });
    });

    // Ładuj mody
    const v = path.join(MOD_ROOT, 'vencord/dist/index.js');
    if (fs.existsSync(v)) require(v);
}
boot();
module.exports = require('./index.original.js');
