export type ResourceSection = {
  heading: string;
  paragraphs: string[];
};

export type Resource = {
  slug: string;
  title: string;
  summary: string;
  disclaimer: boolean;
  sections: ResourceSection[];
};

export const resources: Resource[] = [
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    summary:
      "Practical answers about orders, coverage, quotes, and who to contact at each stage of a file.",
    disclaimer: false,
    sections: [
      {
        heading: "How the office works",
        paragraphs: [
          "These answers reflect how Integrity Title Group opens, processes, and completes title and settlement files. They are not legal advice. For a specific transaction, call the office or write to the desk that holds the file.",
        ],
      },
    ],
  },
  {
    slug: "what-is-title-insurance",
    title: "What Is Title Insurance?",
    summary:
      "A plain-language overview of title insurance, and what this page does not decide for your transaction.",
    disclaimer: true,
    sections: [
      {
        heading: "The idea, in brief",
        paragraphs: [
          "Title insurance is a form of protection connected to rights in real property. In a purchase or refinance, parties often discuss an owner’s policy, a loan policy, or both. A policy is a contract. What it covers, what it excepts, and what it costs are set out in that contract and in the title work for the property — not in a general article.",
          "Title work looks at the public record and related materials for matters that can affect ownership or the lender’s interest: prior deeds, mortgages, liens, judgments, and other recorded items. The settlement then coordinates signing, funds, and recording according to the transaction.",
        ],
      },
      {
        heading: "What ITG does",
        paragraphs: [
          "Integrity Title Group provides title and settlement services for purchase and refinance transactions. This page does not describe a specific policy, underwriter, premium, or coverage decision. Those depend on the property, the parties, and the file.",
          "If you need figures while you are comparing closing costs, request a quote or a pre-closing disclosure. If an order is already open, the assigned processor is the right person for questions about that file.",
        ],
      },
    ],
  },
  {
    slug: "what-to-expect-at-closing",
    title: "What to Expect at Closing",
    summary:
      "How a file moves from an opened order through signing, funding, and recording.",
    disclaimer: true,
    sections: [
      {
        heading: "Before signing",
        paragraphs: [
          "A purchase order should include the sale agreement so the file can be opened with the information processing needs. A refinance is opened as its own order type. Client care is the first contact. Once a processor is assigned, questions about the open file go to processing.",
          "If you are still comparing fees and do not yet have an opened order, ask for a pre-closing disclosure rather than treating a quote as a completed title examination.",
        ],
      },
      {
        heading: "Signing and what follows",
        paragraphs: [
          "Closing is the settlement: the papers are signed and the transaction is settled. That is not the last step. Post-closing then handles funding, recording, and a document audit, with authorization and layered verification.",
          "Bring questions to the office before you arrive at signing. There are many steps in a settlement, and a call during business hours is the fastest way to get a general answer.",
        ],
      },
      {
        heading: "Payments and instructions",
        paragraphs: [
          "Do not send Social Security numbers, bank account numbers, or wire instructions through the website form. Confirm any payment instructions by calling the office at the phone number published on this website before money moves.",
        ],
      },
    ],
  },
  {
    slug: "buyers",
    title: "Buyer Resources",
    summary:
      "What buyers can prepare so a purchase file opens cleanly and stays on track.",
    disclaimer: true,
    sections: [
      {
        heading: "Opening the order",
        paragraphs: [
          "Purchase orders are opened when the sale agreement is sent with the request. Including that agreement at the start gives processing the information it needs and helps avoid delay.",
          "Your real estate agent or lender may send the order. You can also contact client care directly. Once a processor is assigned, use the processing desk for questions about the file.",
        ],
      },
      {
        heading: "Fees and documents",
        paragraphs: [
          "If you are comparing title and settlement charges before you commit, request a quote or a pre-closing disclosure. Documents for an open file are exchanged through Qualia, the secure portal ITG uses with agents, lenders, and clients.",
          "Nothing on this page tells you whether to buy, which policy to select, or how a figure on your disclosure should be read. Ask the office about your transaction.",
        ],
      },
    ],
  },
  {
    slug: "sellers",
    title: "Seller Resources",
    summary:
      "How a seller fits into a purchase file that begins with the sale agreement and ends at recording.",
    disclaimer: true,
    sections: [
      {
        heading: "Your place in the file",
        paragraphs: [
          "A purchase order starts with the sale agreement. That contract is what lets ITG open the title order with enough information to proceed. Sellers are part of that settlement: signing, payoff of existing liens where the transaction requires it, and the recording that follows.",
          "ITG does not publish a separate seller program or a list of seller guarantees. The settlement work is the same path used for the purchase: client care, processing, signing, then post-closing for funding, recording, and the document audit.",
        ],
      },
      {
        heading: "Who to contact",
        paragraphs: [
          "Before a processor is assigned, start with client care or the new-orders desk. After assignment, processing has the file. After signing, post-closing has funding and recording questions.",
          "Confirm any payoff or proceeds instructions by phone with the office. Do not treat an unexpected email as final wiring direction.",
        ],
      },
    ],
  },
  {
    slug: "real-estate-agents",
    title: "Real Estate Agent Resources",
    summary:
      "How agents open a purchase or refinance order and where each kind of question should go.",
    disclaimer: false,
    sections: [
      {
        heading: "Sending an order",
        paragraphs: [
          "New purchase and refinance orders go to the orders desk. For a purchase, include the sale agreement. That is the single most useful step for keeping processing from starting short of information.",
          "Qualia is the portal ITG uses with agents, lenders, and clients for documents on the file. It is the preferred place to exchange information once the order is underway.",
        ],
      },
      {
        heading: "The right desk",
        paragraphs: [
          "Quotes and fee comparisons, including a pre-closing disclosure, go to the pre-closing disclosure desk — not to an already assigned processor, and not mixed into a general note.",
          "Open-file questions go to processing after a processor is assigned. Funding, recording, and document audits go to post-closing. Event invitations and introductions go to the events desk.",
        ],
      },
    ],
  },
  {
    slug: "lenders",
    title: "Lender Resources",
    summary:
      "Order, disclosure, and post-closing contacts for lenders working a purchase or refinance file.",
    disclaimer: false,
    sections: [
      {
        heading: "Orders and disclosures",
        paragraphs: [
          "Lenders, agents, and clients share Qualia as the secure portal for documents. New purchase and refinance orders, including the sale agreement on a purchase, should go to the orders desk so the file can be opened completely.",
          "A pre-closing disclosure, when you are comparing closing fees, is requested separately. That keeps a shopping request from being treated as an opened order.",
        ],
      },
      {
        heading: "After the file is open",
        paragraphs: [
          "Assigned files are handled by processing, including complicated matters. After signing, post-closing takes funding, recording, and document audits, with authorization and layered verification.",
          "Use the department addresses published on the contact page so the message reaches the desk that has the file.",
        ],
      },
    ],
  },
];

export const faqs = [
  {
    question: "Where does ITG handle title and settlement work?",
    answer:
      "Integrity Title Group is based in Nottingham, Maryland, and offers title and settlement services in Maryland, Pennsylvania, Virginia, Delaware, Indiana, Ohio, Kentucky, North Carolina, South Carolina, Florida, and New Jersey. Through partner relationships, help outside those states may be possible. Call the office to ask about a specific property.",
  },
  {
    question: "How do I open a title order?",
    answer:
      "Send a purchase or refinance order to the new-orders desk. For a purchase, include the sale agreement so the file can be opened with the information processing needs. You can also call the office and request a quote.",
  },
  {
    question: "Can I get a quote before I open an order?",
    answer:
      "Yes. Quotes are available by phone and through the quote tool on the order page. If you are comparing closing fees, request a pre-closing disclosure from that desk.",
  },
  {
    question: "Who do I contact after a processor is assigned?",
    answer:
      "Use the processing desk for correspondence about the open order. Client care remains the first point of contact before a processor is assigned.",
  },
  {
    question: "What happens after signing?",
    answer:
      "Post-closing handles funding, recording, and document audits, with authorization and multi-layered verification. Questions on those items should go to the post-closing desk.",
  },
  {
    question: "How are documents exchanged?",
    answer:
      "Qualia is the secure portal ITG uses so lenders, real estate agents, and clients can exchange documents and information for the closing.",
  },
  {
    question: "Should I email financial account numbers?",
    answer:
      "No. Do not send Social Security numbers, bank account numbers, or wire instructions through the website form or a general email. Confirm payment instructions by calling the published office number.",
  },
] as const;

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
