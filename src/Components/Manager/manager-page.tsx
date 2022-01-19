import { useState } from 'react';
import ManagerAccountPage from './manager-account-page';
import ManagerControlPage from './manager-control-page';
import './manager-page.css'


export default function ManagerPage() {
    const [managerLevel, setManagerLevel] = useState(true);


    return (<div className='totalMan'>
        <h1 className='manHeaderLabel'>Welcome Manager: {sessionStorage.getItem('fname')} {sessionStorage.getItem('lname')}</h1>
        <div className='containerMan'>
            <button onClick={() => { setManagerLevel(true) }} className='pastManBtn'>Manager Level</button>
            <button onClick={() => { setManagerLevel(false) }} className='newManBtn'>Account Level</button>
            <div className='containerManShow'>
                <>{
                    managerLevel ? <ManagerControlPage /> : <ManagerAccountPage />
                }</>
            </div>
        </div>
    </div>);
}