//login -> pilih proyek -> main page

import React, { useState } from "react";
import "../../App.css";
import { Button, Form, FormFloating } from "react-bootstrap";
import { getLogin, getUser, getUserName, setIsLogin, setRole, setUserName } from "../../repository";
import { useLocation, useNavigate } from "react-router-dom";
import { propTypes } from "react-bootstrap/esm/Image";

function LoginPage(props){

    const test = {
        ID: "111",
        password: "test123",
        username: "test",
        accountLevel: "ADMIN"
    }

    
    const navigate = useNavigate();
    //const location = useLocation();
    //const from = location.state?.from?.pathname || "/";

    const initialState = {
        ID: "",
        password: ""
    }

    const [inputs, setInputs] = useState(initialState);



    const handleInputChange = (event) => {
        event.preventDefault();
        setInputs({...inputs, [event.target.name]: event.target.value});
    };

    const [success, setSuccess] = useState(false);
    //const setLogin = localStorage.setItem("login", success);
    //console.log("success: " + success);
    const login = async (event) =>{
        event.preventDefault();
        const user = await getUser(inputs.ID, inputs.password);
        if(user === null){
            /*const username = user.username;
            const password = user.password;
            const accountLevel = user.accountLevel;
            const ID = user.ID;*/
           
            setInputs(initialState);  
           
            window.alert("Login Failed: incorrect ID/Password");
            //setSuccess(!success);
            //navigate(from, { replace: true });
        }else{
            setIsLogin();
            const name =JSON.stringify(user);
            setUserName(name);
            
            const role = user.accountLevel;
            setRole(role);
            //console.log(inputs.ID);
            navigate("/proyek");


        }
    }

    return(
        <>
            <div className="modalBackground">
                <div className="modalContainer">
                    <form onSubmit={login}>
                        <h2>dbSolution</h2>
                        <h4> ID: </h4>
                        <input type="text" name="ID" value={inputs.ID} onChange={handleInputChange} required autoComplete="off"></input>
                        <h4> Password: </h4>
                        <input type="password" name="password" value={inputs.password} onChange={handleInputChange} required></input>
                        <br/><br/>
                        <Button type="submit">Login</Button>
                        
                    </form>
                </div>
            </div>
        
        </>
    )
}


export default LoginPage;
