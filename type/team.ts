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

export interface TeamInfo {
    id: number;
    name: string;
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
    total_collected: number;
    total_outstanding: number;
    by_segment: SegmentStat[];
}

export interface TeamFinanceResponse {
    success: boolean;
    team: TeamInfo | null;
    next_match: NextMatch | null;
    segments: Record<string, string>;
    members: TeamMember[];
    summary: TeamFinanceSummary;
}

export interface TeamSettingsResponse {
    success: boolean;
    team: TeamInfo | null;
    next_match: NextMatch | null;
    segments: Record<string, string>;
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
