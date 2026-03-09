import fs from 'fs';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('d:/Out_Project/medipark/src');
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // React Router links and URL paths
    content = content.replace(/"\/blogs"/g, '"/health-insight"');
    content = content.replace(/'\/blogs'/g, "'/health-insight'");
    content = content.replace(/to="\/blogs"/g, 'to="/health-insight"');
    content = content.replace(/to="\/blogs\//g, 'to="/health-insight/');
    content = content.replace(/path:\s*"blogs"/g, 'path: "health-insight"');
    content = content.replace(/path:\s*"blogs\/:id"/g, 'path: "health-insight/:id"');

    // UI strings
    content = content.replace(/>Blogs</g, '>Health Insight<');
    content = content.replace(/>Blog</g, '>Health Insight<');
    content = content.replace(/"Blogs"/g, '"Health Insight"'); // e.g. heading="Blogs"

    // Admin routes
    content = content.replace(/website\/blogs/g, 'website/health-insight');
    content = content.replace(/path:\s*"blog"/g, 'path: "health-insight"');
    content = content.replace(/path:\s*"blog\/new"/g, 'path: "health-insight/new"');
    content = content.replace(/path:\s*"blog\/edit\/:id"/g, 'path: "health-insight/edit/:id"');
    content = content.replace(/path:\s*"blog\/view\/:id"/g, 'path: "health-insight/view/:id"');
    content = content.replace(/\/admin\/blog/g, '/admin/health-insight');
    content = content.replace(/>Back to Blogs</g, '>Back to Health Insight<');

    // Sidebars/breadcrumbs
    content = content.replace(/currentPage="Blogs"/g, 'currentPage="Health Insight"');
    content = content.replace(/name:\s*"Blogs"/g, 'name: "Health Insight"');
    content = content.replace(/name:\s*'Blogs'/g, "name: 'Health Insight'");
    content = content.replace(/alt="Blogs Hero"/g, 'alt="Health Insight Hero"');

    // Inside Facilities
    content = content.replace(/>Blogs:</g, '>Health Insight:<');
    content = content.replace(/<FieldLabel>Blogs<\/FieldLabel>/g, '<FieldLabel>Health Insight</FieldLabel>');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log('Updated:', file);
    }
});
console.log('Total files changed:', changedFiles);
