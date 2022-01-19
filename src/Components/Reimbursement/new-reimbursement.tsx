import { useEffect, useRef, useState } from "react";


export default function NewReimbursement() {

    const name = useRef(null);
    const amount = useRef(null);
    const [confirm, setConfirm] = useState('');

    async function addReimbursement() {
        if (name.current.value != '' && amount.current.value != '') {
            const reimbursementPayLoad = {
                accountId: sessionStorage.getItem("accountId"),
                name: name.current.value,
                amount: amount.current.value
            }
            const response = await fetch('http://localhost:5000/reimbursement', {
                method: 'POST',
                body: JSON.stringify(reimbursementPayLoad),
                headers: {
                    'Content-Type': "application/json"
                }
            })
            if (await response.status == 201) {
                setConfirm("Created Reimbursement");
            }
            else {
                setConfirm(await response.text());
            }
        }
        else {
            setConfirm("Please enter Reason and Amount!");
        }
    }

    return (<>
        <h3>{confirm}</h3>
        <div className="newRemContainer">
            <input ref={name} type="text" className="reimbursename" placeholder="Reason" />
            <input ref={amount} type="text" className="amount" placeholder="Amount" />
            <button onClick={addReimbursement} className="submit">Submit</button>
        </div>
    </>);
}