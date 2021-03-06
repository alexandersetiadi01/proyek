import React, {useState} from "react";
import * as FaIcons from "react-icons/fa";

import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import {sidebarData, sidebarDataAdmin} from "./sidebarData";
import { getRole, getSelectedProyek, getUserName, setLogOut } from "../../repository";
import { Button } from "react-bootstrap";

function Navbar(){ 
    const [sidebar, setSidebar] = useState(false);
   //const location = useLocation();
    const showSidebar = () => setSidebar(!sidebar);
    const navigate = useNavigate();
    const logout = () => {
        if(window.confirm("logging out?") === true){
            setLogOut();
            navigate("/");
        }
       
    }

    const proyek = getSelectedProyek();
    const user =getUserName().username;
    
    return(
    <>
        <nav className="navbar sticky-top navbar-expand navbar-blue bg-dark">
        <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar}/>
        </Link>  
        <h1 title="double click to logout" onDoubleClick={logout}> {proyek} - {user}</h1>
        </nav>
        <nav className={sidebar ? 'nav-menu-active' : 'nav-menu'}>
            
            <ul classname="nav-menu-items" onClick={showSidebar}>
                {sidebarData.map((item, index) => {
                    return(
                        <li key={index} className={item.classname}>
                            <Link to={item.path}>
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <ul>
                <button onClick={logout}>Logout</button>
            </ul>
        </nav>
               
    </>
    )
}

export default Navbar;