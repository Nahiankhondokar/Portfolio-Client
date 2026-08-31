export interface TeamMember {
    id: number;
    name: string;
    amount: number;
    payment_date: string;
    paid: boolean;
    jersey_number: string | null;
    note: string | null;
    segment: string;
    added_by: string | null;
}

export interface TeamExpense {
    id: number;
    title: string;
    amount: number;
    expense_date: string;
    note: string | null;
    added_by: string | null;
}

export interface TeamInfo {
    id: number;
    name: string;
    previous_fund: number;
}

export interface NextMatch {
    id: number;
    name: string;
    match_time: string;
    location: string | null;
}

export interface SegmentStat {
    segment: string;
    label: string;
    count: number;
    collected: number;
    outstanding: number;
}

export interface TeamFinanceSummary {
    total_members: number;
    paid_count: number;
    unpaid_count: number;
    previous_fund: number;
    total_collected: number;
    total_outstanding: number;
    total_expenses: number;
    remaining_fund: number;
    by_segment: SegmentStat[];
}

export interface TeamFinanceResponse {
    success: boolean;
    team: TeamInfo | null;
    next_match: NextMatch | null;
    segments: Record<string, string>;
    expenses: TeamExpense[];
    members: TeamMember[];
    summary: TeamFinanceSummary;
}

export interface TeamSettingsResponse {
    success: boolean;
    team: TeamInfo | null;
    next_match: NextMatch | null;
    segments: Record<string, string>;
}

export interface TeamAdminSummary {
    total_members: number;
    paid_count: number;
    unpaid_count: number;
    total_collected: number;
    total_outstanding: number;
}

export interface TeamAdminListResponse {
    success: boolean;
    members: TeamMember[];
    summary: TeamAdminSummary;
}

export interface TeamExpenseSummary {
    total_expenses: number;
    remaining_fund: number;
}

export interface TeamExpenseListResponse {
    success: boolean;
    expenses: TeamExpense[];
    summary: TeamExpenseSummary;
}

export interface TeamAdminInfo {
    id: number;
    name: string;
    created_at: string;
    stats: {
        total_members: number;
        paid_count: number;
        unpaid_count: number;
        collected: number;
        outstanding: number;
    };
}

export interface TeamAdminsResponse {
    success: boolean;
    admins: TeamAdminInfo[];
}

export interface TeamFinanceDashboardResponse {
    success: boolean;
    team: TeamInfo | null;
    next_match: NextMatch | null;
    admins: TeamAdminInfo[];
    summary: {
        total_members: number;
        paid_count: number;
        unpaid_count: number;
        previous_fund: number;
        total_collected: number;
        total_outstanding: number;
        total_expenses: number;
        remaining_fund: number;
    };
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
