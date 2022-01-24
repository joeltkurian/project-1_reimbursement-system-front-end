
import { useEffect, useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Text, AreaChart, CartesianGrid, Area, Label } from 'recharts';
import { AccountStatistics, Reimbursement } from "../../../dtos";

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

    const tableRows = props.reimbursement.map((r, i) => <ReimbursementRow key={r.id} reimb={r} setReimb={props.setReimbursement} reimbArr={props.reimbursement} index={i} />)
    // const tableRows = props.reimbursement.map(r => <ReimbursementRow key={r.id} {...r} />)

    async function GetAllReimbursements() {
        const accountId = sessionStorage.getItem("accountId");
        const response = await fetch(`http://localhost:5000/reimbursement/${accountId}/true`);
        const reimbursement: Reimbursement[] = await response.json();
        //console.log(reimbursement);
        props.setReimbursement(reimbursement);
    }

    useEffect(() => {
        GetAllReimbursements();
    }, []);

    if (props.reimbursement.length != 0) {
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

export function ReimbursementRow(props: { reimb: Reimbursement, setReimb: Function, reimbArr: Reimbursement[], index: number }) {
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
        if (response.status != 200) {
            alert(await response.text());
        }
        let r = await response.json();
        props.reimbArr[props.index] = r;
        props.setReimb([...props.reimbArr]);
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

//---------------------WORKING------------------------------------------//

export function StatisticsPage() {
    const [stat, setStat] = useState(null);

    async function getStats() {
        const response = await fetch(`http://localhost:5000/manager/statistics`);
        if (response.status === 200) {
            const stats: AccountStatistics[] = await response.json();
            setStat(stats);
        }
    }
    useEffect(() => {
        getStats();
    }, []);

    return (stat ? <StatStuff stat={stat} /> : <></>)
}

export function StatStuff(props: { stat: AccountStatistics[] }) {

    const [totAvg, setTotAvg] = useState({ tot: 0, avg: 0 });
    const [accIndvStat, setAccIndvStat] = useState(null);

    function accountIndvStats(e) {
        console.log(e.reimb);
        if (accIndvStat == null) {
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
        avg = tot / counter;
        setTotAvg({ tot, avg });
    }, [])
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
