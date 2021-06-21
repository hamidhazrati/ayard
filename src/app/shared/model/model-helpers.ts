export type PickId<T extends { id: string }> = Pick<T, 'id'>;
export type OmitId<T> = Omit<T, 'id'>;

export type AlertAction = 'approved' | 'rejected';
