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
    const userContext = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("selectedTheme"));
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        navigate(`/search/${encodeURIComponent(search)}`);
    }

    function toggleSearch() {
        setShowSearch(!showSearch);
    }

    function logOut() {
        if (userContext?.setUsers && userContext?.setUserId && userContext?.setLoggedIn && userContext?.setCurrentUser) {
            userContext.setUsers((prev) => {
                return prev.filter((user) => user.id !== userContext.currentUser.id)
            });
            userContext.setUserId(userContext.users.length - 2);
            if(userContext.users.length === 1){
                userContext.setLoggedIn(false);
                userContext.setUserId(0);
            }
            userContext.setCurrentUser(userContext.users[userContext.users.length - 2]);
        }
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
                        <div className="vikalp" onClick={() => navigate("/vikalp")}>
                            <img
                                key={theme}
                                className="vikalpImg"
                                src={theme === "dark" ? vikalpWhite : vikalpBlack}
                                alt="vikalp"
                            />
                        </div>
                        <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
                            <img className="navbarProfileImg" src={userContext?.currentUser?.avatar} alt="profile" />
                            {showDropdown && (
                                <div className="dropdown-content">
                                    <div onClick={() => navigate(`/profile/${userContext?.currentUser?.id}`)}>Profile</div>
                                    <div onClick={() => navigate("/lists")}>Lists</div>
                                    <div onClick={() => navigate("/theme")}>Theme</div>
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
