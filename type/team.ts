export interface TeamMember {
    id: number;
    name: string;
    amount: number;
    payment_date: string;
    paid: boolean;
    jersey_number: string | null;
    note: string | null;
}

export interface TeamFinanceSummary {
    total_members: number;
    paid_count: number;
    unpaid_count: number;
    total_collected: number;
    total_outstanding: number;
}

export interface TeamFinanceResponse {
    success: boolean;
    members: TeamMember[];
    summary: TeamFinanceSummary;
}

export interface TeamAuthResponse {
    success: boolean;
    message: string;
    token: string;
    admin: {
        id: number;
        name: string;
    };
}
