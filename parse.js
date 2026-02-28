import fs from 'fs';
const data = JSON.parse(fs.readFileSync('dump.json', 'utf8'));
for (const p of data) {
    let json = JSON.stringify(p);
    const regex = /\"([a-zA-Z0-9_]+)\":\"(202[4-6]-[0-9]{2}-[0-9]{2}[^\"]*)\"/g;
    let match;
    let found = false;
    while ((match = regex.exec(json)) !== null) {
        if (!['createTime', 'updateTime', 'listedOn'].includes(match[1]) && !match[1].toLowerCase().includes('logo') && !match[1].toLowerCase().includes('qrcode')) {
            console.log('ID', p.id, '->', match[1], ':', match[2]);
            found = true;
        }
    }
}
