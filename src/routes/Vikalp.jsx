import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import useLocalStorage from '../hooks/useLocalStorage'
import Navbar from '../components/Navbar'
import ThemePicker from '../theme/ThemePicker'
import '../styles/vikalp.css'

function Vikalp() {
    const {isLoggedIn} = useContext(UserContext)
    const [server, setServer] = useLocalStorage("server", 1)
    const [experience, setExperience] = useLocalStorage("experience", 1)
    const servers = {
        1: "Hot Ranking",
        2: "Sentiment Analysis",
    }
    const experiences = {
        1: "Classic"
    }
    let navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/")
        }
        document.title = "Vikalp";
    }, [isLoggedIn])


    function selectServer(id){
        setServer(+id);
        // navigate("/home")
        window.location.reload(false);
    }

    function selectExperience(id){
        setExperience(+id);
        // navigate("/home")
        window.location.reload(false);
    }

    return (
        <div className='main'>
            <Navbar />
            <ThemePicker />
            <div className='switch'>
                <div>
                    <h2>Algorithms</h2>
                    <div>Current Algorithm: {servers[server]}</div>
                    <div className='list'>
                        {Object.keys(servers).map((algo) => {
                                return <div className='custom-button' style={{backgroundColor: server == algo ? '' : '#6e6e6e'}} onClick={() => selectServer(algo)}>{servers[algo]}</div>
                            }
                        )}
                    </div>
                </div>
                <div>
                    <h2>Experiences</h2>
                    <div>Current Experience: {experiences[experience]}</div>
                    <div className='list'>
                        {Object.keys(experiences).map((exp) => {
                                return <div className='custom-button' style={{backgroundColor: experience == exp ? '' : '#6e6e6e'}} onClick={() => selectExperience(exp)}>{experiences[exp]}</div>
                            }
                        )}
                    </div>
                    
                </div>

            </div>
        </div>
        
    )
}

export default Vikalp