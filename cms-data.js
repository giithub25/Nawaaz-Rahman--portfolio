// Fetch and display CMS data
async function loadCMSData() {
  try {
    // Load certificates
    const certResponse = await fetch('/content/certificates.json');
    if (certResponse.ok) {
      const certs = await certResponse.json();
      displayCertificates(certs);
    }
    
    // Load portfolio items
    const portfolioFolders = ['prompt-engineering', 'content-writing', 'image-generation', 'video-generation', 'ai-automations'];
    for (const folder of portfolioFolders) {
      const response = await fetch(`/content/portfolio/${folder}.json`);
      if (response.ok) {
        const items = await response.json();
        displayPortfolio(folder, items);
      }
    }
  } catch (error) {
    console.error('Error loading CMS data:', error);
  }
}

function displayCertificates(certs) {
  const container = document.getElementById('certificates-grid');
  if (!container || !certs.length) return;
  
  container.innerHTML = certs.map(cert => `
    <div class="certificate-item" onclick="openLightbox('${cert.file}', '${cert.title}', '${cert.caption || ''}')">
      <img src="${cert.file}" alt="${cert.title}" loading="lazy">
      <p>${cert.title}</p>
    </div>
  `).join('');
}

function displayPortfolio(folder, items) {
  const container = document.getElementById(`portfolio-${folder}`);
  if (!container || !items.length) return;
  
  container.innerHTML = items.map(item => `
    <div class="portfolio-item" onclick="openLightbox('${item.file}', '${item.title}', '${item.caption || ''}')">
      <img src="${item.file}" alt="${item.title}" loading="lazy">
      <p>${item.title}</p>
    </div>
  `).join('');
}

function openLightbox(file, title, caption) {
  // Your existing lightbox code will handle this
  console.log('Opening:', file, title, caption);
}

// Load data when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCMSData);
} else {
  loadCMSData();
}
