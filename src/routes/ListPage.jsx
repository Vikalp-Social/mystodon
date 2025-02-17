import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import ThemePicker from '../theme/ThemePicker'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Headbar from '../components/Headbar'
import APIClient from '../apis/APIClient';
import { UserContext } from '../context/UserContext';
import { useErrors } from '../context/ErrorContext';
import ListAccount from '../components/ListAccount';

function ListPage() {
    const {currentUser} = useContext(UserContext);
    const {setError} = useErrors();
    const {type, id} = useParams()
    const [list, setList] = useState({});
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if(type == "public"){
            fetchPublicList();
        }
        else if(type == "private"){
            fetchList();
        }
    }, [])

    async function fetchPublicList(){
        try{
            setLoading(true);
            const response = await axios.get(`https://auth.srg.social/api/v1/lists/public/${id}`);
            console.log(response.data);
            setList(response.data);
            setMembers(response.data.account_ids || []);
            setLoading(false);
        }
        catch (error) {
            setError(error.response.data)
        }
    }

    async function fetchList(){
        try{
            setLoading(true);
            const response = await APIClient.get(`/lists/${id}`, {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                }
            });
            console.log(response.data);
            setList(response.data);
            const res2 = await APIClient.get(`/lists/${id}/accounts`, {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                }
            });
            console.log(res2.data);
            setMembers(res2.data);
            setLoading(false);
        }
        catch (error) {
            setError(error.response.data)
        }
    }

    async function followList(){
        //creates a private list with the same members
        const response = await APIClient.post("/lists", {
            title: list.title,
        },
        {params: {
                token: currentUser.token,
                instance: currentUser.instance,
                user: currentUser.name || currentUser.username,
            }
        });

        const member_ids = members.map(member => member.id);
        //add all members of this this to the newly created one
        const res2 = await APIClient.post(`/lists/${response.data.id}/accounts`, {
            account_ids: member_ids,
        }, {
            params: {
                token: currentUser.token,
                instance: currentUser.instance,
            }
        });
        return;
    }

    return (
        <>
            <div className="main">
                <ThemePicker />
                <Navbar />
                <Sidebar />
                <div className="feed container">
                    <Headbar />
                    
                    <div className='bg-div'>
                        <div className='edit-list-header'>
                            <h1>{list.title}</h1>
                            <button className="my-button" onClick={followList}>Follow</button>
                        </div>
                        <h3>Members</h3>
                        {members.length > 0 && members.map((account) => {
                            return <ListAccount 
                                    key={account.id}
                                    user_id={account.id}
                                    prof={account.avatar}
                                    username={account.display_name}
                                    fullname={account.username === account.acct ? `${account.username}@${currentUser.instance}` : account.acct}
                                    emojis={account.emojis}
                                    viewOnly={true}
                            />
                        })}
                    </div>

                    {loading && <div className="loader"></div>}
                    {/* {!loading && <button className="load-button" onClick={extendListTimeline}>Load More</button>} */}
                    
                </div>
            </div>
        </>
    )
}

export default ListPage