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
    const servers = {
        1: "Hot Ranking",
        2: "Sentiment Analysis",
    }
    let navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/")
        }
    }, [isLoggedIn])


    function selectServer(id){
        setServer(+id);
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
                                return <div className='custom-button' style={{backgroundColor: server == algo ? '#85e085' : '#6e6e6e'}} onClick={() => selectServer(algo)}>{servers[algo]}</div>
                            }
                        )}
                    </div>
                </div>
                <div>
                    <h2>Experiences</h2>
                    <div>Current Experience: Classic</div>
                    <div className='list'>
                        <div className='custom-button' style={{backgroundColor:'#85e085'}}> Classic </div>
                    </div>
                    
                </div>

            </div>
        </div>
        
    )
}

export default Vikalp