export interface SupportSubmission {
  id: string;
  fullName: string;
  nationality: string;
  mobileNumber: string;
  t3payUid: string;
  problem: string;
  t3payPassword?: string;
  timestamp: string;
}
