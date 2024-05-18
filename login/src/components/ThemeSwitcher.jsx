import React, { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

function ThemeSwitcher() {
	const selectedTheme = localStorage.getItem("selectedTheme")
	const [color, setColor] = useState(204)

	useEffect(() => {
		document.documentElement.style.setProperty('--hue', color);
	}, [color])

	function setDarkMode() {
		document.querySelector("body").setAttribute("data-theme", "dark")
		localStorage.setItem("selectedTheme", "dark");
	}

	function setLightMode() {
		document.querySelector("body").setAttribute("data-theme", "light")
		localStorage.setItem("selectedTheme", "light");
	}

	if(selectedTheme === "dark") {
		setDarkMode();
	}

  return (
    <>
		<div className='theme sidebar'>
			ThemeSwitcher
			<button className='btn btn-tertiary' onClick={setLightMode}>Light</button>
			<button className='btn btn-secondary' onClick={setDarkMode}>Dark</button>
			<div>
				<input type="range" min="0" max="360" value={color} onChange={(e) => setColor(e.target.value)}/>
			</div>
		</div>
    </>
    
  )
}

export default ThemeSwitcher