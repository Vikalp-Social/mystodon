import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Navbar() {
    const {setLoggedIn} = useContext(UserContext);
    const [search, setSearch] = useState("");
    let navigate = useNavigate();

    function handleSubmit(event){
        event.preventDefault();
        navigate(`/search/${search}`);
    }

    function handleLogOut() {
        setLoggedIn(false);
        navigate("/");
    }

    function goHome() {
        navigate("/home");
    }

    return(
        <nav className="navbar sticky-top navbar-expand-lg border-bottom border-body">
            <div className="container">
                <div className="container-fluid">
                    {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample11" aria-controls="navbarsExample11" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button> */}

                    <div className="collapse navbar-collapse d-lg-flex" id="navbarsExample11">
                        <form className="d-flex" role="search" onSubmit={handleSubmit}>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)}    
                            />
                            <button className="my-button" type="submit">Search</button>
                        </form>
                        <ul className="navbar-nav col-lg-6 justify-content-lg-center">
                            <li className="nav-item" onClick={goHome}>
                                MYSTODON
                            </li>
                        </ul>

                        <div className="d-lg-flex col-lg-3 justify-content-lg-end">
                            <button className="btn btn-outline-danger" onClick={handleLogOut}>Log Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;