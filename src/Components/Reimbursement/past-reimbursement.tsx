import "./reimbursement.css"
import { Reimbursement } from "../../../dtos";
import { useEffect, useState } from "react";
import { RiseLoader } from "react-spinners";
import { override } from "../Login/login-page";

export default function PastReimbursement(props: { reimbursement: Reimbursement[], setReimbursement: Function }) {
    const [loading, setLoading] = useState(false);
    const tableRows = props.reimbursement.map(r => <ReimbursementRow key={r.id} {...r} />)

    useEffect(() => {
        (async () => {
            setLoading(true);
            const accountId = sessionStorage.getItem("accountId");
            const response = await fetch(`https://jtk-reimbursement-app-back-end.azurewebsites.net/reimbursement/${accountId}/false`);
            const reimbursement: Reimbursement[] = await response.json();
            if (response.status === 250 || response.status === 200) {
                setLoading(false);
                props.setReimbursement(reimbursement);
            } else {
                setLoading(false);
                console.log("ERROR");
            }
        })();
    }, [props.setReimbursement]);

    if (loading) {
        return (<div className="loaderDefaultDiv"><RiseLoader css={override} color="white" size={50} /></div>)
    } else {
        if (props.reimbursement.length !== 0) {
            return (<table>
                <thead><tr><th>Reimbursement</th><th>Amount</th><th>Status/Comment</th></tr></thead>
                <tbody>{tableRows}</tbody>
            </table>);
        } else {
            return (<h1>No Reimbursements under this account!</h1>)
        }
    }
}

export function ReimbursementRow(props: Reimbursement) {
    const { name, amount, status, statusComment, formData } = props;
    const [nameFile, setNameFile] = useState(true);
    const [sAndC, setsAndC] = useState(true);
    return (<tr>
        <td>
            {formData ?
                <div className="nameFile" onClick={() => { setNameFile(nameFile ? false : true) }}>{nameFile !== true ? <ShowForm file={formData} nameFile={nameFile} setNameFile={setNameFile} /> : name}</div>
                : `${name}`
            }</td>

        <td>${amount.toLocaleString('en-US')}</td>
        <td>{status === "" ? 'Not Checked' :
            <div className="statCommentLabel" onMouseOver={() => { setsAndC(false) }}
                onMouseLeave={() => { setsAndC(true) }}>{sAndC !== true && statusComment ? statusComment : status}</div>}</td>
    </tr>)
}

export function ShowForm(props: { file, nameFile, setNameFile }) {


    let read = String(props.file);

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    const img = dataURLtoBlob(read);
    const type = String(img.type);
    const url = URL.createObjectURL(img);
    function changeNameFile() {
        props.setNameFile(props.nameFile ? false : true)
    }

    return (<div className={`loadedFileContainer`}>{type.includes('image') ?
        <img onClick={changeNameFile} className="loadedFile" src={url} alt="rendered the uploaded file" /> :
        <><embed id="something" className="loadedFile" src={url} /><button className="close">X</button></>
    }</div>);

}