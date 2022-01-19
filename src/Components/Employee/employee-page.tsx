import { useState } from 'react';
import NewReimbursement from '../Reimbursement/new-reimbursement';
import PastReimbursement from '../Reimbursement/past-reimbursement';
import './employee-page.css'



export default function EmployeePage() {
    const [pastReimburse, setSwitch] = useState(false);
    const [reimbursement, setReimbursement] = useState([]);

    return (<div className='totalEmp'>
        <h1 className='empHeaderLabel'>Welcome Employee: {sessionStorage.getItem('fname')} {sessionStorage.getItem('lname')}</h1>
        <div className='containerEmp'>
            <button onClick={() => { setSwitch(true) }} className='pastBtn'>Past Reimbursements</button>
            <button onClick={() => { setSwitch(false) }} className='newBtn'>New Reimbursement</button>
            <div className='containerEmpShow'>
                <>{
                    pastReimburse ? <PastReimbursement reimbursement={reimbursement} setReimbursement={setReimbursement} /> : <NewReimbursement />
                }</>
            </div>
        </div>
    </div>);
}