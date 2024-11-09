import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import vikalpWhite from "../images/vikalp-white.png";
import vikalpBlack from "../images/vikalp-black.png";
import "../styles/navbar.css";

//function to handle the logout of the user
export function handleLogOut() {
    localStorage.removeItem("current_user");
    localStorage.removeItem("--hue");
    document.documentElement.style.setProperty("--hue", 204);
    window.location.pathname = "/";
}

function Navbar() {
    const {setLoggedIn, currentUser, paths} = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [show, setShow] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('selectedTheme'));
    let navigate = useNavigate();

    //function to handle the submit of the search form
    function handleSubmit(event){
        event.preventDefault();
        navigate(`${paths.search}/${encodeURIComponent(search)}`);
    }

    function goHome() {
        navigate(paths.home);
    }

    return(
        <nav className="navbar sticky-top border-bottom">
            <div className="container">
                <div className="container-fluid">
                    <div>
                        <form className="d-flex" role="search" onSubmit={handleSubmit}>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)}    
                            />
                            <button className="my-button" type="submit">Search</button>
                        </form>
                    </div>
                    <div className="mystodon">
                        MYSTODON
                    </div>
                    <div className="navbar-right">
                        <div className="vikalp" onClick={() => navigate(paths.vikalp)}>
                            <img key={theme} className="vikalpImg" src={theme === "dark" ? vikalpWhite : vikalpBlack} alt="vikalp" /> 
                        </div>
                        <div className="dropdown" onClick={() => setShow(!show)}>
                            <img className="navbarProfileImg" id="myelement" src={currentUser.avatar} alt="profile" />
                            {show && 
                                <div class="dropdown-content">
                                    <div onClick={() => navigate(`${paths.profile}/${currentUser.id}`)}>Profile</div>
                                    <div onClick={() => navigate(paths.theme)}>Theme</div>
                                    <div onClick={() => {setLoggedIn(false); handleLogOut()}}>Logout</div>
                                </div>
                            }
                        </div>
                    </div>
                    
                </div>
            </div>
        </nav>
    );
}
export default Navbar;