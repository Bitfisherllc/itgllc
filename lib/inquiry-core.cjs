const departments = {
  orders: "orders@ravents.com",
  preCd: "precd@ravents.com",
  processing: "processors@ravents.com",
  postClosing: "postclosing@ravents.com",
  general: "info@ravents.com",
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
  "New orders",
  "Post-closing",
  "Pre-closing disclosures",
  "Processing",
  "Events and introductions",
  "General",
];

const departmentKeys = ["orders", "postClosing", "preCd", "processing", "events", "general"];

const inquiryOptions = { roles, helpOptions };

function clean(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function routeTo(input, desks, choices) {
  if (input.intent === "order") return desks.orders;
  const key = departmentKeys[choices.indexOf(input.help)];
  return (key && desks[key]) || desks.general;
}

function prepareInquiry(input, routes) {
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
  const helpChoices =
    Array.isArray(routes?.helpOptions) && routes.helpOptions.length ? routes.helpOptions : helpOptions;
  if (input.intent === "contact" && !helpChoices.includes(help)) {
    errors.help = "Select a department.";
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

  const desks = {
    orders: routes?.orders || departments.orders,
    preCd: routes?.preCd || departments.preCd,
    processing: routes?.processing || departments.processing,
    postClosing: routes?.postClosing || departments.postClosing,
    events: routes?.events || "sales@ravents.com",
    general: routes?.general || departments.general,
  };
  const labels = {
    [desks.orders]: "New orders",
    [desks.preCd]: "Pre-closing disclosures",
    [desks.processing]: "Processing",
    [desks.postClosing]: "Post-closing",
    [desks.general]: "General",
  };
  const to = routeTo({ ...input, help, intent: input.intent }, desks, helpChoices);
  const topic = input.intent === "order" ? transaction : help;

  return {
    status: "ready",
    to,
    department: input.intent === "order" ? labels[to] || "New orders" : help,
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
