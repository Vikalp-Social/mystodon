import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import APIClient from '../apis/APIClient';
import Status from '../components/Status';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { UserContext } from '../context/UserContext';
import { useErrors } from '../context/ErrorContext';
import Headbar from '../components/Headbar';
import ThemePicker from '../theme/ThemePicker';

// StatusPage component is the main component that is rendered when the user visits a status/post.
function StatusPage() {
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {setError} = useErrors();
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
        // function to fetch the status/post details along with its replies
        async function fetchData() {
            try {
                setLoading(true);
                const response = await APIClient.get(`/statuses/${id}`, {
                    params: {
                        instance: currentUser.instance,
                        token: currentUser.token,
                    }
                });
                setStatus({...response.data.status});
                setReplies(response.data.replies);
                setLoading(false);
            } catch (error) {
                setError(error.response.data);;;
            }
        }
        //setTimeout(fetchData, 1000);
        fetchData();
        document.title = "Post Details | Vikalp";
    }, [id]);

    return (
        <div className='main'>
            <Navbar />
            <Sidebar />
            <ThemePicker />
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
                {replies.length ? replies.map((reply, index) => {
                    return <Status
                        key={reply.id}
                        instance={currentUser.instance}
                        reblogged={reply.reblog ? true : false}
                        post={reply.reblog? reply.reblog : reply}
                        postedBy={reply.account}
                        isUserProfile={false}
                        reply={true}
                        thread={index < replies.length-1 && reply.id === replies[index+1].in_reply_to_id ? true : false}
                        mentions={reply.reblog? reply.reblog.mentions : reply.mentions}
                    />
                }) : <p>No replies yet</p>}
            </div>
        </div>
    );
}

export default StatusPage;