import { getHydratedData } from '@/services/bootstrap';

export interface GovernmentAward {
  id: string;
  recipientName: string;
  amount: number;
  agency: string;
  description: string;
  startDate: string;
  awardType: 'contract' | 'grant' | 'loan' | 'other';
}

export interface SpendingSummary {
  awards: GovernmentAward[];
  totalAmount: number;
  periodStart: string;
  periodEnd: string;
  fetchedAt: Date;
}

export async function fetchRecentAwards(): Promise<SpendingSummary> {
  const hydrated = getHydratedData('spending') as {
    awards?: GovernmentAward[];
    totalAmount?: number;
    periodStart?: string;
    periodEnd?: string;
    fetchedAt?: number;
  } | undefined;

  if (hydrated?.awards?.length) {
    return {
      awards: hydrated.awards,
      totalAmount: hydrated.totalAmount ?? hydrated.awards.reduce((s, a) => s + a.amount, 0),
      periodStart: hydrated.periodStart ?? '',
      periodEnd: hydrated.periodEnd ?? '',
      fetchedAt: hydrated.fetchedAt ? new Date(hydrated.fetchedAt) : new Date(),
    };
  }

  return {
    awards: [],
    totalAmount: 0,
    periodStart: '',
    periodEnd: '',
    fetchedAt: new Date(),
  };
}

export function formatAwardAmount(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

export function getAwardTypeIcon(type: GovernmentAward['awardType']): string {
  switch (type) {
    case 'contract': return '📄';
    case 'grant': return '🎁';
    case 'loan': return '💰';
    default: return '📋';
  }
}
