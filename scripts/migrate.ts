import fs from 'fs';
import { resolve } from 'path';

// read universe registry file
const registryPath = resolve(process.cwd(), 'src/data/universeRegistry.ts');
const content = fs.readFileSync(registryPath, 'utf-8');

// Quick and dirty regex extraction instead of full TS parse
const universes = [
  'harrypotter', 'lotr', 'got', 'witcher', 'starwars',
  'mcu', 'dcu', 'matrix', 'dune', 'cyberpunk',
  'eldenring', 'assassinscreed', 'warcraft', 'fnaf'
];

let enData = '';
let svData = '';

for (const uni of universes) {
    const uniIndex = content.indexOf(`\n    ${uni}: {`);
    if (uniIndex === -1) continue;
    
    // extract chunk between this uni and the next
    const nextUniIndex = content.indexOf(`\n    ${universes[universes.indexOf(uni)+1] || 'ZZZZZ'}: {`);
    const chunk = content.slice(uniIndex, nextUniIndex !== -1 ? nextUniIndex : content.length);

    const titleMatch = chunk.match(/title:\s*'([^']*)'/);
    const subtitleMatch = chunk.match(/subtitle:\s*'([^']*)'/);
    const taglineMatch = chunk.match(/tagline:\s*'([^']*)'/);
    const descMatch = chunk.match(/description:\s*'([^']*)'/);
    const teaserMatch = chunk.match(/teaser:\s*'([^']*)'/);

    if(titleMatch) enData += `    'universeData.${uni}.title': '${titleMatch[1].replace(/'/g, "\\'")}',\n`;
    if(subtitleMatch) enData += `    'universeData.${uni}.subtitle': '${subtitleMatch[1].replace(/'/g, "\\'")}',\n`;
    if(taglineMatch) enData += `    'universeData.${uni}.tagline': '${taglineMatch[1].replace(/'/g, "\\'")}',\n`;
    if(descMatch) enData += `    'universeData.${uni}.description': '${descMatch[1].replace(/'/g, "\\'")}',\n`;
    if(teaserMatch) enData += `    'universeData.${uni}.teaser': '${teaserMatch[1].replace(/'/g, "\\'")}',\n`;
}

console.log("EN DATA:\n" + enData);
