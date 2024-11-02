import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ColorPicker } from 'react-iro'
import { UserContext } from '../context/UserContext'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/theme-switcher.css'
import Navbar from '../components/Navbar'
import ThemePicker, { setDarkMode, setLightMode, hexToRGB, rgbToHSL, hslToRgb, rgbToHex } from '../theme/ThemePicker'

// ThemeSwitchPage component is the main component that is rendered when the user wants to change the theme of the site.
function ThemeSwitchPage() {
	const { isLoggedIn } = useContext(UserContext);
	const [hue, setHue] = useLocalStorage("--hue")
	const [sat, setSat] = useLocalStorage("--saturation")
	const [light, setLight] = useLocalStorage("--lightness")
	const [hex, setHex] = useState("")
	const [r, setR] = useState("")
	const [g, setG] = useState("")
	const [b, setB] = useState("")
	const [color, setColor] = useState(`hsl(${hue} ${sat} ${light})`)
	const [selected, setSelected] = useState(1)
	let navigate = useNavigate();

	useEffect(() => {
		if(!isLoggedIn){
			navigate("/");
		}
		document.title = "Themes | Vikalp"
		const [r, g, b, hex] = hslToRgb(hue/360, sat/100, light/100)
		setR(r);
		setG(g);
		setB(b);
		setHex(hex);
	}, [hue, sat, light])

	function convertHSL(hue, sat, light){
		if(isValidHSL(hue, sat, light)){
			const [r, g, b, hex] = hslToRgb(hue/360, sat/100, light/100)
			setR(r);
			setG(g);
			setB(b);
			setHex(hex);
			document.documentElement.style.setProperty('--hue', hue);
			document.documentElement.style.setProperty('--saturation', sat);
			document.documentElement.style.setProperty('--lightness', light);
		} else {
			alert("Invalid HSL values")
		}
	}

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

	function isValidHSL(h, s, l) {
		return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
	}

	function handleConvert(){
		if(selected === 1){
			convertRGB(r, g, b);
		} else if(selected === 2){
			convertHSL(hue, sat, light);
		} else {
			convertHex(hex);
		}
		setColor(`hsl(${hue} ${sat} ${light})`);
		window.location.reload(false)
	}

  return (
    <div className='main'>
		<ThemePicker />
		<Navbar />
		<div className='theme'>
			<div>
				ThemeSwitcher
				<div class="dropdown t-drop">
					<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
						Theme
					</button>
					<ul class="dropdown-menu">
						<li><a class="dropdown-item" onClick={setLightMode}>Light</a></li>
						<li><a class="dropdown-item" onClick={setDarkMode}>Dark</a></li>
					</ul>
				</div>
			</div>
			

			<div className="color-container" >
				<ColorPicker setters={{
					onChangeColor: (color) => {
						setHue(color.hsl.h);
						setSat(color.hsl.s);
						setLight(color.hsl.l);
						document.documentElement.style.setProperty('--hue', color.hsl.h);
						document.documentElement.style.setProperty('--saturation', color.hsl.s);
						document.documentElement.style.setProperty('--lightness', color.hsl.l);
					},
				}} options={{color: color, width: 250, wheelLightness: false, wheelAngle: -90}}/>

				<div className='color-form'>
					<div className='button-group'>
						<div className={selected === 1 ? 'selected' : 'button-group-tab'} onClick={() => setSelected(1)}>RGB</div>
						<div className={selected === 2 ? 'selected' : 'button-group-tab'} onClick={() => setSelected(2)}>HSL</div>
						<div className={selected === 3 ? 'selected' : 'button-group-tab'} onClick={() => setSelected(3)}>Hex</div>
					</div>
					<div>
						{selected === 1 && <div className='color-inputs'>
							<label>
								R: <input type="number" value={r} onChange={(e) => setR(e.target.value)} min="0" max="255" maxLength={3} />
							</label>
							<label>
								G: <input type="number" value={g} onChange={(e) => setG(e.target.value)} min="0" max="255" maxLength={3} />
							</label>
							<label>
								B: <input type="number" value={b} onChange={(e) => setB(e.target.value)} min="0" max="255" maxLength={3} />
							</label>
						</div>}
						{selected === 2 && <div className='color-inputs'>
							<label>
								H: <input type="number" value={hue} onChange={(e) => setHue(e.target.value)} min="0" max="360" maxLength={3} />
							</label>
							<label>
								S: <input type="number" value={sat} onChange={(e) => setSat(e.target.value)} min="0" max="100" maxLength={3} />
							</label>
							<label>
								L: <input type="number" value={light} onChange={(e) => setLight(e.target.value)} min="0" max="100" maxLength={3} />
							</label>
						</div>}
						{selected === 3 && <div className='color-inputs'>
							<label>
								Hex: <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} maxLength={7} />
							</label>
						</div>}
					</div>
					<button className='my-button' onClick={handleConvert}>Convert</button>
				</div>
			</div>
		</div>
		
    </div>
    
  )
}

export default ThemeSwitchPage