import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import vikalpWhite from "../images/vikalp-white.png";
import vikalpBlack from "../images/vikalp-black.png";
import "../styles/navbar.css";
import { FaMagnifyingGlass } from "react-icons/fa6";

export function handleLogOut() {
    
    localStorage.removeItem("--hue");
    document.documentElement.style.setProperty("--hue", 204);
    localStorage.removeItem("experience");
    localStorage.removeItem("server");
    window.location.pathname = "/";
}

function Navbar() {
    const { setLoggedIn, currentUser, paths, setUsers, users, setUserId, setCurrentUser} = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("selectedTheme"));
    let navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        navigate(`${paths.search}/${encodeURIComponent(search)}`);
    }

    function toggleSearch() {
        setShowSearch(!showSearch);
    }

    function logOut() {
        setUsers((prev) => {
            return prev.filter((user) => user.id !== currentUser.id)
        })
        setUserId(users.length - 2);
        if(users.length === 1){
            setLoggedIn(false);
            setUserId(0);
        }
        setCurrentUser(users[users.length - 2]);
        handleLogOut();
    }

    return (
        <nav className="navbar sticky-top border-bottom">
            <div className="container">
                <div className="container-fluid">
                    <div className={`search-form ${showSearch ? "active" : ""}`}>
                        <form className="d-flex" role="search" onSubmit={handleSubmit}>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)}    
                            />
                            <button className="my-button" type="submit">Search</button>
                        </form>
                    </div>

                    {/* Search icon for smaller screens */}
                    <div className="search-icon" onClick={toggleSearch}>
                        <FaMagnifyingGlass />
                    </div>

                    <div className="mystodon" onClick={() => navigate("/home")}>
                        MYSTODON
                    </div>

                    <div className="navbar-right">
                        <div className="vikalp" onClick={() => navigate(paths.vikalp)}>
                            <img
                                key={theme}
                                className="vikalpImg"
                                src={theme === "dark" ? vikalpWhite : vikalpBlack}
                                alt="vikalp"
                            />
                        </div>
                        <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
                            <img className="navbarProfileImg" src={currentUser.avatar} alt="profile" />
                            {showDropdown && (
                                <div className="dropdown-content">
                                    <div onClick={() => navigate(`${paths.profile}/${currentUser.id}`)}>Profile</div>
                                    <div onClick={() => navigate(paths.theme)}>Theme</div>
                                    <div onClick={() => navigate("/about")}>About Us</div>
                                    <div onClick={() => navigate("/users")}>Switch User</div>
                                    <div onClick={() => { logOut() }}>Logout</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
