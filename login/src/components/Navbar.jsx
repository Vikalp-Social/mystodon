import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/navbar.css";

function Navbar() {
    const {setLoggedIn, currentUser} = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [show, setShow] = useState(false);
    let navigate = useNavigate();

    function handleSubmit(event){
        event.preventDefault();
        navigate(`/search/${encodeURIComponent(search)}`);
    }

    function handleLogOut() {
        setLoggedIn(false);
        localStorage.removeItem("current_user");
        localStorage.removeItem("--hue");
        document.documentElement.style.setProperty("--hue", 204);
        navigate("/");
    }

    function goHome() {
        navigate("/home");
    }

    return(
        <nav className="navbar sticky-top navbar-expand-lg border-bottom border-body">
            <div className="container">
                <div className="container-fluid">
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
                    </div>
                    <div className="dropdown" onClick={() => setShow(!show)}>
                        <img className="navbarProfileImg" id="myelement" src={currentUser.avatar} alt="profile" />
                        {show && 
                            <div class="dropdown-content">
                                <div onClick={() => navigate(`/profile/${currentUser.id}`)}>Profile</div>
                                <div onClick={() => navigate('/theme')}>Theme</div>
                                <div onClick={handleLogOut}>Logout</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;