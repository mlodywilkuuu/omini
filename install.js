const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const discordPath = path.join(process.env.LOCALAPPDATA, 'Discord');
const latest = fs.readdirSync(discordPath).filter(f => f.startsWith('app-')).sort().reverse()[0];
const core = path.join(discordPath, latest, 'modules', 'discord_desktop_core-1', 'discord_desktop_core');

fs.renameSync(path.join(core, 'index.js'), path.join(core, 'index.original.js'));
fs.writeFileSync(path.join(core, 'index.js'), `require(require('path').join(process.env.APPDATA, 'HybridMod', 'bootstrap.js'));`);

console.log("Zainstalowano! Teraz Discord przy starcie będzie pobierał pliki z GitHuba.");
