import { useEffect, useRef } from 'react';
import './login-page.css'

export default function LoginPage(props) {

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);


    async function Login() {
        console.log('BEGIN');
        const loginPayload = {
            username: usernameInput.current.value,
            password: passwordInput.current.value
        }
        const response = await fetch('http://localhost:5000/login', {
            method: 'PATCH',
            body: JSON.stringify(loginPayload),
            headers: {
                'Content-Type': "application/json"
            }
        })
        if (response.status === 410) {
            const err = await response.text();
            alert(err);
            usernameInput.current.value = '';
        }
        else if (response.status === 411) {
            const err = await response.text();
            alert(err);
            passwordInput.current.value = '';
        }
        else {
            const account = await response.json();
            sessionStorage.setItem("username", account.username);
            sessionStorage.setItem("fname", account.fname);
            sessionStorage.setItem('lname', account.lname);
            sessionStorage.setItem("id", account.id);
            sessionStorage.setItem("isManager", account.isManager);
            // props.updateUser({ username: sessionStorage.getItem("username"), isManager: sessionStorage.getItem("isManager") });
            props.updateUser({ username: account.username, isManager: account.isManager === 'false' ? false : true });
        }
    }

    return (<div className='total'>
        <div className='container'>
            <label className='usernameLabel'>username</label>
            <input ref={usernameInput} type="text" className='usernameInput' placeholder='' />
            <label className='passwordLabel'>password</label>
            <input ref={passwordInput} type="password" className='passwordInput' placeholder='' />
            <button className="loginBtn" onClick={Login}>Login</button>
        </div>
    </div>
    );
}