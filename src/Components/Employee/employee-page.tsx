import { useState } from 'react';
import NewReimbursement from '../Reimbursement/new-reimbursement';
import PastReimbursement from '../Reimbursement/past-reimbursement';
import './employee-page.css'


export default function EmployeePage() {
    const [switchBtn, setSwitch] = useState(false);

    return (<div className='totalEmp'>
        <h1 className='empHeaderLabel'>Welcome Employee: {sessionStorage.getItem('fname')} {sessionStorage.getItem('lname')}</h1>
        <div className='containerEmp'>
            <button onClick={() => { setSwitch(true) }} className='pastBtn'>Past Reimbursements</button>
            <button onClick={() => { setSwitch(false) }} className='newBtn'>New Reimbursement</button>
            <div className='containerEmpShow'>
                <>{
                    switchBtn ? <PastReimbursement /> : <NewReimbursement />
                }</>
            </div>
        </div>
    </div>);
}