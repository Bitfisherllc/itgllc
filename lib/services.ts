export type Service = {
  slug: string;
  title: string;
  summary: string;
  paragraphs: string[];
};

export const services: Service[] = [
  {
    slug: "title-and-settlement",
    title: "Title & Settlement",
    summary:
      "Title and settlement work for the life of a file, from the moment an order is opened through recording.",
    paragraphs: [
      "A real estate closing depends on title work that is careful and a settlement process that stays organized. Integrity Title Group handles title and settlement services for purchase and refinance transactions.",
      "The work is shared across three desks. Client care is the first point of contact. Processing takes the file once the order is open, including complicated matters. After signing, post-closing handles funding, recording, and document audits.",
      "The standard is straightforward: speed and accuracy, with a client-first approach from the opened order to the recording process.",
    ],
  },
  {
    slug: "purchase-transactions",
    title: "Purchase Transactions",
    summary:
      "Purchase orders opened with the sale agreement, so the file starts with the information the processing team needs.",
    paragraphs: [
      "Buying a home is often the largest investment in a transaction, and the title company chosen for the closing has a direct effect on how that closing goes. ITG opens purchase title orders for that work.",
      "Send the sale agreement with the new order. That gives the team enough information to open the file and reduces delays in processing.",
      "From there, a processor is assigned. Questions about the open order go to the processing desk. When the papers are signed, post-closing takes funding, recording, and the document audit.",
    ],
  },
  {
    slug: "refinance-transactions",
    title: "Refinance Transactions",
    summary:
      "Refinance title orders, handled with the same processing and post-closing attention as a purchase.",
    paragraphs: [
      "Refinancing is a distinct order type, and ITG accepts refinance title orders alongside purchases. The same teams stay with the file: client care to open it, processing once it is assigned, and post-closing after settlement.",
      "If you are still comparing closing fees, ask for a pre-closing disclosure before the order moves forward. That request has its own desk, separate from an opened file.",
      "After signing, funding and recording questions belong with post-closing, not with a general inbox.",
    ],
  },
  {
    slug: "title-processing",
    title: "Title Processing",
    summary:
      "Processors assigned to the file, equipped for complicated matters and available once the order is open.",
    paragraphs: [
      "Once a title order is received, processing takes over. The processors are equipped to handle complicated files and are the people to contact about the substance of an open order.",
      "Correspondence about an assigned file should go to the processing desk. That keeps questions with the person who has the order, rather than restarting the conversation at the front door.",
      "Processing sits between client care and post-closing. The handoff is intentional: open the order cleanly, work the file carefully, then move a settled transaction on to funding and recording.",
    ],
  },
  {
    slug: "closing-and-settlement",
    title: "Closing & Settlement",
    summary:
      "Settlement through signing, with the file prepared so the parties can close without unnecessary friction.",
    paragraphs: [
      "Settlement is the point where the papers are signed and the transaction is settled. ITG’s title and settlement work is built to reach that point with the file in order.",
      "Questions along the way are expected. There are many steps in a settlement, and the office is available during normal business hours to answer them. For the fastest response on a general question, call the published office number.",
      "Signing is not the end of the file. Funding, recording, and the document audit follow with the post-closing team, using authorization and layered verification.",
    ],
  },
  {
    slug: "post-closing",
    title: "Post-Closing, Funding & Recording",
    summary:
      "After signing, a dedicated team handles funding, recording, and document audits.",
    paragraphs: [
      "When the papers are signed and the transaction is settled, post-closing and funding take the file. The work includes funding, recording, and document audits.",
      "Clients receive that attention with authorization and multi-layered verification. Questions after closing should go to the post-closing desk so they stay with the people who have the recording and funding file.",
      "The path the company describes for itself runs from the opened title order to the recording process. Post-closing is how that last stretch is staffed.",
    ],
  },
  {
    slug: "quotes",
    title: "Quotes & Pre-Closing Disclosures",
    summary:
      "Fee quotes by phone or through the quote tool, and a pre-closing disclosure when you are comparing costs.",
    paragraphs: [
      "ITG provides quotes by phone and through the secure quote tool used for new inquiries. Choosing the title company is one of the decisions that shapes a closing, and a quote is the place to start.",
      "If you are shopping closing fees, request a pre-closing disclosure. That request is handled separately from an opened purchase or refinance order.",
      "A quote or disclosure is not a substitute for the title work on a specific property. Coverage, exceptions, and figures depend on the transaction itself.",
    ],
  },
  {
    slug: "secure-portal",
    title: "Secure Document Portal",
    summary:
      "Qualia is the secure portal ITG uses so lenders, agents, and clients can exchange documents in one place.",
    paragraphs: [
      "ITG uses Qualia as its preferred secure portal. It brings lenders, real estate agents, and clients onto one platform for the exchange of documents and information.",
      "The portal is part of how the office protects the information that moves with a closing. It is a working tool for the file, not a separate product line.",
      "Sensitive items such as wire instructions should still be confirmed by calling the office at the number published on this website. Do not rely on an unexpected email alone.",
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
