import React, {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import APIClient from '../apis/APIClient';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchTag from '../components/SearchTag';
import Status from '../components/Status';
import { UserContext } from '../context/UserContext';
import { useErrors } from '../context/ErrorContext';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Headbar from '../components/Headbar';
import ThemePicker from '../theme/ThemePicker';

// TagPage component is the main component that is rendered when the user wnats to view the timeline of a tag.
function TagPage() {
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError, setToast} = useErrors();
    const {name} = useParams();
    const [statuses, setStatuses] = useState([]);
    const [buffer, setBuffer] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxId, setMaxId] = useState('');
    useBottomScrollListener(fetchData);
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate('/');
        }
        
        fetchData();
        document.title = `#${name} | Vikalp`;
    }, []);

    // function to fetch the timeline of the tag
    async function fetchData(){
        try {
            setLoading(true);
            const response = await APIClient.get(`/timelines/tag/${name}`, {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                    max_id: maxId,
                }
            });
            setStatuses([...statuses, ...response.data.data]);
            setLoading(false);
            const res2 = await APIClient.get(`/timelines/tag/${name}`, {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                    max_id: response.data.max_id,
                }
            });
            setBuffer(res2.data.data);
            setMaxId(response.data.max_id);
        } catch (error) {
            setError(error.response.data);
        }
    }

    async function extendTimeline() {
        if(buffer.length > 0){
            setLoading(true);
            if(statuses.includes(buffer[0])){
                setLoading(true)
                setTimeout(() => fetchData(), 2000);
            }
            else{
                setStatuses([...statuses, ...buffer]);
                setLoading(false);
                const res2 = await APIClient.get("/timelines/home", {params: {token: currentUser.token, instance: currentUser.instance, max_id: maxId}});
                setBuffer(res2.data.data);
                setMaxId(res2.data.max_id);
            }
            
        }
        else{
            fetchData();
        }
    }

    return (
        <>
            <div className='main'>
                <Navbar />
                <Sidebar />
                <ThemePicker />
                <div className='feed container'>
                    <Headbar />
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
                    {!loading && <button className="load-button" onClick={extendTimeline}>Load More</button>}
                </div>
            </div>
        </>
    )
}

export default TagPage