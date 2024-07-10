import React from 'react'
import '../styles/serverswitcher.css'
import useLocalStorage from '../hooks/useLocalStorage'

function ServerSwitcher() {
    const [server, setServer] = useLocalStorage("server", 1)
    const servers = {
        1: "Hot Ranking",
        2: "Sentiment Analysis",
    }

    function selectServer(id){
        setServer(+id)
        refreshPage()
    }

    function refreshPage(){
        window.location.reload(false)
    }

    return (
        <div className='switch'>
            <div class="dropdown">
				<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
					Select Server
				</button>
				<ul class="dropdown-menu">
                    {Object.keys(servers).map((key) => {
                            return <li><a class="dropdown-item" onClick={() => selectServer(key)}>{servers[key]}</a></li>
                        })
                    }
				</ul>
			</div>
            <div>Current Server: {servers[server]}</div>
        </div>
    )
}

export default ServerSwitcher