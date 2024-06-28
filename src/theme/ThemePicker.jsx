/* ThemePicker handles all color conversions and storing them into local storage for persistence of the theme */
import { useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/theme-switcher.css'

const selectedTheme = localStorage.getItem("selectedTheme")
export function setDarkMode() {
		document.querySelector("body").setAttribute("color-scheme", "dark")
		localStorage.setItem("selectedTheme", "dark");
	}

export function setLightMode() {
	document.querySelector("body").setAttribute("color-scheme", "light")
	localStorage.setItem("selectedTheme", "light");
}

if(selectedTheme === "dark") {
	setDarkMode();
} else if(selectedTheme === "light") {
	setLightMode();
}

export function hexToRGB(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	const r = parseInt(result[1], 16);
	const g = parseInt(result[2], 16);
	const b = parseInt(result[3], 16);
	return [r, g, b, rgbToHSL(r, g, b)];
}

export function rgbToHSL(r, g, b) {
	r /= 255; 
	g /= 255; 
	b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max === min){
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

	h = Math.round(h*360);
    s = Math.round(s*100);
    l = Math.round(l*100);

	document.documentElement.style.setProperty('--hue', h)
	document.documentElement.style.setProperty('--saturation', s)
	document.documentElement.style.setProperty('--lightness', l)

	return [h, s, l];
}

export function rgbToHex(r, g, b) {
	r = parseInt(r).toString(16);
	g = parseInt(g).toString(16);
	b = parseInt(b).toString(16);
	
	if (r.length === 1)
		r = "0" + r;
	if (g.length === 1)
		g = "0" + g;
	if (b.length === 1)
		b = "0" + b;
	
	return "#" + r + g + b;
}

export function hslToRgb(h, s, l) {
	let r, g, b;
	
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hueToRgb(p, q, h + 1.0/3.0);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1.0/3.0);
	}
	r = Math.round(r * 255)
	g = Math.round(g * 255)
	b = Math.round(b * 255)
	
	return [r, g, b, rgbToHex(r, g, b)];
}
	
function hueToRgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1/6) return p + (q - p) * 6 * t;
	if (t < 1/2) return q;
	if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	return p;
}

function ThemePicker() {
	const [hue] = useLocalStorage("--hue", 204)
	const [sat] = useLocalStorage("--saturation", 66.8)
	const [light] = useLocalStorage("--lightness", 57.5)

	useEffect(() => {
		document.documentElement.style.setProperty('--hue', hue);
		document.documentElement.style.setProperty('--saturation', sat);
		document.documentElement.style.setProperty('--lightness', light);
	}, [hue, sat, light])

}

export default ThemePicker