const fs = require('fs');
const vm = require('vm');

function checkFile(file) {
    console.log('--- Checking ' + file + ' ---');
    try {
        const html = fs.readFileSync(file, 'utf8');
        const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
        scripts.forEach((m, idx) => {
            try {
                new vm.Script(m[1]);
                console.log('Script ' + idx + ' is VALID');
            } catch (e) {
                console.error('Script ' + idx + ' is INVALID: ', e.message);
                console.log(m[1].split('\n').map((l,i) => (i+1) + ': ' + l).join('\n'));
            }
        });
    } catch(e) {
        console.error('Read error', e);
    }
}

checkFile('admin.html');
checkFile('events.html');
console.log('Done');
