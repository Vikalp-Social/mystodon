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
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {name} = useParams();
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxId, setMaxId] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate('/');
        }
        
        fetchData();
    }, []);

    async function fetchData(){
        try {
            setLoading(true);
            const response = await axios.post(`http://localhost:3000/api/v1/timelines/tag/${name}`, {
                token: currentUser.token,
                instance: currentUser.instance,
                max_id: maxId,
            });
            setStatuses([...statuses, ...response.data.data]);
            setMaxId(response.data.max_id);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

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
                    {loading && <div className='loader'></div>}
                    {!loading && <button className="load-button" onClick={fetchData}>Load More</button>}
                </div>
            </div>
        </>
    )
}

export default TagPage