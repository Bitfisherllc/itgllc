const homeContent = {
  heroEyebrow: "Integrity Title Group",
  heroHeadline: "Integrity at every closing.",
  heroLede:
    "Professional title and settlement services for purchase and refinance transactions — secure, accurate, and straightforward from the opened order through recording.",
  pillars: [
    {
      title: "Accurate",
      text: "Title orders are opened with the documents the file actually needs, starting with the sale agreement on a purchase.",
    },
    {
      title: "Secure",
      text: "Lenders, agents, and clients exchange documents through Qualia, the secure portal ITG uses for the closing.",
    },
    {
      title: "Responsive",
      text: "Client care, processing, and post-closing each have a desk, so a question reaches the people who have the file.",
    },
  ],
  servicesEyebrow: "Services",
  servicesHeading: "Title work, carried through recording.",
  servicesLede:
    "Real estate transactions turn on documents, deadlines, and funds. ITG stays with the file from the first order to the recording process.",
  audienceEyebrow: "Who we serve",
  audienceHeading: "The people at the closing table.",
  audiences: [
    {
      id: "buyers",
      label: "Home buyers",
      text: "A purchase file opens with the sale agreement. ITG’s client-care and processing teams use that contract to start the title order, then stay with the file through settlement.",
    },
    {
      id: "sellers",
      label: "Home sellers",
      text: "Sellers are part of the same purchase settlement. The sale agreement starts the order, and post-closing carries funding, recording, and the document audit after signing.",
    },
    {
      id: "refinance",
      label: "Homeowners refinancing",
      text: "Refinance orders are opened on their own. If you are still comparing fees, request a pre-closing disclosure before the file is treated as an opened order.",
    },
    {
      id: "agents",
      label: "Real estate agents",
      text: "Agents send purchase and refinance orders, with the sale agreement on a purchase. Qualia is the secure portal for documents once the file is underway.",
    },
    {
      id: "lenders",
      label: "Lenders",
      text: "Lenders share that same portal with agents and clients. Processing handles the open file, including complicated matters, and post-closing takes funding and recording.",
    },
  ],
  processEyebrow: "The closing process",
  processHeading: "From the opened order to recording.",
  steps: [
    {
      n: "01",
      title: "Order opened",
      text: "Client care opens a purchase or refinance order. On a purchase, the sale agreement should come with the request so processing is not waiting on basic information.",
    },
    {
      n: "02",
      title: "Title processing",
      text: "A processor is assigned and works the file, including complicated matters. Questions about the open order go to the processing desk.",
    },
    {
      n: "03",
      title: "Review and preparation",
      text: "The file is prepared for settlement. If you are still comparing fees, a pre-closing disclosure can be requested before the order moves ahead.",
    },
    {
      n: "04",
      title: "Closing",
      text: "The parties sign and the transaction is settled. The office remains available for questions through that signing.",
    },
    {
      n: "05",
      title: "Recording and completion",
      text: "Post-closing handles funding, recording, and a document audit, with authorization and layered verification.",
    },
  ],
  aboutEyebrow: "About ITG",
  aboutHeading: "Built around the file, not around noise.",
  aboutLead:
    "Integrity Title Group is a Maryland title and settlement office. The practice was shaped by real estate insiders, with more than 30 years of combined title experience, and the mission was written with clients in mind.",
  aboutBody:
    "Client care opens the relationship. Processing works the order. Post-closing carries funding, recording, and the document audit. That is the whole promise: a clear handoff, and someone accountable at each stage.",
  whyEyebrow: "Why ITG",
  whyHeading: "A quieter kind of confidence.",
  reasons: [
    {
      title: "Integrity",
      text: "The work is organized around the client’s transaction, with a first point of contact and a team that stays through recording.",
    },
    {
      title: "Attention to detail",
      text: "Purchase orders start with the sale agreement. Complicated files stay with processors who are assigned to them.",
    },
    {
      title: "Responsive service",
      text: "Each stage has an address: orders, processing, pre-closing disclosures, and post-closing. A question does not have to wander.",
    },
    {
      title: "Smooth closings",
      text: "The path is the same one the office already runs: open, process, sign, fund, and record — without extra ceremony.",
    },
  ],
  coverageEyebrow: "Where we work",
  coverageHeading: "Eleven states, one office.",
  coverageText:
    "Title and settlement services are offered in Maryland, Pennsylvania, Virginia, Delaware, Indiana, Ohio, Kentucky, North Carolina, South Carolina, Florida, and New Jersey. Help beyond that area may be available through partners. Call before you assume a property is covered.",
  ctaEyebrow: "Begin",
  ctaHeading: "Open the order, or ask the question first.",
  ctaText:
    "Send a purchase or refinance request, ask for a quote, or call 443.725.7020. Do not include account numbers or wire instructions in a website message.",
};

function text(value, fallback, max) {
  const cleaned = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!cleaned) return fallback;
  return cleaned.slice(0, max);
}

function paragraph(value, fallback, max) {
  const cleaned = String(value ?? "").trim();
  if (!cleaned) return fallback;
  return cleaned.slice(0, max);
}

function mergeHome(input) {
  const source = input && typeof input === "object" ? input : {};
  return {
    heroEyebrow: text(source.heroEyebrow, homeContent.heroEyebrow, 80),
    heroHeadline: text(source.heroHeadline, homeContent.heroHeadline, 140),
    heroLede: paragraph(source.heroLede, homeContent.heroLede, 500),
    pillars: homeContent.pillars.map((item, index) => ({
      title: text(source.pillars?.[index]?.title, item.title, 40),
      text: paragraph(source.pillars?.[index]?.text, item.text, 400),
    })),
    servicesEyebrow: text(source.servicesEyebrow, homeContent.servicesEyebrow, 40),
    servicesHeading: text(source.servicesHeading, homeContent.servicesHeading, 140),
    servicesLede: paragraph(source.servicesLede, homeContent.servicesLede, 500),
    audienceEyebrow: text(source.audienceEyebrow, homeContent.audienceEyebrow, 40),
    audienceHeading: text(source.audienceHeading, homeContent.audienceHeading, 140),
    audiences: homeContent.audiences.map((item, index) => ({
      id: item.id,
      label: text(source.audiences?.[index]?.label, item.label, 60),
      text: paragraph(source.audiences?.[index]?.text, item.text, 600),
    })),
    processEyebrow: text(source.processEyebrow, homeContent.processEyebrow, 40),
    processHeading: text(source.processHeading, homeContent.processHeading, 140),
    steps: homeContent.steps.map((item, index) => ({
      n: item.n,
      title: text(source.steps?.[index]?.title, item.title, 60),
      text: paragraph(source.steps?.[index]?.text, item.text, 600),
    })),
    aboutEyebrow: text(source.aboutEyebrow, homeContent.aboutEyebrow, 40),
    aboutHeading: text(source.aboutHeading, homeContent.aboutHeading, 140),
    aboutLead: paragraph(source.aboutLead, homeContent.aboutLead, 700),
    aboutBody: paragraph(source.aboutBody, homeContent.aboutBody, 700),
    whyEyebrow: text(source.whyEyebrow, homeContent.whyEyebrow, 40),
    whyHeading: text(source.whyHeading, homeContent.whyHeading, 140),
    reasons: homeContent.reasons.map((item, index) => ({
      title: text(source.reasons?.[index]?.title, item.title, 60),
      text: paragraph(source.reasons?.[index]?.text, item.text, 500),
    })),
    coverageEyebrow: text(source.coverageEyebrow, homeContent.coverageEyebrow, 40),
    coverageHeading: text(source.coverageHeading, homeContent.coverageHeading, 140),
    coverageText: paragraph(source.coverageText, homeContent.coverageText, 700),
    ctaEyebrow: text(source.ctaEyebrow, homeContent.ctaEyebrow, 40),
    ctaHeading: text(source.ctaHeading, homeContent.ctaHeading, 160),
    ctaText: paragraph(source.ctaText, homeContent.ctaText, 500),
  };
}

module.exports = { homeContent, mergeHome };
