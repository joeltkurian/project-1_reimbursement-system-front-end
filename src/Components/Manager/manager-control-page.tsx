import { useEffect, useRef, useState } from "react";
import { GridLoader, ScaleLoader } from "react-spinners";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, CartesianGrid, Area } from 'recharts';
import { AccountStatistics, Reimbursement } from "../../../dtos";
import { override } from "../Login/login-page";
import { ShowForm } from "../Reimbursement/past-reimbursement";

export default function ManagerControlPage() {

    const [statBtn, setStatBtn] = useState(false);
    const [reimbursement, setReimbursement] = useState([]);

    return (<div className='containerManChild'>
        <button onClick={() => { setStatBtn(false) }} className='pastManBtn'>Reimbursements</button>
        <button onClick={() => { setStatBtn(true) }} className='newManBtn'>Statistics</button>
        <div className='containerManShow'>
            <>{
                statBtn ? <StatisticsPage /> : <AllReimbursement reimbursement={reimbursement} setReimbursement={setReimbursement} />
            }</>
        </div>
    </div>);
}

export function AllReimbursement(props: { reimbursement: Reimbursement[], setReimbursement: Function }) {
    const { setReimbursement } = props;
    const [loading, setLoading] = useState(false);
    const tableRows = props.reimbursement.map((r, i) => <ReimbursementRow key={r.id} reimb={r} setReimb={props.setReimbursement} reimbArr={props.reimbursement} index={i} />)
    // const tableRows = props.reimbursement.map(r => <ReimbursementRow key={r.id} {...r} />)

    useEffect(() => {
        (async () => {
            setLoading(true);
            const accountId = sessionStorage.getItem("accountId");
            const response = await fetch(`https://jtk-reimbursement-app-back-end.azurewebsites.net/reimbursement/${accountId}/true`);
            const reimbursement: Reimbursement[] = await response.json();
            //console.log(reimbursement);
            props.setReimbursement(reimbursement);
            if (response.status === 250 || response.status === 200) {
                setLoading(false);
                setReimbursement(reimbursement);
            } else {
                setLoading(false);
                console.log("ERROR");
            }
        })();
    }, [setReimbursement]);

    if (loading) {
        return (<div className="loaderDefaultDiv"><ScaleLoader css={override} color="white" /><ScaleLoader css={override} color="white" /><ScaleLoader css={override} color="white" /><ScaleLoader css={override} color="white" /><ScaleLoader css={override} color="white" /><ScaleLoader css={override} color="white" /><ScaleLoader css={override} color="white" /></div>)
    } else {
        if (props.reimbursement.length !== 0) {
            return (<div className="reimScroll">
                <table>
                    <thead><tr><th>First Name</th><th>Last Name</th><th>Reimbursement</th><th>Amount</th><th>Status/Comment</th></tr></thead>
                    <tbody>{tableRows}</tbody>
                </table>
            </div>);
        } else {
            return (<h1>No Approved Reimbursements Present!</h1>)
        }
    }
}

export function ReimbursementRow(props: { reimb: Reimbursement, setReimb: Function, reimbArr: Reimbursement[], index: number }) {
    const { id, name, amount, account, status, statusComment, formData } = props.reimb;
    const [sAndC, setsAndC] = useState(true);
    const [nameFile, setNameFile] = useState(true);
    const commentInput = useRef(null);
    async function appDen(statusCode: string) {
        // console.log(statusCode + commentInput.current.value);
        const reimbursementUpdate = {
            statusComment: commentInput.current.value
        }
        const response = await fetch(`https://jtk-reimbursement-app-back-end.azurewebsites.net/reimbursement/${id}/${statusCode}`,
            {
                method: 'PATCH',
                body: JSON.stringify(reimbursementUpdate),
                headers: {
                    'Content-Type': "application/json"
                }
            })
        if (response.status !== 200) {
            alert(await response.text());
        }
        let r = await response.json();
        props.reimbArr[props.index] = r;
        props.setReimb([...props.reimbArr]);
    }

    return (<tr>
        <td>{account.fname}</td>
        <td>{account.lname}</td>
        <td>
            {formData ?
                <div className="nameFile" onClick={() => { setNameFile(nameFile ? false : true) }}>{nameFile !== true ? <ShowForm file={formData} nameFile={nameFile} setNameFile={setNameFile} /> : name}</div>
                : `${name}`
            }</td>
        <td>${amount.toLocaleString('en-US')}</td>
        <td>{status === "" ? <div className="containerAPDEN"><button onClick={() => { appDen('approved') }} className="apprBtn">Approve</button><button onClick={() => { appDen('denied') }} className="denBtn">Deny</button><input className="commentInput" ref={commentInput} placeholder="comments" /></div> :
            <div className="statCommentLabel" onMouseOver={() => { setsAndC(false) }}
                onMouseLeave={() => { setsAndC(true) }}>{sAndC !== true && statusComment ? statusComment : status}</div>}</td>
    </tr>)
}

//---------------------STATISTICS PAGE------------------------------------------//

export function StatisticsPage() {
    const [stat, setStat] = useState(null);

    async function getStats() {
        const response = await fetch(`https://jtk-reimbursement-app-back-end.azurewebsites.net/manager/statistics`);
        if (response.status === 200) {
            const stats: AccountStatistics[] = await response.json();
            setStat(stats);
        }
    }
    useEffect(() => {
        getStats();
    }, []);

    return (stat ? stat.length !== 0 ? <StatStuff stat={stat} /> : <h1>No Reimbursements Approved</h1>
        : <div className="loaderDefaultDiv"><GridLoader color="white" css={override} size={40} /></div>)
}

export function StatStuff(props: { stat: AccountStatistics[] }) {

    const [totAvg, setTotAvg] = useState({ tot: 0, avg: 0 });
    const [accIndvStat, setAccIndvStat] = useState(null);

    function accountIndvStats(e) {
        console.log(e.reimb);
        if (accIndvStat === null) {
            setAccIndvStat(e);
        }
        else if (accIndvStat != null && accIndvStat.accountID === e.accountID) {
            setAccIndvStat(null);
        }
        else if (accIndvStat != null && accIndvStat.accountID !== e.accountID) {
            setAccIndvStat(e);
        }

    }

    useEffect(() => {
        let tot = 0;
        let avg = 0;
        let counter = 0;
        for (const c of props.stat) {
            tot += c.totalAmount;
            counter += c.reimb.length;
        }
        avg = Number((tot / counter).toFixed(2));
        setTotAvg({ tot, avg });
    }, [props.stat]);


    return (<div className="containerStat">
        <h1 className="titleBar">Reimbursements Statistics</h1>
        <ul className='totAvg'><li>Total Cost of Reimbursements: {totAvg.tot}</li>
            <li>Average cost of Reimbursements: {totAvg.avg}</li>
        </ul>
        <BarChart className="barChart"
            width={580}
            height={380}
            layout='vertical'
            data={props.stat}
            margin={{
                top: -2,
                right: 0,
                left: -5,
                bottom: 5,
            }}>
            <XAxis type="number" />
            <YAxis type='category' dataKey="fname" />
            <Tooltip />
            <Legend verticalAlign="bottom" />
            <Bar dataKey="totalAmount" fill="#8884d8" onClick={accountIndvStats} />
        </BarChart>
        {accIndvStat ? <AreaChart
            width={700}
            height={400}
            data={accIndvStat.reimb}
            margin={{
                top: 2,
                right: 0,
                left: -5,
                bottom: 0,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type='category' />
            <YAxis type="number" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
        </AreaChart> : <></>}
    </div>)
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p>{`Name: ${label}`}</p>
                <p>{`Amount: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};
