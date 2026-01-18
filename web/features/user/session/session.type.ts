export interface Session {
    id: string;
    userId: string;
    tokenId: string;
    ipAddress: string;
    userAgent: string;
    isRevoked: boolean;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}