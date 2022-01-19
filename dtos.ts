
export interface Reimbursement {
    name: string,
    amount: number,
    account: {
        fname: string
        lname: string
        id: string
    },
    id: string,
    status: string,
    statusComment?: string
}
