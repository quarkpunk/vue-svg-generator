const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const iconsDir = path.join(__dirname, 'icons');
const componentsDir = path.join(__dirname, 'components');

fs.readdir(iconsDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
    if (path.extname(file) === '.svg') {
        const iconName = path.basename(file, '.svg');
        const iconPath = path.join(iconsDir, file);
        const componentPath = path.join(componentsDir, `${iconName}.vue`);
        const svgContent = fs.readFileSync(iconPath, 'utf8');

        // Uploading the SVG code to cheerio
        const $ = cheerio.load(svgContent, { xmlMode: true });

        // Remove stroke and fill attributes from all path elements
        $('path').each((i, el) => {
          $(el).removeAttr('stroke');
          $(el).removeAttr('fill');
        });

        // Remove stroke and fill attributes from root svg element
        const rootSvg = $('svg').first();
        rootSvg.removeAttr('stroke');
        rootSvg.removeAttr('fill');

        // Remove all nested <svg> elements
        rootSvg.find('svg').remove();
        const width = rootSvg.attr('width') || '32';
        const height = rootSvg.attr('height') || '32';
        const viewBox = rootSvg.attr('viewBox') || '0 0 32 32';
        const cleanedSvgContent = rootSvg.html();

        const componentTemplate = `
<template>
  <svg :width="width" :height="height" :viewBox="viewBox" :fill="fill" :stroke="stroke" xmlns="http://www.w3.org/2000/svg">
    ${cleanedSvgContent}
  </svg>
</template>

<script>
export default {
  name: '${iconName}',
  props: {
    fill: { type: String, default: '#000' },
    stroke: { type: String, default: '#000' },
    width: { type: Number, default: ${parseInt(width, 10)} },
    height: { type: Number, default: ${parseInt(height, 10)} },
    viewBox: { type: String, default: '${viewBox}' }
  }
};
</script>
`;

        fs.writeFileSync(componentPath, componentTemplate);
        console.log(`Generated component for ${iconName}`);
    }
});});