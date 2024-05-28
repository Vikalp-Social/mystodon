import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Status from '../components/Status';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { UserContext } from '../context/UserContext';
import ThemeSwitcher from '../components/ThemeSwitcher';
import Headbar from '../components/Headbar';

function StatusPage(props) {
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const { id } = useParams();
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({
        id: "",
        reblog: {
            id: "",
            account: {
                id: "",
                username: "",
                acct: "",
                avatar: "",
            },
            content: "",
            media_attachments: [],
        },
        account: {
            id: "",
            username: "",
            acct: "",
            avatar: "",
        },
        content: "",
        media_attachments: [],
    });
    let navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }

        async function fetchData() {
            try {
                setLoading(true);
                const response = await axios.post(`http://localhost:3000/api/v1/statuses/${id}`, {
                    instance: currentUser.instance,
                    token: currentUser.token,
                });
                setStatus({...response.data.status});
                setReplies(response.data.replies);
                //console.log(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        //setTimeout(fetchData, 1000);
        fetchData();
    }, [id]);

    return (
        <div className='main'>
            <Navbar />
            <Sidebar />
            <ThemeSwitcher />
            <div className="feed container">
                <Headbar />
                <Status 
                    key={status.id}
                    instance={currentUser.instance}
                    reblogged={status.reblog ? true : false}
                    post={status.reblog? status.reblog : status}
                    postedBy={status.account}
                    isUserProfile={false}
                    mentions={status.reblog? status.reblog.mentions : status.mentions}
                />
                <h2>Replies</h2>
                {loading && <div className="loader"></div>}
                {replies.length ? replies.map(reply => {
                    return <Status
                        key={reply.id}
                        instance={currentUser.instance}
                        reblogged={reply.reblog ? true : false}
                        post={reply.reblog? reply.reblog : reply}
                        postedBy={reply.account}
                        isUserProfile={false}
                        reply={true}
                        mentions={reply.reblog? reply.reblog.mentions : reply.mentions}
                    />
                }) : <p>No replies yet</p>}
            </div>
        </div>
    );
}

export default StatusPage;