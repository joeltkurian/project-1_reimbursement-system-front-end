import { useState } from "react";
import NewReimbursement from "../Reimbursement/new-reimbursement";
import PastReimbursement from "../Reimbursement/past-reimbursement";
import './manager-page.css'

export default function ManagerAccountPage() {

    const [togglePast, setSwitch] = useState(false);
    const [accountReimbursement, setAccountReimbursement] = useState([]);

    return (<div className='containerManChild'>
        <button onClick={() => { setSwitch(true) }} className='pastManBtn'>Past Reimbursements</button>
        <button onClick={() => { setSwitch(false) }} className='newManBtn'>New Reimbursement</button>
        <div className='containerManShow'>
            <>{
                togglePast ? <PastReimbursement reimbursement={accountReimbursement} setReimbursement={setAccountReimbursement} /> : <NewReimbursement />
            }</>
        </div>
    </div>);
}