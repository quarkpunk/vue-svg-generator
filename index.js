const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
prefix = args.prefix || '';
if(typeof prefix === 'string'){
    if(prefix != '') console.log(`used name prefix '${prefix}' for components`);
}
else{ prefix = ''; console.log(`used bad name prefix, skiped`); }

const iconsDir = path.join(__dirname, 'icons');
const componentsDir = path.join(__dirname, 'components');

fs.readdir(iconsDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        if(path.extname(file) === '.svg') {
            const iconName = path.basename(file, '.svg');
            const iconPath = path.join(iconsDir, file);
            const componentName = `${prefix}${iconName}`;
            const componentPath = path.join(componentsDir, `${componentName}.vue`);
            const svgContent = fs.readFileSync(iconPath, 'utf8');


            const $ = cheerio.load(svgContent, { xmlMode: true });
            let strokeWidth = 1;

            $('path').each((i, el) => {
                if($(el).attr('stroke')) {
                    $(el).removeAttr('stroke');
                    $(el).attr(':stroke', 'color');
                }
                if($(el).attr('stroke-width')) {
                    strokeWidth = $(el).attr('stroke-width');
                    $(el).removeAttr('stroke-width');
                    $(el).attr(':stroke-width', 'stroke');
                }
                if($(el).attr('fill')) {
                    $(el).removeAttr('fill');
                    $(el).attr(':fill', 'color');
                }
            });
            $('rect').each((i, el) => {
                if($(el).attr('stroke')) {
                    $(el).removeAttr('stroke');
                    $(el).attr(':stroke', 'color');
                }
                if($(el).attr('fill')) {
                    $(el).removeAttr('fill');
                    $(el).attr(':fill', 'color');
                }
            });

            // Remove stroke and fill attributes from root svg element
            const rootSvg = $('svg').first();
            rootSvg.removeAttr('stroke');
            rootSvg.removeAttr('fill');

            // Remove all nested <svg> elements
            rootSvg.find('svg').remove();
            const fill = rootSvg.attr('fill') || 'none';
            const width = rootSvg.attr('width') || '32';
            const height = rootSvg.attr('height') || '32';
            const viewBox = rootSvg.attr('viewBox') || '0 0 32 32';
            const cleanedSvgContent = rootSvg.html().trim();

            // Final template
            const componentTemplate = 
`<template>
<svg :width="width" :height="height" :viewBox="viewBox" :fill="fill" :stroke="stroke" xmlns="http://www.w3.org/2000/svg">
${cleanedSvgContent}
</svg>
</template>

<script>
export default {
  name: '${componentName}',
  props: {
    stroke:  { type: Number, default: ${strokeWidth} },
    color:   { type: String, default: '#000' },
    fill:    { type: String, default: '${fill}' },
    width:   { type: Number, default: ${parseInt(width, 10)} },
    height:  { type: Number, default: ${parseInt(height, 10)} },
    viewBox: { type: String, default: '${viewBox}' }
  }
};
</script>`;

            fs.writeFileSync(componentPath, componentTemplate);
            console.log(`generated component: ${componentName}`);
        }
    });
});