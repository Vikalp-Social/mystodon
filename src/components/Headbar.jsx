import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FaHouseChimney, FaArrowLeft } from "react-icons/fa6";
import '../styles/headbar.css';

// Headbar component is used to display the back button in the header
function Headbar() {
	let navigate = useNavigate();

	return (
		<>
			<div className='headbar'>
				{window.location.pathname === '/home' ? 
					<div><FaHouseChimney style={{marginBottom:8}}/> Home</div> 
				: 
					<div onClick={() => navigate(-1)}> 
						<div className='back'><FaArrowLeft/></div>Back
					</div>}
			</div>
		</>
	)
}

export default Headbar