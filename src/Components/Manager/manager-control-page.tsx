import { useEffect, useRef, useState } from "react";
import { Reimbursement } from "../../../dtos";

export default function ManagerControlPage() {

    const [statBtn, setStatBtn] = useState(false);
    const [reimbursement, setReimbursement] = useState([]);

    return (<div className='containerManChild'>
        <button onClick={() => { setStatBtn(false) }} className='pastManBtn'>Reimbursements</button>
        <button onClick={() => { setStatBtn(true) }} className='newManBtn'>Statistics</button>
        <div className='containerManShow'>
            <>{
                statBtn ? <h1>Statistics</h1> : <AllReimbursement reimbursement={reimbursement} setReimbursement={setReimbursement} />
            }</>
        </div>
    </div>);
}

export function AllReimbursement(props: { reimbursement: Reimbursement[], setReimbursement: Function }) {

    const [renderR, setRenderR] = useState(false);
    const tableRows = props.reimbursement.map(r => <ReimbursementRow key={r.id} reimb={r} setRenderR={setRenderR} />)
    // const tableRows = props.reimbursement.map(r => <ReimbursementRow key={r.id} {...r} />)

    async function GetAllReimbursements() {
        const accountId = sessionStorage.getItem("accountId");
        const response = await fetch(`http://localhost:5000/reimbursement/${accountId}/true`);
        const reimbursement: Reimbursement[] = await response.json();
        console.log(reimbursement);
        props.setReimbursement(reimbursement);
    }

    useEffect(() => {
        GetAllReimbursements();
        setRenderR(false);
    }, [renderR]);

    if (props.reimbursement.length != 0) {
        return (<div className="reimScroll">
            <table>
                <thead><tr><th>First Name</th><th>Last Name</th><th>Reimbursement</th><th>Amount</th><th>Status/Comment</th></tr></thead>
                <tbody>{tableRows}</tbody>
            </table>
        </div>);
    } else {
        return (<h1>No Reimbursements Present!</h1>)
    }
}

export function ReimbursementRow(props: { reimb: Reimbursement, setRenderR: Function }) {
    const { id, name, amount, account, status, statusComment } = props.reimb;
    const [sAndC, setsAndC] = useState(true);
    const commentInput = useRef(null);
    async function appDen(statusCode: string) {
        // console.log(statusCode + commentInput.current.value);
        const reimbursementUpdate = {
            statusComment: commentInput.current.value
        }
        const response = await fetch(`http://localhost:5000/reimbursement/${id}/${statusCode}`,
            {
                method: 'PATCH',
                body: JSON.stringify(reimbursementUpdate),
                headers: {
                    'Content-Type': "application/json"
                }
            })
        if (await response.status != 200) {
            alert(await response.text());
        }
        props.setRenderR(true);
    }

    return (<tr>
        <td>{account.fname}</td>
        <td>{account.lname}</td>
        <td>{name}</td>
        <td>${amount.toLocaleString('en-US')}</td>
        <td>{status === "" ? <div className="containerAPDEN"><button onClick={() => { appDen('approved') }} className="apprBtn">Approve</button><button onClick={() => { appDen('denied') }} className="denBtn">Deny</button><input className="commentInput" ref={commentInput} placeholder="comments" /></div> :
            <div className="statCommentLabel" onMouseOver={() => { setsAndC(false) }}
                onMouseLeave={() => { setsAndC(true) }}>{sAndC != true && statusComment ? statusComment : status}</div>}</td>
    </tr>)
}