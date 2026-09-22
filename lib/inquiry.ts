import { departments } from "@/lib/site";

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

export type InquiryResult =
  | {
      status: "ready";
      to: string;
      subject: string;
      body: string;
      mailto: string;
    }
  | { status: "error"; errors: Record<string, string> };

const roles = [
  "Buyer",
  "Seller",
  "Real Estate Agent",
  "Lender",
  "Attorney",
  "Other",
] as const;

const helpOptions = [
  "Open a purchase order",
  "Open a refinance order",
  "Request a quote or pre-closing disclosure",
  "Question about an open file",
  "Post-closing, funding, or recording",
  "General question",
] as const;

export const inquiryOptions = { roles, helpOptions };

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function routeTo(input: InquiryInput) {
  if (input.intent === "order") return departments.orders.email;
  switch (input.help) {
    case "Open a purchase order":
    case "Open a refinance order":
      return departments.orders.email;
    case "Request a quote or pre-closing disclosure":
      return departments.preCd.email;
    case "Question about an open file":
      return departments.processing.email;
    case "Post-closing, funding, or recording":
      return departments.postClosing.email;
    default:
      return departments.general.email;
  }
}

export function prepareInquiry(input: InquiryInput): InquiryResult {
  const errors: Record<string, string> = {};
  const name = clean(input.name);
  const email = clean(input.email);
  const phone = clean(input.phone);
  const company = clean(input.company);
  const role = clean(input.role);
  const help = clean(input.help);
  const transaction = clean(input.transaction);
  const propertyState = clean(input.propertyState);
  const message = input.message.trim();

  if (input.honeypot) {
    return { status: "error", errors: { form: "This inquiry could not be prepared." } };
  }

  if (name.length < 2) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) errors.phone = "Enter a phone number with at least 10 digits.";
  if (!inquiryOptions.roles.includes(role as (typeof roles)[number])) {
    errors.role = "Select who you are.";
  }
  if (input.intent === "contact" && !inquiryOptions.helpOptions.includes(help as (typeof helpOptions)[number])) {
    errors.help = "Select how we can help.";
  }
  if (input.intent === "order" && !transaction) {
    errors.transaction = "Select a transaction type.";
  }
  if (input.intent === "order" && !propertyState) {
    errors.propertyState = "Select a property state.";
  }
  if (message.length < 12) {
    errors.message = "Add a short message so the right desk can respond.";
  }
  if (message.length > 4000) errors.message = "Keep the message under 4,000 characters.";
  if (!input.sensitiveAck) {
    errors.sensitiveAck =
      "Confirm that this message does not include sensitive financial information.";
  }

  if (Object.keys(errors).length) return { status: "error", errors };

  const to = routeTo({ ...input, help, intent: input.intent });
  const subject =
    input.intent === "order"
      ? `Title order request — ${transaction || "Transaction"}`
      : `Website inquiry — ${help || "General"}`;

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    company ? `Company: ${company}` : null,
    `I am a: ${role}`,
    input.intent === "order" ? `Transaction: ${transaction}` : `How can we help: ${help}`,
    input.intent === "order" ? `Property state: ${propertyState}` : null,
    "",
    message,
    "",
    "Sent from the Integrity Title Group website. No sensitive financial information was requested.",
  ].filter((line): line is string => line !== null);

  const body = lines.join("\n");
  const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return { status: "ready", to, subject, body, mailto };
}
