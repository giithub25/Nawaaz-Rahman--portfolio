const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Main function
function generateContentData() {
    const data = {
        certificates: [],
        portfolio: {
            'prompt-engineering': [],
            'content-writing': [],
            'image-generation': [],
            'video-generation': [],
            'ai-automations': []
        }
    };

    // Process certificates
    const certsPath = path.join(process.cwd(), 'content/certificates');
    if (fs.existsSync(certsPath)) {
        const certFiles = fs.readdirSync(certsPath).filter(f => f.endsWith('.md'));
        certFiles.forEach(file => {
            const content = fs.readFileSync(path.join(certsPath, file), 'utf8');
            const { data: frontmatter } = matter(content);
            data.certificates.push({
                title: frontmatter.title || '',
                file: frontmatter.file || '',
                caption: frontmatter.caption || '',
                order: frontmatter.order || 0
            });
        });
        // Sort by order
        data.certificates.sort((a, b) => a.order - b.order);
    }

    // Process portfolio folders
    const portfolioPath = path.join(process.cwd(), 'content/portfolio');
    if (fs.existsSync(portfolioPath)) {
        Object.keys(data.portfolio).forEach(folder => {
            const folderPath = path.join(portfolioPath, folder);
            if (fs.existsSync(folderPath)) {
                const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.md'));
                files.forEach(file => {
                    const content = fs.readFileSync(path.join(folderPath, file), 'utf8');
                    const { data: frontmatter } = matter(content);
                    data.portfolio[folder].push({
                        title: frontmatter.title || '',
                        file: frontmatter.file || '',
                        caption: frontmatter.caption || '',
                        order: frontmatter.order || 0
                    });
                });
                // Sort by order
                data.portfolio[folder].sort((a, b) => a.order - b.order);
            }
        });
    }

    // Write JSON file
    fs.writeFileSync(
        path.join(process.cwd(), 'content-data.json'),
        JSON.stringify(data, null, 2)
    );
    
    console.log('✅ Content data generated successfully!');
}

// Run
generateContentData();
