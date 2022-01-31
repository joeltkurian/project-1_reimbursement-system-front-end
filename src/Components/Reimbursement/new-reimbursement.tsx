import { useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { override } from "../Login/login-page";
export default function NewReimbursement() {

    const name = useRef(null);
    const amount = useRef(null);
    const [confirm, setConfirm] = useState('');
    const [fileBinary, setfileBinary] = useState(null);
    const [filePicked, setFilePicked] = useState(false);
    const [result, setResult] = useState(null);
    const [loadingFetch, setLoading] = useState(false);

    const fileChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = ev => {

                let read = String(reader.result);
                setfileBinary(read);
                console.log(read);

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
                setResult({
                    image: URL.createObjectURL(img), type: type
                });
                setFilePicked(true);
            };
        } else {
            setFilePicked(false);
            setfileBinary(null);
            setResult(null);
        }
    }

    async function addReimbursement() {
        setLoading(true);
        if (name.current.value !== '' && amount.current.value !== '') {
            const reimbursementPayLoad = {
                accountId: sessionStorage.getItem("accountId"),
                name: name.current.value,
                amount: amount.current.value,
                formData: fileBinary,
            }
            const response = await fetch('https://jtk-reimbursement-app-back-end.azurewebsites.net/reimbursement', {
                method: 'POST',
                body: JSON.stringify(reimbursementPayLoad),
                headers: {
                    'Content-Type': "application/json"
                }
            })
            if (response.status === 201) {
                setLoading(false);
                setConfirm("Created Reimbursement");
            }
            else {
                setLoading(false);
                setConfirm(await response.text());
            }
        }
        else {
            setLoading(false);
            setConfirm("Please enter Reason and Amount!");
        }
    }

    return (<>
        <h3>{confirm}</h3>
        <div className="newRemContainer">
            <input ref={name} type="text" className="reimbursename" placeholder="Reason" />
            <input ref={amount} type="text" className="amount" placeholder="Amount" />
            <input type="file" className="fileUp" onChange={fileChange} />
            {loadingFetch ? <div className="loaderNewReimb"><BeatLoader css={override} size={15} color="#ffffff" /><BeatLoader css={override} size={15} color="#ffffff" /><BeatLoader css={override} size={15} color="#ffffff" /></div> :
                <button onClick={addReimbursement} className="submit">Submit</button>
            }
            {filePicked ? <div className='iframeContainer'>{result.type.includes('image') ?
                <img className="loadedImg" src={result.image} alt="rendered a file"></img> :
                < iframe className="loadedImg" src={result.image} title="loaded file" />
            }</div> : <></>}
        </div>
    </>);
}