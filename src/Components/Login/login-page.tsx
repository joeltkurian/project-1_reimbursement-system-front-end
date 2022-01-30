import { useRef, useState } from 'react';
import { HashLoader } from 'react-spinners';
import './login-page.css'
import { css } from '@emotion/react';

export default function LoginPage(props) {

    const usernameInput = useRef(null);
    const passwordInput = useRef(null);
    const [loadingFetch, setLoading] = useState(false);

    async function Login() {
        setLoading(true);
        const loginPayload = {
            username: usernameInput.current.value,
            password: passwordInput.current.value
        }
        const response = await fetch('https://jtk-reimbursement-app-back-end.azurewebsites.net/login', {
            method: 'PATCH',
            body: JSON.stringify(loginPayload),
            headers: {
                'Content-Type': "application/json"
            }
        })
        if (response.status === 410) {
            setLoading(false);
            const err = await response.text();
            alert(err);
            usernameInput.current.value = '';
        }
        else if (response.status === 411) {
            setLoading(false);
            const err = await response.text();
            alert(err);
            passwordInput.current.value = '';
        }
        else {
            setLoading(false);
            const account = await response.json();
            sessionStorage.setItem("username", account.username);
            sessionStorage.setItem("fname", account.fname);
            sessionStorage.setItem('lname', account.lname);
            sessionStorage.setItem("accountId", account.id);
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
            {loadingFetch ? <div className='loader'><HashLoader color='white' css={override} size={50} /><HashLoader color='white' css={override} size={50} /><HashLoader color='white' css={override} size={50} /><HashLoader color='white' css={override} size={50} /><HashLoader color='white' css={override} size={50} /></div> :
                <button className="loginBtn" onClick={Login}>Login</button>
            }
        </div>
    </div>
    );
}

export const override = css`
margin: auto auto;
display:inline-block;
margin-left:10px;
opacity: 0.5;
`;