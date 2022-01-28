
export interface Reimbursement {
    name: string,
    amount: number,
    account: {
        fname: string,
        lname: string,
        id: string
    },
    id: string,
    status: string,
    statusComment?: string,
    formData,
}

export interface AccountStatistics {
    fname: string,
    lname: string,
    totalAmount: number,
    accountID: string,
    reimb: { name: string, amount: number }[]
}