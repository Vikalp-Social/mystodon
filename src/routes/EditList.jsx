import { useState, useEffect, useContext } from 'react'
import axios from "axios"
import { useParams, useNavigate } from 'react-router-dom'
import APIClient, { AuthClient } from '../apis/APIClient'
import { useErrors } from '../context/ErrorContext'
import { UserContext } from '../context/UserContext'
import ThemePicker from '../theme/ThemePicker'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Headbar from '../components/Headbar'
import ListAccount from '../components/ListAccount'
import '../index.css'
import '../styles/lists.css'

function EditList() {
    // const {currentUser} = useContext(UserContext);
    // const {setError} = useErrors();
    const {fullid} = useParams();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [title, setTitle] = useState("");
    const [members, setMembers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [newMembers, setNewMembers] = useState([]);
    const [removeMembers, setRemoveMembers] = useState([]);
    const [type, setType] = useState(0);
    const [id, setId] = useState(fullid.slice(0, -1));
    // let navigate = useNavigate();

    useEffect(() => {
        setType(+fullid[fullid.length - 1]);
        console.log(type, id);
        fetchList();
        fetchListMembers();
    }, [id]);

    async function fetchList(){
        try {
            setLoading(true);
            const response = await AuthClient.get(`/lists/${id}`, {
                params: {
                    instance: currentUser.instance,
                }
            });
            console.log(response.data);
            setTitle(response.data.title);
            setLoading(false);
        } catch (error) {
            setError(error.response.data);
        }
    }

    async function fetchListMembers(){
        try {
            setLoading(true);
            const response = await AuthClient.get(`/lists/${id}/accounts`, {
                params: {
                    instance: currentUser.instance,
                }
            });
            console.log(response.data);
            setMembers(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data);
        }
    }

    async function handleSearch(event){
        event.preventDefault();
        event.stopPropagation();
        try {
            setLoading(true);
            const response = await APIClient.get(`/search`, {
                params: {
                    q: search,
                    instance: currentUser.instance,
                }
            });
            console.log(response.data.accounts);
            setAccounts(response.data.accounts);
            setLoading(false);
        } catch (error) {
            setError(error.response.data);
        }
    }

    function addAccount(account){
        
        let newMember = {
            id: account.id,
            avatar: account.avatar,
            display_name: account.display_name,
            username: account.username,
            acct: account.acct,
            emojis: account.emojis,
        }
        console.log("add", newMember);
        setNewMembers([...newMembers, newMember]);
    }

    function removeAccount(id){
        console.log("remove", id);
        if(newMembers.map(m => m.id).includes(id)){
            const newMembersList = newMembers.filter((member) => member.id !== id);
            setNewMembers(newMembersList);
        }
        else{
            setRemoveMembers([...removeMembers, id]);
        }
    }

    function saveListHelper(){
        console.log(type);
        if(type === 1){
            saveListPublic();
        }
        else{
            saveListPrivate()
        }
    }

    async function saveListPublic(){
        console.log("saved public")
        console.log(members);
        //remove members already in members list
        var objectIds = new Set(members.map(obj => obj.id));

        // Filter out IDs present in the objects array
        var newMembersList = newMembers.filter(id => !objectIds.has(id));
        //remove duplicates
        newMembersList = [...new Set(newMembersList)];
        console.log(newMembersList);
        console.log("saved!!");
        
        // send id, name, username, avatar url with request
        try{
            if(newMembersList.length > 0){
                const response = await AuthClient.post(`/lists/public/${id}/accounts`, {
                    account_ids: newMembersList,
                }, {
                    params: {
                        instance: currentUser.instance,
                    }
                });
                console.log(response.data)
            }
            // if(removeMembers.length > 0){
            //     const response2 = await AuthClient.delete(`/lists/public/${id}/accounts`, { 
            //         params: {
            //             token: currentUser.token,
            //             instance: currentUser.instance,
            //             account_ids: removeMembers,
            //         }
            //     });
            // }
            if(title !== ""){
                const response3 = await AuthClient.put(`/lists/public/${id}`, {
                    title: title,
                }, {
                    params: {
                        instance: currentUser.instance,
                    }
                });
            }
            // navigate("/lists");
            window.location.pathname = "/lists";
        }
        catch(error){
            setError(error.response.data);
        }
    }

    async function saveListPrivate(){
        console.log("saved private");
        console.log(members);
        //remove members already in members list
        var objectIds = new Set(members.map(obj => obj.id));

        // Filter out IDs present in the objects array
        var newMembersList = newMembers.filter(m => !objectIds.has(m.id));
        //remove duplicates
        newMembersList = [...new Set(newMembersList)];
        console.log("saved!!");
        try{
            if(newMembersList.length > 0){
                const response = await AuthClient.post(`/lists/${id}/accounts`, {
                    account_ids: newMembersList.map(m => m.id),
                }, {
                    params: {
                        instance: currentUser.instance,
                    }
                });
            }
            if(removeMembers.length > 0){
                const response2 = await AuthClient.delete(`/lists/${id}/accounts`, { 
                    params: {
                        instance: currentUser.instance,
                        account_ids: removeMembers,
                    }
                });
            }
            if(title !== ""){
                const response3 = await AuthClient.put(`/lists/${id}`, {
                    title: title,
                }, {
                    params: {
                        instance: currentUser.instance,
                    }
                });
            }
            // navigate("/lists");
            window.location.pathname = "/lists"
        }
        catch(error){
            setError(error.response.data);
        }
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
                            <h1>Edit List</h1>
                            <button className="my-button" onClick={saveListHelper}>Save</button>
                        </div>
                        <label className='form-label'>Title</label>
                        <input className="form-control me-2" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <h3>Add Members</h3>
                        <form className="d-flex add-members" role="search" onSubmit={handleSearch}>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)}    
                            />
                            <button className="my-button" type="submit">Search</button>
                        </form>
                    </div>

                    {accounts.length > 0 ? accounts.map((account) => {
                        return <ListAccount 
                                key={account.id}
                                user_id={account.id}
                                prof={account.avatar}
                                username={account.display_name}
                                fullname={account.username === account.acct ? `${account.username}@${currentUser.instance}` : account.acct}
                                emojis={account.emojis}
                                add={() => addAccount(account)}
                                remove={() => removeAccount(account.id)}
                                check={newMembers.map(m => m.id).includes(account.id) || members.map(m => m.id).includes(account.id)}
                                viewOnly={false}
                            />
                        }) : <div className="no-results">No results found</div>}
                    
                    {loading && <div className="loader"></div>}
                    {/* {!loading && <button className="load-button" onClick={extendTimeline}>Load More</button>} */}
                    
                </div>
            </div>
        </>
    )
}

export default EditList