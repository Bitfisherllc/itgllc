import { inquiryOptions as options, prepareInquiry as prepare } from "@/lib/inquiry-core.cjs";

export type InquiryIntent = "contact" | "order";

export type InquiryInput = {
  intent: InquiryIntent;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  help: string;
  transaction: string;
  propertyState: string;
  message: string;
  sensitiveAck: boolean;
  honeypot: string;
};

export type InquiryRecord = {
  intent: InquiryIntent;
  departmentEmail: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  topic: string;
  propertyState: string;
  message: string;
};

export type InquiryResult =
  | { status: "ready"; to: string; department: string; inquiry: InquiryRecord }
  | { status: "error"; errors: Record<string, string> };

export const inquiryOptions = options as {
  roles: readonly string[];
  helpOptions: readonly string[];
};

export function prepareInquiry(input: InquiryInput): InquiryResult {
  return prepare(input) as InquiryResult;
}
