import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios  from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchCard from "../components/SearchCard";
import { UserContext } from "../context/UserContext";

function Search(){
    const {currentUser, isLoggedIn} = useContext(UserContext);
    const {q} = useParams();
    const [accounts, setAccounts] = useState([]);
    const [ids, setIds] = useState([]);
    let navigate = useNavigate()

    useEffect(() => {
        if(!isLoggedIn){
            navigate("/");
        }
        async function fetchData() {
            try {
                const response1 = await axios.post(`http://localhost:3000/api/v1/search`, {
                    q,
                    token: currentUser.token,
                    instance: currentUser.instance,
                });
                //console.log(response.data);
                setAccounts(response1.data.accounts);
                // response1.data.accounts.forEach((account) => {
                //     setIds((prev) => [...prev, account.id]);
                // });
                // //console.log(ids);
                
                // const response2 = await axios.get(`https://${currentUser.instance}/api/v1/accounts/relationships`, {
                //     params: {"id[]" : ids},
                //     headers: {
                //         Authorization: `Bearer ${currentUser.token}`,
                //     },
                // });
                // console.log(response2.data);

            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    // async function checkRelation(id){
    //     try {
    //         const response = await axios.get(`https://${currentUser.instance}/api/v1/accounts/relationships`, {
    //             params: {"id[]" : id},
    //             headers: {
    //                 Authorization: `Bearer ${currentUser.token}`,
    //             },
    //         });
    //         //console.log(response.data);
    //         let data = response.data;
    //         return data[0].following === true;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="feed container" style={{marginBottom: "5px"}}>
                {accounts.map((account, index) => {
                    return <SearchCard 
                        user_id={account.id}
                        prof={account.avatar}
                        username={account.display_name}
                        fullname={account.acct}
                    />
                })}
            </div>
        </>
    );
}

export default Search;