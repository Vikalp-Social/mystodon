import React, {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ThemeSwitcher from '../components/ThemeSwitcher';
import SearchTag from '../components/SearchTag';
import Status from '../components/Status';
import { UserContext } from '../context/UserContext';

function TagPage() {
    const {currentUser} = useContext(UserContext);
    const {name} = useParams();
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        async function fetchData(){
            try {
                const response = await axios.post(`http://localhost:3000/api/v1/timelines/tag/${name}`, {
                    token: currentUser.token,
                    instance: currentUser.instance,
                });
                setStatuses(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <div className='main'>
                <Navbar />
                <Sidebar />
                <ThemeSwitcher />
                <div className='feed container'>
                    <SearchTag name={name}/>
                    {statuses.map((status) => {
                        return <Status 
                            key={status.id}
                            instance={currentUser.instance}
                            reblogged={status.reblog ? true : false}
                            post={status.reblog? status.reblog : status}
                            postedBy={status.account}
                            isUserProfile={false}
                        />
                    })}
                </div>
            </div>
        </>
    )
}

export default TagPage