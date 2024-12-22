import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import APIClient from '../apis/APIClient'
import { UserContext } from '../context/UserContext'
import ThemePicker from '../theme/ThemePicker'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Headbar from '../components/Headbar'
import Status from '../components/Status'
import { useErrors } from '../context/ErrorContext'
import CreateList from '../components/CreateList'
import "../styles/lists.css"

function Lists() {
    const {currentUser} = useContext(UserContext);
    const {setError} = useErrors();
    const [show, setShow] = useState(false);
    const [timeline, setTimeline] = useState([]);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [maxId, setMaxId] = useState("");
    let navigate = useNavigate();

    useEffect(() =>{
        fetchLists();
    }, []);

    useEffect(() =>{
        fetchListTimeline();
    }, [selectedId]);

    async function fetchLists(){
        try {
            const response = await APIClient.get("/lists", {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                }
            });
            console.log(response.data);
            setLists(response.data);
        } catch (error) {
            setError(error.response.data);
        }
    }

    async function fetchListTimeline(){
        console.log(selectedId);
        try {
            if (selectedId === "" ){
                fetchPublicLists();
                return;
            }
            setLoading(true);
            const response = await APIClient.get(`/timelines/lists/${selectedId}`, {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                    max_id: maxId,
                }
            });
            setTimeline(response.data.data);
            setMaxId(response.data.max_id);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error.response.data);
        }
    }

    async function fetchPublicLists(){
        console.log("public");
    }

    async function deleteList(id){
        if(id === ""){
            return;
        }
        try {
            const response = await APIClient.delete(`/lists/${id}`, {
                params: {
                    token: currentUser.token,
                    instance: currentUser.instance,
                }
            });
            console.log(response.data);
            fetchLists();
        }
        catch (error) {
            setError(error.response.data);
        }
    }

    function editList(id){
        if(id === ""){
            return;
        }
        navigate(`/lists/${id}/edit`);
    }

    return (
        <>
            <div className="main">
                <ThemePicker />
                <Navbar />
                <Sidebar />
                <div className="feed container">
                    <Headbar />
                    <div className="search-options">
                        <div onClick={() => {setSelectedId("");setMaxId("");}} className={selectedId == "" ? "active-option" : ""}>Public</div>
                        {lists.length > 0 && lists.map(list => {
                            return <div key={list.id} onClick={() => {setSelectedId(list.id);setMaxId("");}} className={selectedId == list.id ? "active-option" : ""}>{list.title}</div>
                        })}
                    </div>
                    <div className='list-options'>
                        <button className='my-button' onClick={() => setShow(true)}>Create</button>
                        <button className='my-button edit-button' onClick={() => editList(selectedId)}>Edit</button>
                        <button className='my-button delete-button' onClick={() => deleteList(selectedId)}>Delete</button>
                    </div>
                    {selectedId !== "" ? 
                    timeline.length > 0 && timeline.map(status => {
                        return <Status 
                            key={status.id}
                            instance={currentUser.instance}
                            reblogged={status.reblog ? true : false}
                            post={status.reblog? status.reblog : status}
                            postedBy={status.account}
                            isUserProfile={false}
                            mentions={status.mentions}
                        />
                    })
                    :
                    <div className="no-data">Select a list to view timeline</div>
                    }
                    <CreateList 
                        show={show} 
                        close={() => setShow(false)}
                    /> 
                    {loading && <div className="loader"></div>}
                    {/* {!loading && <button className="load-button" onClick={extendTimeline}>Load More</button>} */}
                    
                </div>
            </div>
        </>
    );
}

export default Lists