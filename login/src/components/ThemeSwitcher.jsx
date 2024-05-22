import React, { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import '../styles/theme-switcher.css'

function ThemeSwitcher() {
	const selectedTheme = localStorage.getItem("selectedTheme")
	const [color, setColor] = useLocalStorage("--hue", 204)

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

  return (
    <>
		<div className='theme'>
			ThemeSwitcher
			{/* <button className='btn btn-primary' onClick={setLightMode}>Light</button>
			<button className='btn btn-secondary' onClick={setDarkMode}>Dark</button> */}
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
				<input className='color-picker' type="range" min="0" max="360" value={color} onChange={(e) => setColor(e.target.value)}/>
			</div>
		</div>
    </>
    
  )
}

export default ThemeSwitcher