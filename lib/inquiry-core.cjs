const departments = {
  orders: "orders@ravents.com",
  preCd: "precd@ravents.com",
  processing: "processors@ravents.com",
  postClosing: "postclosing@ravents.com",
  general: "info@ravents.com",
};

const departmentLabels = {
  [departments.orders]: "New orders",
  [departments.preCd]: "Pre-closing disclosures",
  [departments.processing]: "Processing",
  [departments.postClosing]: "Post-closing",
  [departments.general]: "General",
};

const roles = [
  "Buyer",
  "Seller",
  "Real Estate Agent",
  "Lender",
  "Attorney",
  "Other",
];

const helpOptions = [
  "Open a purchase order",
  "Open a refinance order",
  "Request a quote or pre-closing disclosure",
  "Question about an open file",
  "Post-closing, funding, or recording",
  "General question",
];

const inquiryOptions = { roles, helpOptions };

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function routeTo(input) {
  if (input.intent === "order") return departments.orders;
  switch (input.help) {
    case "Open a purchase order":
    case "Open a refinance order":
      return departments.orders;
    case "Request a quote or pre-closing disclosure":
      return departments.preCd;
    case "Question about an open file":
      return departments.processing;
    case "Post-closing, funding, or recording":
      return departments.postClosing;
    default:
      return departments.general;
  }
}

function prepareInquiry(input) {
  const errors = {};
  const name = clean(input.name);
  const email = clean(input.email);
  const phone = clean(input.phone);
  const company = clean(input.company);
  const role = clean(input.role);
  const help = clean(input.help);
  const transaction = clean(input.transaction);
  const propertyState = clean(input.propertyState);
  const message = String(input.message ?? "").trim();

  if (clean(input.honeypot)) {
    return { status: "error", errors: { form: "This inquiry could not be sent." } };
  }

  if (name.length < 2) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a phone number with at least 10 digits.";
  }
  if (!roles.includes(role)) errors.role = "Select who you are.";
  if (input.intent === "contact" && !helpOptions.includes(help)) {
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
  const topic = input.intent === "order" ? transaction : help;

  return {
    status: "ready",
    to,
    department: departmentLabels[to] || "General",
    inquiry: {
      intent: input.intent,
      departmentEmail: to,
      name,
      email,
      phone,
      company,
      role,
      topic,
      propertyState: input.intent === "order" ? propertyState : "",
      message,
    },
  };
}

module.exports = { inquiryOptions, prepareInquiry };
