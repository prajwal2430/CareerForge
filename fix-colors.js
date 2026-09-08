const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Replace backgrounds
            content = content.replace(/bg-white dark:bg-slate-900/g, 'bg-card border-none');
            content = content.replace(/dark:bg-slate-950/g, ''); // Handled globally by AppLayout bg-background
            content = content.replace(/bg-\[#F8FAFC\]/g, 'bg-background');
            
            // Replace text
            content = content.replace(/text-slate-900 dark:text-white/g, 'text-text-main');
            content = content.replace(/text-slate-700 dark:text-slate-200/g, 'text-text-main');
            content = content.replace(/text-slate-500/g, 'text-text-muted');
            content = content.replace(/text-gray-400 dark:text-slate-500/g, 'text-text-muted');
            content = content.replace(/text-gray-500 dark:text-slate-400/g, 'text-text-muted');
            
            // Replace borders
            content = content.replace(/border-gray-100 dark:border-slate-800/g, 'border-border');
            content = content.replace(/border-gray-200 dark:border-slate-700/g, 'border-border');
            
            if (original !== content) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

replaceInFiles('d:/CareerForge/client/src');
