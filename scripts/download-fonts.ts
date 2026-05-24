import fs from 'fs';
import path from 'path';
import https from 'https';

const FONTS_DIR = path.join(process.cwd(), 'public', 'fonts');

// Helper to download a file
function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          fs.unlinkSync(dest);
          downloadFile(redirectUrl, dest).then(resolve);
          return;
        }
      }

      if (response.statusCode !== 200) {
        console.error(`Failed to download ${url}: Status code ${response.statusCode}`);
        file.close();
        fs.unlinkSync(dest);
        resolve(false);
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${path.basename(dest)}`);
        resolve(true);
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${url}:`, err.message);
      file.close();
      fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

async function main() {
  if (!fs.existsSync(FONTS_DIR)) {
    fs.mkdirSync(FONTS_DIR, { recursive: true });
  }

  console.log('Starting fonts download...');

  // 1. Redaction Fonts (from orionp/redaction-webfont)
  const redactionFonts = [
    { name: 'Redaction-Regular.woff', url: 'https://cdn.jsdelivr.net/gh/orionp/redaction-webfont@master/fonts/Redaction-Regular.woff' },
    { name: 'Redaction-Bold.woff', url: 'https://cdn.jsdelivr.net/gh/orionp/redaction-webfont@master/fonts/Redaction-Bold.woff' },
    { name: 'Redaction-Italic.woff', url: 'https://cdn.jsdelivr.net/gh/orionp/redaction-webfont@master/fonts/Redaction-Italic.woff' },
    { name: 'Redaction100-Regular.woff', url: 'https://cdn.jsdelivr.net/gh/orionp/redaction-webfont@master/fonts/Redaction100-Regular.woff' },
    { name: 'Redaction100-Bold.woff', url: 'https://cdn.jsdelivr.net/gh/orionp/redaction-webfont@master/fonts/Redaction100-Bold.woff' },
    { name: 'Redaction100-Italic.woff', url: 'https://cdn.jsdelivr.net/gh/orionp/redaction-webfont@master/fonts/Redaction100-Italic.woff' },
    { name: 'Redaction50-Regular.woff', url: 'https://cdn.jsdelivr.net/gh/orionp/redaction-webfont@master/fonts/Redaction50-Regular.woff' },
    { name: 'Redaction50-Bold.woff', url: 'https://cdn.jsdelivr.net/gh/orionp/redaction-webfont@master/fonts/Redaction50-Bold.woff' }
  ];

  for (const font of redactionFonts) {
    const dest = path.join(FONTS_DIR, font.name);
    await downloadFile(font.url, dest);
  }

  // 2. Amiamie Fonts (from Velvetyne GitLab or mirrors)
  // Let's download Amiamie fonts. Velvetyne GitLab has them under:
  // https://gitlab.com/velvetyne/amiamie/-/raw/master/fonts/ttf/Amiamie-Regular.ttf
  // Let's try master and main raw endpoints.
  const amiamiesToDownload = [
    'Amiamie-Regular.ttf',
    'Amiamie-Light.ttf',
    'Amiamie-Black.ttf',
    'Amiamie-Italic.ttf'
  ];

  for (const fontName of amiamiesToDownload) {
    const dest = path.join(FONTS_DIR, fontName);
    
    // Attempt gitlab raw url
    let success = await downloadFile(`https://gitlab.com/velvetyne/amiamie/-/raw/master/fonts/ttf/${fontName}`, dest);
    
    if (!success) {
      console.log(`Failed with master branch, trying main branch...`);
      success = await downloadFile(`https://gitlab.com/velvetyne/amiamie/-/raw/main/fonts/ttf/${fontName}`, dest);
    }
    
    if (!success) {
       // Try otf folder as backup or raw master otf
       console.log(`Trying OTF master folder...`);
       const otfName = fontName.replace('.ttf', '.otf');
       const destOtf = path.join(FONTS_DIR, otfName);
       success = await downloadFile(`https://gitlab.com/velvetyne/amiamie/-/raw/master/fonts/otf/${otfName}`, destOtf);
    }

    if (!success) {
      // Fallback: try genderfluid.space CDN path we saw in search
      console.log(`Trying backup genderfluid.space CDN...`);
      await downloadFile(`https://genderfluid.space/fonts/amiamie/${fontName}`, dest);
    }
  }

  console.log('Fonts download process finished!');
}

main().catch(console.error);
