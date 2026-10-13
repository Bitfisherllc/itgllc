const photos = [
  ["/images/library/eb9145c45d2a2fc4.webp?v=1790171951187", "People gathered around closing documents."],
  ["/images/library/5ad2c89736ae393c.webp?v=1790169951950", "Documents laid out for review."],
  ["/images/library/38bba04ee2884557.webp?v=1790171913527", "A conversation during a closing appointment."],
  ["/images/library/7fa93a317e89f462.webp?v=1790171728919", "Papers collected for a purchase file."],
  ["/images/library/08449683172dabca.webp?v=1790172809030", "A quiet review of a settlement file."],
  ["/images/library/f11c7ba42279c3df.webp", "The office team in a meeting."],
  ["/images/library/ba31d57346ecbbbf.webp?v=1790172651864", "A file moving through settlement."],
  ["/images/library/6e94145c53e096a6.webp", "A workspace prepared for a title file."],
];

function note(photo, post) {
  const [image, imageAlt] = photos[photo % photos.length];
  return {
    published: true,
    featured: false,
    date: "2026-10-13",
    updated: "",
    author: "Integrity Title Group",
    image,
    imageAlt,
    faqs: [],
    seoTitle: "",
    seoDescription: "",
    ...post,
  };
}

module.exports = [
  note(0, {
    slug: "what-a-title-company-does",
    title: "What Does a Title Company Actually Do When You Buy a House?",
    summary: "A title company researches the property, prepares the closing papers, and coordinates the settlement. Here is what that work looks like on a purchase.",
    category: "homebuyers",
    featured: true,
    answer: "A title company helps a purchase move from an accepted contract to a completed closing by researching the property’s ownership, preparing the settlement documents, and coordinating the signing. Integrity Title Group does that work from its office in Nottingham, Maryland.",
    sections: [
      {
        heading: "The search comes first",
        paragraphs: [
          "After an order is opened, the file is assigned to a processor. The search looks at the recorded history of the property so the parties can see what the public record shows about ownership.",
          "A purchase order needs the sale agreement. Send it when you open the order so the processor is not waiting on the document that starts the file.",
        ],
      },
      {
        heading: "The file is built around the contract",
        paragraphs: [
          "The processor works from the contract, the parties, and the lender’s instructions. Questions about a name, a payoff, or a missing page are easier to answer while the file is still open.",
          "Integrity Title Group does not decide who is right in a dispute. The office prepares the file and tells the parties what the search and the instructions show.",
        ],
        note: "This note describes how the office works. It is not legal advice, and it is not a promise about a particular property.",
      },
      {
        heading: "Closing is the signing, not the whole job",
        paragraphs: [
          "On closing day the parties sign the documents the file requires. The settlement team coordinates that appointment.",
          "After the signing, post-closing handles recording and the remaining items on the file. A question about a recorded document or a disbursement belongs with that desk.",
        ],
      },
    ],
    faqs: [
      { question: "Do I need a sale agreement to open a purchase?", answer: "Yes. A purchase order needs the sale agreement before the file can be built." },
      { question: "Where is the office?", answer: "Integrity Title Group works from 8098 Sandpiper Circle, Suite X, Nottingham, Maryland 21236. The phone number is 443.725.7020." },
    ],
  }),
  note(1, {
    slug: "what-happens-on-closing-day",
    title: "What Happens on Closing Day? A Step-by-Step Guide for Homebuyers",
    summary: "Closing day is the appointment to sign. The file, the lender, and the contract decide what is on the table.",
    category: "homebuyers",
    answer: "On closing day you review and sign the documents for your purchase, confirm the figures on the closing statement, and complete the items the lender and the contract require. The appointment is the signing. Recording and the remaining file work follow it.",
    sections: [
      {
        heading: "Before you sit down",
        paragraphs: [
          "Bring a government-issued photo ID. If the file asks for anything else, the office will say so before the appointment.",
          "Read the closing statement ahead of time when you have it. Questions about a figure are easier to settle before the signing starts.",
        ],
      },
      {
        heading: "What the appointment covers",
        paragraphs: [
          "You will be asked to sign the documents in the file. The settlement team can point to what each signature is for. The team does not give legal advice about whether you should sign.",
          "Funds are handled according to the closing statement and the lender’s instructions. Bring the form of payment the office requested, if any funds are due from you.",
        ],
        items: ["Government-issued photo ID", "Any funds the office asked you to bring", "Questions you wrote down while reading the statement"],
      },
      {
        heading: "After you sign",
        paragraphs: [
          "Signing does not finish every step. The deed and the other documents that must be recorded are sent for recording after the file is in order to do that.",
          "If you have a question after you leave, call the office. Post-closing handles the items that remain on the file.",
        ],
      },
    ],
    faqs: [
      { question: "How long is the appointment?", answer: "It depends on the file. A straightforward signing is a sitting. A file with extra documents takes longer." },
      { question: "Can I ask what a document is?", answer: "Yes. Ask during the appointment. For advice about whether the document is right for you, talk with your own attorney." },
    ],
  }),
  note(2, {
    slug: "how-long-does-it-take-to-close",
    title: "How Long Does It Take to Close on a House?",
    image: "/images/library/2d87b957aec54f74.jpg",
    imageAlt: "A title representative shakes hands with buyers outside the Integrity Title Group office. One buyer holds a folder that reads Just Closed.",
    summary: "The contract date and the lender’s conditions set the pace. The title file moves once the order is open and the sale agreement is in hand.",
    category: "homebuyers",
    answer: "There is no single number of days. The purchase contract sets a closing date, and the lender’s conditions, the search, and any items the search turns up all affect whether that date holds.",
    sections: [
      {
        heading: "The date on the contract is the plan",
        paragraphs: [
          "The parties agree to a closing date in the contract. That date is the plan the file is built toward. It is not a guarantee that every condition will be finished on that morning.",
          "Integrity Title Group does not publish an average closing time. Each file is different.",
        ],
      },
      {
        heading: "What has to be in place",
        paragraphs: [
          "A purchase needs the sale agreement. The processor also needs the parties’ information and the lender’s instructions when a lender is involved.",
          "A missing payoff, a name that does not match the record, or a document the lender still needs can move the date. The office will say what the file is waiting on.",
        ],
      },
      {
        heading: "How to keep the file moving",
        paragraphs: [
          "Answer the processor’s questions when they arrive. Send the sale agreement with the order. Ask for a pre-closing disclosure if you want the figures before the appointment.",
          "If the date has to change, the parties and the lender decide that. The title company coordinates the file. It does not rewrite the contract.",
        ],
      },
    ],
    faqs: [
      { question: "Can the office promise a closing date?", answer: "No. The contract and the lender’s conditions control the date. The office works the file toward the date the parties set." },
      { question: "What should I send first?", answer: "The sale agreement, the parties’ names, and the property address. A lender file also needs the lender’s instructions." },
    ],
  }),
  note(3, {
    slug: "what-is-title-insurance",
    title: "What Is Title Insurance, and Do You Really Need It?",
    summary: "Title insurance is a policy against covered title defects. Whether a policy is part of your file depends on the contract, the lender, and the coverage the parties choose.",
    category: "homebuyers",
    answer: "Title insurance is a policy that can protect against covered problems in the property’s title, such as a recorded claim the search did not clear. A lender often requires a loan policy. An owner’s policy is a separate choice the parties make in the transaction.",
    sections: [
      {
        heading: "A search and a policy are different",
        paragraphs: [
          "The title search reads the public record and reports what it shows. A title insurance policy is coverage for certain defects, subject to the policy’s terms and exceptions.",
          "Integrity Title Group coordinates the search and the policy the file calls for. The policy itself is issued by the underwriter named in the file, under that underwriter’s terms.",
        ],
      },
      {
        heading: "Lender coverage and owner coverage",
        paragraphs: [
          "A loan policy protects the lender’s interest, up to the policy’s terms. It does not take the place of an owner’s policy.",
          "Whether you are asked to buy an owner’s policy depends on the contract and the parties. Read the commitment before closing so you can see the exceptions.",
        ],
        note: "This is a general description. The policy, the commitment, and your own attorney are the sources for what a specific file covers.",
      },
      {
        heading: "What a premium is not",
        paragraphs: [
          "There is no single price for title insurance on this site. The premium depends on the property, the price, and the coverage chosen.",
          "Ask the office for a quote, or request a pre-closing disclosure, if you want the figures for your file.",
        ],
      },
    ],
    faqs: [
      { question: "Does a loan policy protect me as the owner?", answer: "A loan policy protects the lender’s interest under its terms. An owner’s policy is separate." },
      { question: "Where do I see the exceptions?", answer: "On the title commitment prepared for the file. Read it before the signing and ask about anything you do not understand." },
    ],
  }),
  note(4, {
    slug: "who-chooses-the-title-company",
    title: "Who Chooses the Title Company: The Buyer, Seller, or Realtor?",
    image: "/images/library/85eb6347a16b2e2e.jpg",
    imageAlt: "Three people from the Integrity Title Group office hold folders labeled Closing Documents and Final Settlement Statement.",
    summary: "The contract and local practice decide who selects the title company. There is no single rule that fits every transaction.",
    category: "homebuyers",
    answer: "The purchase contract and local practice decide who selects the title company. In some transactions the buyer chooses, in some the seller chooses, and in some the parties agree through their agents. Integrity Title Group does not claim a right to be selected.",
    sections: [
      {
        heading: "Look at the contract",
        paragraphs: [
          "The contract is the place that names the title or settlement company, or that says who may choose one. If the contract is silent, the parties and their agents decide.",
          "A realtor can recommend a company. The recommendation is not the same thing as a term of the contract.",
        ],
      },
      {
        heading: "What the title company does not decide",
        paragraphs: [
          "The office does not choose itself, and it does not tell the parties they must use a particular company.",
          "If you want Integrity Title Group on a file, the person with authority under the contract can open the order or ask the office to prepare a quote.",
        ],
      },
      {
        heading: "Opening the order",
        paragraphs: [
          "An order can be started from the contact page or by calling 443.725.7020. A purchase still needs the sale agreement.",
          "Quotes for a file can also be started from the quote button on this site, which opens the office’s quote tool.",
        ],
      },
    ],
    faqs: [
      { question: "Can my agent pick the company?", answer: "Only if the contract gives the agent or that party the choice. Read the contract or ask your agent who has the selection." },
      { question: "Can I request a quote before the contract names a company?", answer: "Yes. A quote is not an order. The order starts when the parties open the file." },
    ],
  }),
  note(5, {
    slug: "documents-to-bring-to-closing",
    title: "What Documents Do You Need to Bring to a Real Estate Closing?",
    image: "/images/library/4fd25ae22a4b2490.jpg",
    imageAlt: "A title representative reviews a folder with two people outside a house. The sign behind them reads Sold.",
    summary: "Bring a government-issued photo ID. The office will tell you if the file needs anything else before you arrive.",
    category: "homebuyers",
    answer: "Bring a current government-issued photo ID. If you owe funds, bring them in the form the office requested. The rest of the documents are already in the file. The office will contact you if something else is required.",
    sections: [
      {
        heading: "Identification",
        paragraphs: [
          "Every signer needs identification the notary can accept. A current driver’s license or passport is the usual document. Bring the original, not a photograph of it.",
          "The name on the ID should match the name on the documents. Tell the office before the appointment if it does not.",
        ],
      },
      {
        heading: "Funds, if you owe them",
        paragraphs: [
          "The closing statement shows whether you need to bring funds. The office will say how those funds must be paid. A personal check is not always acceptable.",
          "Confirm the amount and the form of payment before the day of the signing so the appointment is not held up at the table.",
        ],
      },
      {
        heading: "What you can leave at home",
        paragraphs: [
          "You do not need to bring the deed to the property or a copy of every contract page if those items are already in the file.",
          "If a lender, an attorney, or the processor asked you for a specific document, bring that document. Otherwise, ask before you gather a stack of papers.",
        ],
      },
    ],
    faqs: [
      { question: "What if my ID is expired?", answer: "Call the office before the appointment. An expired ID may not be acceptable for the notarization." },
      { question: "Can someone sign for me?", answer: "Only with authority the file can accept, such as a power of attorney the lender and the office have approved in advance. Do not assume a relative can sign." },
    ],
  }),
  note(6, {
    slug: "what-are-closing-costs",
    title: "What Are Closing Costs, and Who Pays Them?",
    summary: "Closing costs are the charges on the closing statement. Who pays each charge is set by the contract, the lender, and the statement — not by a single rule.",
    category: "homebuyers",
    answer: "Closing costs are the charges collected at settlement, including title, recording, and lender charges that apply to the file. Who pays a given charge depends on the contract and the lender’s instructions. The closing statement is the list for that transaction.",
    sections: [
      {
        heading: "The statement is the list",
        paragraphs: [
          "The closing statement itemizes the charges and shows which side of the transaction pays each one. Read it before the appointment.",
          "Integrity Title Group can prepare a pre-closing disclosure so you can see the title and settlement figures before closing day.",
        ],
      },
      {
        heading: "There is no universal split",
        paragraphs: [
          "Some contracts place a charge on the buyer. Some place it on the seller. A lender’s fee belongs to the loan, under the lender’s own disclosures.",
          "This site does not publish a price list or a standard split. The figures for your file are on your statement.",
        ],
        note: "A charge on one transaction is not a quote for the next one.",
      },
      {
        heading: "How to ask about a line",
        paragraphs: [
          "If a line on the statement is unclear, ask the processor or the settlement team before you sign. Bring the question to the appointment if it is still open.",
          "For tax treatment of a charge, ask your tax adviser. The title company prepares the statement. It does not give tax advice.",
        ],
      },
    ],
    faqs: [
      { question: "Can I see the figures early?", answer: "Ask for a pre-closing disclosure. It is prepared from the file as it stands, and it can change if the file changes." },
      { question: "Are title charges the same as lender charges?", answer: "No. Lender charges come from the loan. Title and settlement charges come from the title file. Both can appear on the same statement." },
    ],
  }),
  note(7, {
    slug: "close-without-being-there",
    title: "Can You Close on a House Without Being There in Person?",
    summary: "Some signings can be arranged away from the office. Whether yours can depends on the file, the lender, and the state.",
    category: "homebuyers",
    answer: "Sometimes. A signer who cannot come to the Nottingham office may be able to sign elsewhere, if the file, the lender, and the notarization the documents require all allow it. Ask before the closing date. Do not assume a remote signing is available.",
    sections: [
      {
        heading: "Ask about the file you have",
        paragraphs: [
          "Tell the office as soon as you know you cannot attend. The settlement team can say whether the documents can be signed away from the office.",
          "A lender may require a particular kind of signing. The title company follows that instruction.",
        ],
      },
      {
        heading: "Authority still has to be real",
        paragraphs: [
          "A power of attorney is not automatic. The document has to be acceptable to the lender and usable for the notarization. Send it early so it can be reviewed.",
          "A friend or relative cannot sign your name because you are traveling.",
        ],
      },
      {
        heading: "The rest of the closing still happens",
        paragraphs: [
          "Funds, the closing statement, and recording do not go away because a signer is elsewhere. The file still has to be complete.",
          "Call 443.725.7020 and ask for the settlement team if you need to plan a signing away from the office.",
        ],
      },
    ],
    faqs: [
      { question: "Is a video signing always allowed?", answer: "No. It depends on the documents, the lender, and the notarization those documents require." },
      { question: "When should I say I cannot attend?", answer: "As soon as you know. A last-minute request may not be possible for that appointment." },
    ],
  }),
  note(0, {
    slug: "what-a-title-company-does-for-the-seller",
    title: "What Does a Title Company Do for the Seller?",
    summary: "For a seller, the title file clears the path from an accepted offer to a signed deed and the disbursement the statement shows.",
    category: "home-sellers",
    answer: "For a seller, the title company searches the property, coordinates payoffs and the deed, prepares the seller’s side of the closing statement, and handles the signing. After closing, post-closing finishes recording and the remaining disbursement items.",
    sections: [
      {
        heading: "The search includes the seller’s side",
        paragraphs: [
          "The search looks for recorded matters that affect the sale, including liens and judgments that show in the record. If something appears, the processor will ask the seller for information.",
          "A matter on the search is not automatically a reason the sale fails. It is an item the file has to address.",
        ],
      },
      {
        heading: "Payoffs and the deed",
        paragraphs: [
          "If a mortgage or another lien has to be paid from the sale, the processor orders the payoff and places it on the statement. The figures change if the payoff changes.",
          "The seller signs the deed and the other seller documents at the appointment. Bring identification, and tell the office early if a signer cannot attend.",
        ],
      },
      {
        heading: "Proceeds are on the statement",
        paragraphs: [
          "The seller’s proceeds are the amount the closing statement shows after the charges and payoffs on that file. The office does not quote a seller’s net from a conversation.",
          "Questions after the signing about a disbursement go to post-closing.",
        ],
      },
    ],
    faqs: [
      { question: "Do I need to be at the buyer’s signing?", answer: "Not always. The office will tell you whether the seller’s documents can be signed separately." },
      { question: "Who orders the mortgage payoff?", answer: "The processor orders it for the file. You can help by providing the lender’s name and the loan number." },
    ],
  }),
  note(1, {
    slug: "after-you-accept-an-offer",
    title: "What Happens After You Accept an Offer on Your House?",
    summary: "The accepted contract is the start of the file. The title order, the search, and the lender’s work follow it.",
    category: "home-sellers",
    answer: "After you accept an offer, the sale agreement should be sent to the title company so the order can be opened. The processor starts the search, requests payoffs, and builds the closing statement toward the date in the contract.",
    sections: [
      {
        heading: "Send the agreement",
        paragraphs: [
          "A purchase file needs the sale agreement. If you or your agent has accepted an offer, that document is what the processor works from.",
          "Open the order from the contact page or by calling the office. Include the property address and the parties’ names.",
        ],
      },
      {
        heading: "What the seller is asked for",
        paragraphs: [
          "Expect questions about mortgages, liens, marital status, and anyone else who may need to sign the deed. Answer them when they arrive.",
          "If you have an existing survey, a trust, or a power of attorney, tell the processor at the start.",
        ],
      },
      {
        heading: "The closing date is still a plan",
        paragraphs: [
          "The date in the contract is the target. The buyer’s lender, the search, and any payoff can affect it.",
          "The title company keeps the parties informed about what the file is waiting on. It does not control the buyer’s loan approval.",
        ],
      },
    ],
    faqs: [
      { question: "Should I wait for the buyer’s lender before opening the title order?", answer: "No. The search can start from the sale agreement. Waiting only shortens the time available before the contract date." },
      { question: "Who do I call with a question about the file?", answer: "Call 443.725.7020 and ask for the processor on the file. The contact page lists the desks." },
    ],
  }),
  note(2, {
    slug: "selling-a-house-with-a-lien",
    title: "Can You Sell a House if There Is a Lien Against It?",
    summary: "A recorded lien does not answer the question by itself. The file has to show what the lien is and how the contract treats it.",
    category: "home-sellers",
    answer: "A recorded lien does not automatically stop a sale, and it does not automatically allow one. The title search identifies what is of record. Whether the sale can close depends on the lien, the payoff, and the contract. This is not a legal opinion about your property.",
    sections: [
      {
        heading: "Find out what the record shows",
        paragraphs: [
          "The search reports liens, judgments, and other recorded matters that appear for the property or the owners. The processor will tell you what the search found.",
          "Bring any letter, payoff, or release you already have. Do not rely on a verbal assurance that a lien was paid.",
        ],
      },
      {
        heading: "Payment and releases",
        paragraphs: [
          "Many liens are paid from the seller’s proceeds at closing, if a reliable payoff is available and the numbers work on the statement.",
          "A release that was never recorded can still appear as an open item. The processor will say what the file needs in order to address it.",
        ],
        note: "Questions about whether a lien is valid, or whether you owe it, belong with your attorney. The title company works from the record and the payoff.",
      },
      {
        heading: "Talk to the office about the file",
        paragraphs: [
          "If you already know about a lien, say so when the order is opened. Early notice leaves more time before the contract date.",
          "Call the office about a specific property. A general article cannot tell you that your sale can close.",
        ],
      },
    ],
    faqs: [
      { question: "Will a lien always be paid at closing?", answer: "Only if the file has a payoff and the statement can support it. Some matters need a release or another document instead." },
      { question: "Should I call an attorney?", answer: "Yes, if you need advice about your rights or about whether a claim is valid. The title company does not give that advice." },
    ],
  }),
  note(3, {
    slug: "what-can-delay-a-closing",
    title: "What Can Delay a Real Estate Closing?",
    summary: "A closing date slips when the file is waiting on a document, a payoff, a lender condition, or a person who has to sign.",
    category: "home-sellers",
    answer: "A closing is delayed when something the file needs is not ready. Common holds are a missing sale agreement, an unfinished lender condition, a payoff that has not arrived, a name that does not match the record, or a signer who is unavailable.",
    sections: [
      {
        heading: "Items the title file can see",
        paragraphs: [
          "The processor can see missing documents, open search items, and payoffs that have not come back. Those are the holds the office can name.",
          "Send the sale agreement with the order, and answer questions the day they are asked.",
        ],
        items: [
          "Sale agreement not yet in the file",
          "Payoff requested but not received",
          "A name, marital status, or trust that does not match the record",
          "A signer who has not planned to attend",
        ],
      },
      {
        heading: "Items outside the title file",
        paragraphs: [
          "A lender condition, an appraisal, or a repair the contract requires can move the date even when the title work is finished.",
          "The title company does not control those items. It can tell you whether the title file itself is ready.",
        ],
      },
      {
        heading: "What to do when the date moves",
        paragraphs: [
          "The parties and the lender agree on a new date. The office then moves the signing to match.",
          "Ask the processor what the file is still waiting on, so the next date is based on the open item rather than a guess.",
        ],
      },
    ],
    faqs: [
      { question: "Does a delay mean the search found a defect?", answer: "Not necessarily. Many delays are a missing document or a lender condition." },
      { question: "Who do I call?", answer: "The processor on the file. The phone number is 443.725.7020." },
    ],
  }),
  note(4, {
    slug: "when-sellers-receive-proceeds",
    title: "How Long Does It Take to Receive Your Money After Selling a House?",
    summary: "Seller proceeds are disbursed according to the closing statement, the lender, and the recording requirements on that file.",
    category: "home-sellers",
    answer: "There is no single number of days. Proceeds are sent according to the closing statement once the file is in a position to disburse. A lender requirement or a recording requirement can hold funds. Ask post-closing about your file rather than relying on a general timeline.",
    sections: [
      {
        heading: "The statement shows the amount",
        paragraphs: [
          "The amount is the seller’s figure on the closing statement, after payoffs and charges. It is not a number the office estimates by phone before the statement exists.",
          "Review the statement before you sign so the figure is not a surprise.",
        ],
      },
      {
        heading: "What can hold the funds",
        paragraphs: [
          "A wire that was not set up, a payoff that changed, or a document that still has to be recorded can hold disbursement.",
          "Give the office your wiring instructions the way the office asks for them. Do not email new wiring instructions because someone called you. Confirm a change by calling the office at 443.725.7020.",
        ],
        note: "Fraudulent wiring instructions are a known risk in real estate. Confirm any change with the office by phone before money moves.",
      },
      {
        heading: "After the signing",
        paragraphs: [
          "Post-closing is the desk for a question about a disbursement that has not arrived.",
          "The office will not promise a day count in this article. The file controls the timing.",
        ],
      },
    ],
    faqs: [
      { question: "Can I pick up a check at the signing?", answer: "Only if the file is ready to disburse that way. Ask the settlement team before the appointment." },
      { question: "Who handles a missing wire?", answer: "Post-closing. Use the contact page or call the office and ask for that desk." },
    ],
  }),
  note(5, {
    slug: "when-a-title-search-finds-a-problem",
    title: "What Happens if a Title Search Finds a Problem?",
    summary: "A search result is an item to resolve, not an automatic end to the sale. The processor tells the parties what the record shows.",
    category: "home-sellers",
    answer: "If the search finds a problem, the processor tells the parties what appeared in the record and what the file needs next. Some items are cleared with a payoff or a recorded release. Some need the parties or their attorneys. The finding is not, by itself, a decision that the sale is over.",
    sections: [
      {
        heading: "You will be told what was found",
        paragraphs: [
          "The processor does not leave a search item unexplained. You should receive a description of the matter and the document or payoff the file is missing.",
          "Ask questions until you understand what was found. For advice about your legal position, call your attorney.",
        ],
      },
      {
        heading: "Common ways an item is addressed",
        paragraphs: [
          "A mortgage is usually addressed with a payoff. A lien may need a payoff or a release. A name difference may need an explanation or a corrective document.",
          "The right fix depends on the matter. The office will say what it needs. It will not invent a cure that the record does not support.",
        ],
      },
      {
        heading: "The contract still governs the sale",
        paragraphs: [
          "Whether a buyer or seller must proceed, extend, or end the contract is a question for the parties and their advisers. The title company does not make that decision.",
          "Keep the processor informed if the parties agree to more time, so the signing is not left on the old date.",
        ],
      },
    ],
    faqs: [
      { question: "Does a problem mean I cannot sell?", answer: "Not by itself. It means the file has an open item. Some items are resolved before the contract date. Some are not." },
      { question: "Will the office give me legal advice about the defect?", answer: "No. The office reports the record and the documents the file needs. Legal advice comes from your attorney." },
    ],
  }),
  note(6, {
    slug: "what-realtors-should-expect",
    title: "What Realtors Should Expect From a Great Title Company",
    summary: "A useful title company opens the file quickly, says what is missing, and returns calls while the contract date is still real.",
    category: "real-estate-professionals",
    answer: "Realtors should expect a named processor, a clear list of what the file is missing, and a response while there is still time to act. Integrity Title Group assigns the file to a processor, a settlement coordinator, and post-closing, and each desk can be reached at 443.725.7020.",
    sections: [
      {
        heading: "A person, not a shared inbox only",
        paragraphs: [
          "The file is assigned. You should be able to ask who has it and reach that person or their desk.",
          "Orders, pre-closing disclosures, and post-closing questions also have their own mailboxes, listed on the contact page.",
        ],
      },
      {
        heading: "Status you can repeat to a client",
        paragraphs: [
          "A useful update names the open item. “Waiting on the payoff” is a status. “We’re working on it” is not.",
          "Ask for a pre-closing disclosure when your client wants the figures before the appointment.",
        ],
      },
      {
        heading: "What the office will not do",
        paragraphs: [
          "The office will not give your client legal advice, and it will not promise a closing date the lender or the contract does not support.",
          "It will tell you when the title file is ready and what it is still waiting on.",
        ],
      },
    ],
    faqs: [
      { question: "How do I open an order?", answer: "Use the contact page or call the office. Send the sale agreement with a purchase order." },
      { question: "Can my client see the figures early?", answer: "Request a pre-closing disclosure. It reflects the file at the time it is prepared." },
    ],
  }),
  note(7, {
    slug: "responsive-settlement-and-realtors",
    title: "How a Responsive Settlement Company Helps Realtors Close on Time",
    summary: "A closing stays on the contract date more often when the open item is named early enough for the parties to act.",
    category: "real-estate-professionals",
    answer: "A responsive settlement company helps a realtor close on time by naming the open item early, returning calls, and coordinating the signing once the file is ready. The company does not control the lender’s approval or the parties’ contract.",
    sections: [
      {
        heading: "Early beats urgent",
        paragraphs: [
          "A payoff ordered the week the contract is accepted is more useful than a payoff ordered the day before closing.",
          "Send the sale agreement when you open the order. Tell the processor about a trust, an estate, or an out-of-town signer at the start.",
        ],
      },
      {
        heading: "One status for everyone",
        paragraphs: [
          "The buyer’s agent, the seller’s agent, and the lender should hear the same open item. Mixed messages create their own delay.",
          "Integrity Title Group keeps that status with the processor assigned to the file.",
        ],
      },
      {
        heading: "The signing is scheduled when the file is ready",
        paragraphs: [
          "The settlement team sets the appointment once the documents and the figures are in a position to sign.",
          "If a lender condition is still open, the appointment should wait. Signing a file that is not ready does not make the contract date.",
        ],
      },
    ],
    faqs: [
      { question: "Who schedules the appointment?", answer: "The settlement team, once the file is ready to sign. Call the office and ask for settlement." },
      { question: "What if the lender is still conditioning the loan?", answer: "Tell the processor. The title file can be ready while the loan is not. The signing waits on the loan." },
    ],
  }),
  note(0, {
    slug: "common-title-problems",
    title: "The 7 Most Common Title Problems That Delay Real Estate Closings",
    summary: "These are the title-file problems the office sees most often. Each one is an item to clear, not a verdict on the property.",
    category: "real-estate-professionals",
    answer: "The problems that most often hold a title file are a missing sale agreement, an open mortgage payoff, a lien or judgment, a name that does not match, a missing signer or authority document, an estate or trust, and a legal description that does not match the deed. None of these is legal advice about a specific property.",
    sections: [
      {
        heading: "Seven items that hold files",
        paragraphs: [
          "Any one of these can use up the days before a contract date. Most of them are faster to handle when the processor knows on the first call.",
        ],
        items: [
          "The sale agreement is not in the file.",
          "A mortgage payoff has been requested and has not come back.",
          "A lien or judgment appears in the search.",
          "The seller’s name does not match the record.",
          "A required signer is unavailable, or a power of attorney has not been reviewed.",
          "The owner is a trust or an estate and the authority documents are missing.",
          "The legal description or the property details do not match the last deed.",
        ],
      },
      {
        heading: "What the agent can send early",
        paragraphs: [
          "The contract, the loan numbers, the trust or estate papers, and any release the seller says was already signed.",
          "A document the seller remembers is not the same as a document that was recorded.",
        ],
      },
      {
        heading: "How the office reports them",
        paragraphs: [
          "The processor names the item and the document needed. The parties and their attorneys decide how a legal dispute is resolved.",
          "If you want the list for a live file, call the processor. This article is the general pattern, not your client’s search.",
        ],
      },
    ],
    faqs: [
      { question: "Are these defects in the title?", answer: "Some are. A missing contract is not a title defect. A recorded lien may be. The search is what identifies the recorded items." },
      { question: "Can the office clear a judgment without the parties?", answer: "No. The office can say what the record shows and what document or payoff is missing." },
    ],
  }),
  note(1, {
    slug: "title-companies-and-realtors",
    title: "How Title Companies and Realtors Work Together",
    summary: "The realtor manages the client and the contract. The title company manages the file. The work overlaps at the documents and the closing date.",
    category: "real-estate-professionals",
    answer: "Realtors and the title company work together by sharing the contract, the parties’ information, and the status of the open items. The realtor advises the client on the transaction. The title company prepares the title file and the settlement. Neither replaces the other.",
    sections: [
      {
        heading: "Who holds which part",
        paragraphs: [
          "The realtor negotiates and explains the contract to the client. The title company does not negotiate the sale.",
          "The title company searches the property, prepares the statement, and coordinates the signing. The realtor does not prepare the title commitment.",
        ],
      },
      {
        heading: "The handoff that matters",
        paragraphs: [
          "The useful handoff is the sale agreement, sent when the offer is accepted, with the parties’ names and the property address.",
          "Later handoffs are the items the processor requests: a payoff contact, a trust document, or a corrected name.",
        ],
      },
      {
        heading: "Through closing and after",
        paragraphs: [
          "The settlement team coordinates the appointment with the agents. Post-closing remains available for recording and disbursement questions.",
          "Qualia is the office’s secure portal for file communication when the file is set up there. Sign-in is separate from this website.",
        ],
      },
    ],
    faqs: [
      { question: "Should the agent collect legal advice from the title company?", answer: "No. The office explains the file. Legal advice for the client comes from the client’s attorney." },
      { question: "Where do agents send an order?", answer: "Through the contact page, by phone, or to the orders mailbox listed on the contact page." },
    ],
  }),
  note(2, {
    slug: "why-communication-matters",
    title: "Why Communication Matters During the Closing Process",
    summary: "A file stays on track when every party hears the same open item, in time to do something about it.",
    category: "real-estate-professionals",
    answer: "Communication matters because a closing date leaves a fixed number of days to collect documents, payoffs, and signatures. A message that names the missing item gives the parties a chance to act. A message that arrives after the appointment does not.",
    sections: [
      {
        heading: "Name the item",
        paragraphs: [
          "“We need the payoff” is a complete update. The recipient knows what to chase. A general assurance does not tell anyone what to do next.",
          "Integrity Title Group expects its processors to be specific about what the file is waiting on.",
        ],
      },
      {
        heading: "Use the desk that has the file",
        paragraphs: [
          "Processing questions go to the processor. Signing questions go to settlement. Questions after recording or about a disbursement go to post-closing.",
          "The contact page lists those desks and their email addresses. The phone number for the office is 443.725.7020.",
        ],
      },
      {
        heading: "Confirm money by phone",
        paragraphs: [
          "Wiring instructions are a favorite target of fraud. If you receive a change by email or text, call the office at the number you already have before anyone sends money.",
          "Do not use a phone number that arrived in the same message as the new instructions.",
        ],
      },
    ],
    faqs: [
      { question: "Who should be copied on a status?", answer: "The agents and the lender contact on the file, so everyone sees the same open item." },
      { question: "What if I cannot reach the processor?", answer: "Call the office number and ask for the processing desk. Leave the file number or the property address." },
    ],
  }),
  note(3, {
    slug: "prepare-clients-for-closing-day",
    title: "How to Prepare Your Clients for a Smooth Closing Day",
    summary: "Clients do better at the signing when they have seen the statement, brought the right ID, and know what the appointment is for.",
    category: "real-estate-professionals",
    answer: "Prepare clients by walking through the closing statement, confirming the photo ID, and explaining that the appointment is for signing the documents in the file. Tell them to ask questions at the table, and to call their own attorney if they want legal advice before they sign.",
    sections: [
      {
        heading: "The day before",
        paragraphs: [
          "Confirm the time, the place, and who has to attend. If a signer cannot attend, the office needs to know before the appointment, not in the lobby.",
          "Ask the client to read the closing statement and to write down any line they do not understand.",
        ],
        items: [
          "Current government-issued photo ID for every signer",
          "Funds in the form the office specified, if funds are due",
          "The questions they wrote down from the statement",
        ],
      },
      {
        heading: "What to tell them the appointment is",
        paragraphs: [
          "It is the signing of the documents the file requires. It is not a second negotiation of the contract, and it is not a legal consultation.",
          "The settlement team will identify the documents. The team does not tell a client whether the deal is a good one.",
        ],
      },
      {
        heading: "After they leave",
        paragraphs: [
          "Tell clients that recording and disbursement follow the signing, and that post-closing is the desk for those questions.",
          "Give them the office number, 443.725.7020, rather than asking them to wait for a call that may not be necessary.",
        ],
      },
    ],
    faqs: [
      { question: "Should clients bring the whole contract?", answer: "Only if they were asked to. The file already has the sale agreement. ID and any required funds matter more." },
      { question: "Can a client sign if they disagree with a figure?", answer: "They should stop and ask before signing. Signing is the time to raise the question, not the drive home." },
    ],
  }),
];
