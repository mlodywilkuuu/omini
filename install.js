const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Instalator: Wstrzykuje loader i tworzy folder HybridMod
function install() {
    console.log("=== HybridMod Installer v1.0 ===");
    
    // 1. Zlokalizuj Discorda
    const discordPath = path.join(process.env.LOCALAPPDATA, 'Discord');
    const versions = fs.readdirSync(discordPath).filter(f => f.startsWith('app-'));
    const latest = versions.sort().reverse()[0];
    const corePath = path.join(discordPath, latest, 'modules', 'discord_desktop_core-1', 'discord_desktop_core');
    
    // 2. Wstrzyknij Bootstrap
    const indexPath = path.join(corePath, 'index.js');
    const originalPath = path.join(corePath, 'index.original.js');
    
    if (!fs.existsSync(originalPath)) {
        fs.renameSync(indexPath, originalPath);
        fs.writeFileSync(indexPath, `require(require('path').join(process.env.APPDATA, 'HybridMod', 'bootstrap.js'));`);
    }

    // 3. Przygotuj folder roboczy
    const modRoot = path.join(process.env.APPDATA, 'HybridMod');
    if (!fs.existsSync(modRoot)) fs.mkdirSync(modRoot, { recursive: true });

    console.log("Instalacja zakończona. Restartuj Discorda.");
}

install();