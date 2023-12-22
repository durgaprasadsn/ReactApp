import { useState } from 'react';
import { loginFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import { logIn } from "../services/authService";
import { useNavigate } from 'react-router';

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

export default function Login(){
    const [loginState,setLoginState]=useState(fieldsState);
    const navigate = useNavigate();
    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginState);
        var email, password;
        for (const [key, value] of Object.entries(loginState)) {
            if (key === 'emailaddress') {
                email = value;
            }
            if (key === 'password') {
                password = value;
            }
        }
        console.log(email, password);
        loginAccount(email, password);
    }

    //handle Login API Integration here
    async function loginAccount(email, password) {
        const user = await logIn(email, password);
        // console.log("User " + user.email);
        if (user) {
            console.log(user.email);
            navigate("/home");
        }
    }

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
            {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }
            <FormAction handleSubmit={handleSubmit} text="Login" />
        </div>

      </form>
    )
}