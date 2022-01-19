import "./reimbursement.css"
import { Reimbursement } from "../../../dtos";
import { useEffect, useState } from "react";

export default function PastReimbursement(props: { reimbursement: Reimbursement[], setReimbursement: Function }) {

    const tableRows = props.reimbursement.map(r => <ReimbursementRow key={r.id} {...r} />)

    async function GetReimbursements() {
        const accountId = sessionStorage.getItem("accountId");
        const response = await fetch(`http://localhost:5000/reimbursement/${accountId}/false`);
        const reimbursement: Reimbursement[] = await response.json();
        props.setReimbursement(reimbursement);
    }

    useEffect(() => {
        GetReimbursements();
    }, [])

    if (props.reimbursement.length != 0) {
        return (<table>
            <thead><tr><th>Reimbursement</th><th>Amount</th><th>Status/Comment</th></tr></thead>
            <tbody>{tableRows}</tbody>
        </table>);
    } else {
        return (<h1>No Reimbursements under this account!</h1>)
    }
}

export function ReimbursementRow(props: Reimbursement) {
    const { id, name, amount, status, statusComment } = props;
    const [sAndC, setsAndC] = useState(true);
    return (<tr>
        <td>{name}</td>
        <td>${amount.toLocaleString('en-US')}</td>
        <td>{status === "" ? 'Not Checked' :
            <div className="statCommentLabel" onMouseOver={() => { setsAndC(false) }}
                onMouseLeave={() => { setsAndC(true) }}>{sAndC != true && statusComment ? statusComment : status}</div>}</td>
    </tr>)
}