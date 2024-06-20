import React, { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/theme-switcher.css'
import Navbar from '../components/Navbar'
import ThemePicker, { setDarkMode, setLightMode, hexToRGB, rgbToHSL, hslToRgb, rgbToHex } from '../theme/ThemePicker'

function ThemeSwitchPage() {
	const [hue, setHue] = useLocalStorage("--hue")
	const [sat, setSat] = useLocalStorage("--saturation")
	const [light, setLight] = useLocalStorage("--lightness")
	const [hex, setHex] = useState("")
	const [r, setR] = useState("")
	const [g, setG] = useState("")
	const [b, setB] = useState("")

	useEffect(() => {
		document.title = "Themes | Vikalp"
	}, [])

	useEffect(() => {
		document.documentElement.style.setProperty('--hue', hue);
		document.documentElement.style.setProperty('--saturation', sat);
		document.documentElement.style.setProperty('--lightness', light);
	}, [hue, sat, light])

	useEffect(() => {
		const [r, g, b, hex] = hslToRgb(hue/360, sat/100, light/100)
		setR(r);
		setG(g);
		setB(b);
		setHex(hex);
	}, [hue])

	function convertHex(hex){
		if(isValidHex(hex)){
			const [r, g, b, hsl] = hexToRGB(hex);
			setR(r);
			setG(g);
			setB(b);
			setHue(hsl[0]);
			setSat(hsl[1]);
			setLight(hsl[2]);
		} else {
			alert("Invalid Hexcode")
		}
		
	}

	function convertRGB(r, g, b){
		if(isValidRGB(r, g, b)){
			const hsl = rgbToHSL(r, g, b);
			const hex = rgbToHex(r, g, b);
			setHex(hex);
			setHue(hsl[0]);
			setSat(hsl[1]);
			setLight(hsl[2]);
		} else {
			alert("Invalid RGB values")
		}
	}

	function isValidHex(value) {
		const hexRegex = /^#([A-Fa-f0-9]{6})$/;
		return hexRegex.test(value);
	}

	function isValidRGB(r, g, b) {
		const rgbComponentRegex = /^([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/;
    	return rgbComponentRegex.test(r) && rgbComponentRegex.test(g) && rgbComponentRegex.test(b);
	}

	const handleRChange = (e) => setR(e.target.value);
	const handleGChange = (e) => setG(e.target.value);
	const handleBChange = (e) => setB(e.target.value);
	const handleHexChange = (e) => setHex(e.target.value);

  return (
    <div className='main'>
		<ThemePicker />
		<Navbar />
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
			{/* <div className='col'>
				<label htmlFor='hexcode'>Hexcode: <input className="form-control" id='hexcode' type='text' value={hex} onChange={(e) => setHex(e.target.value)} size={7} maxLength={7}/></label>
				
			</div>
			<form className='rgb-form'>
				<div className='col'>
					<label for='red'>R: <input id='red' className='form-control' type='number' value={r} onChange={(e) => setR(e.target.value)} size={3} maxLength={3} max={255} min={0}/></label>
				</div>
				<div className='col'>
					<label for='green'>G: <input id='green' className='form-control' type='number' value={g} onChange={(e) => setG(e.target.value)} size={3} maxLength={3} max={255} min={0}/></label>
				</div>
				<div className='col'>
					<label for='blue'>B: <input id='blue' className='form-control' type='number' value={b} onChange={(e) => setB(e.target.value)} size={3} maxLength={3} max={255} min={0}/></label>
				</div>
			</form>
			 */}

			<div className="color-container">
            <form className="color-form">
                <div className="rgb-inputs">
                    <label>
                        R: <input type="number" value={r} onChange={handleRChange} min="0" max="255" maxLength={3} />
                    </label>
                    <label>
                        G: <input type="number" value={g} onChange={handleGChange} min="0" max="255" maxLength={3} />
                    </label>
                    <label>
                        B: <input type="number" value={b} onChange={handleBChange} min="0" max="255" maxLength={3} />
                    </label>
                </div>
                <label className="hex-input">
                    Hex: <input type="text" value={hex} onChange={handleHexChange} maxLength={7} />
                </label>
            </form>
        </div>
		<div>
				<input className='color-picker' type="range" min="0" max="360" value={hue} onChange={(e) => setHue(e.target.value)}/>
			</div>

			<button className='my-button' onClick={() => convertHex(hex)}>Convert using Hexcode</button>
			<button className='my-button' onClick={() => convertRGB(r, g, b)}>Convert using RGB</button>
		</div>
    </div>
    
  )
}

export default ThemeSwitchPage