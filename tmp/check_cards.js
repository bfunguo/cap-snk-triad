const fs = require('fs');

const file = fs.readFileSync('./src/data/cards.ts', 'utf8');

// We can extract POPULARITY_MAP, distributePower, and ALL_CARDS_RAW cleanly.
// Or even simpler: evaluate cards.ts by transforming it into a standalone file without image imports and types.
let code = file;
code = code.replace(/import\s+type\s+[^;]+;/g, '');
code = code.replace(/import\s+[^;]+from\s+['"][^'"]*images[^'"]*['"];/g, '');
code = code.replace(/imageUrl:\s*[^,\n}]+/g, 'imageUrl: ""');
code = code.replace(/:\s*Card\[\]/g, '');
code = code.replace(/:\s*Record<string,\s*number>/g, '');
code = code.replace(/:\s*Map<string,\s*Card>/g, '');
code = code.replace(/:\s*string/g, '');
code = code.replace(/:\s*number/g, '');
code = code.replace(/:\s*\{\s*top:\s*number[^}]+\}/g, '');
code = code.replace(/export\s+/g, '');

code += `
const targetNames = [
  "Alex",
  "Andy",
  "Charlie Nash",
  "Joe Higashi",
  "Kaede",
  "Kim Kaphwan",
  "Lee Rekka",
  "Leopold Goenitz",
  "Leona",
  "Ralf Jones",
  "Sagat",
  "Saisyu",
  "Sakura",
  "Urien"
];

for (const card of ALL_CARDS) {
  const matches = targetNames.some(t => card.name.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(card.name.toLowerCase()));
  if (matches) {
    const pwr = card.values.top + card.values.right + card.values.bottom + card.values.left;
    console.log(JSON.stringify({ id: card.id, name: card.name, values: card.values, totalPower: pwr }));
  }
}
`;

fs.writeFileSync('/tmp/eval_cards.js', code);
require('/tmp/eval_cards.js');
