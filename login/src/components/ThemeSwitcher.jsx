import React, { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/theme-switcher.css'

function ThemeSwitcher() {
	const selectedTheme = localStorage.getItem("selectedTheme")
	const [color, setColor] = useLocalStorage("--hue", 204)
	const [hex, setHex] = useState("")
	const [r, setR] = useState("")
	const [g, setG] = useState("")
	const [b, setB] = useState("")

	useEffect(() => {
		document.documentElement.style.setProperty('--hue', color);
	}, [color])

	function setDarkMode() {
		document.querySelector("body").setAttribute("color-scheme", "dark")
		localStorage.setItem("selectedTheme", "dark");
	}

	function setLightMode() {
		document.querySelector("body").setAttribute("color-scheme", "light")
		localStorage.setItem("selectedTheme", "light");
	}

	if(selectedTheme === "dark") {
		setDarkMode();
	} else if(selectedTheme === "light") {
		setLightMode();
	}

	function rgbToHSL(r, g, b) {
		r /= 255;
		g /= 255; 
		b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
		if(max == min){
			h = s = 0; // achromatic
		}else{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		document.documentElement.style.setProperty('--hue', Math.round(h * 360));
	}
	
	function hexToRGB(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		const r = parseInt(result[1], 16);
		const g = parseInt(result[2], 16);
		const b = parseInt(result[3], 16);
		return rgbToHSL(r, g, b);
	}

  return (
    <>
		<div className='theme'>
			ThemeSwitcher
			<div class="dropdown">
				<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					Theme
				</button>
				<ul class="dropdown-menu">
					<li><a class="dropdown-item" onClick={setLightMode}>Light</a></li>
					<li><a class="dropdown-item" onClick={setDarkMode}>Dark</a></li>
				</ul>
			</div>
			<div>
				<label htmlFor='hexcode'>Hexcode: </label>
				<input id='hexcode' type='text' value={hex} onChange={(e) => setHex(e.target.value)} size={7} maxLength={7}/>
			</div>
			<form className='rgb-form'>
				<div className='col-3'>
					<label for='red'>R: <input id='red' className='form-control' type='text' value={r} onChange={(e) => setR(e.target.value)} size={3} maxLength={3} max={255} min={0}/></label>
				</div>
				<div className='col-3'>
					<label for='green'>G: <input id='green' className='form-control col-1' type='text' value={g} onChange={(e) => setG(e.target.value)} size={3} maxLength={3} max={255} min={0}/></label>
				</div>
				<div className='col-3'>
					<label for='blue'>B: <input id='blue' className='form-control' type='text' value={b} onChange={(e) => setB(e.target.value)} size={3} maxLength={3} max={255} min={0}/></label>
				</div>
			</form>
			<div>
				<input className='color-picker' type="range" min="0" max="360" value={color} onChange={(e) => setColor(e.target.value)}/>
			</div>
			<button className='my-button' onClick={() => hexToRGB(hex)}>Convert</button>
		</div>
    </>
    
  )
}

export default ThemeSwitcher