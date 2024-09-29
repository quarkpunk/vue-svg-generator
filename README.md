# Vue svg icon component generator

This script automatically generates Vue components for SVG icons using the original width, height, and viewBox values ​​from the SVG files. The script also removes the stroke and fill attributes from the SVG code so that they can be customized via component props, used node 20.12 version

## Usage
1. Run ```npm install```
2. Create 'icons' folder and place your SVG files
3. Create 'components' folder
4. Run ```node index.js```
5. Copy the finished components into your Vue project folder

## Example

```js
<template>
    <IconName :width="32" :height="32" fill="white" />
</template>

<script>
import IconName from './components/IconName.vue';

export default {
    components: {
        IconName
    }
};
</script>
```

## Components props
```js
fill:     { type: String }
stroke:   { type: String }
width:    { type: Number }
height:   { type: Number }
viewBox:  { type: String }
```

### License
Do with it what you want, i don't care, i wrote it because i got tired of doing the same thing every time