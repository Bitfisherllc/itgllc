import { pageCopy } from "@/lib/page-copy";
import { formatAddress, site } from "@/lib/site";

export type LocationPage = {
  slug: string;
  state: string;
  title: string;
  description: string;
  lede: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export function locationSlug(state: string) {
  return state
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function locationPages(states: string[] = pageCopy.coverage.states): LocationPage[] {
  return states.filter(Boolean).map(buildLocation);
}

export function getLocation(slug: string, states: string[] = pageCopy.coverage.states) {
  return locationPages(states).find((location) => location.slug === slug) ?? null;
}

function buildLocation(state: string): LocationPage {
  const written = copyFor(state);
  return { slug: locationSlug(state), state, ...written };
}

function copyFor(state: string): Omit<LocationPage, "slug" | "state"> {
  const office = formatAddress();
  const phone = site.phone;
  const pages: Record<string, Omit<LocationPage, "slug" | "state">> = {
    Maryland: {
      title: "Maryland title work from the Nottingham office",
      description:
        "Integrity Title Group opens, processes, and records Maryland purchase and refinance files from its office in Nottingham.",
      lede: "Maryland is the home state. The people who open the file and the people who record it sit in the same Nottingham office.",
      sections: [
        {
          heading: "The desk is in the state",
          paragraphs: [
            `The office is at ${office}. A Maryland purchase or refinance does not leave that address for another branch. Client care, processing, and post-closing are all reached there.`,
            "Buyers, sellers, agents, and lenders use the same phone number. There is no county desk and no separate Maryland hotline.",
          ],
        },
        {
          heading: "Bring the contract with the order",
          paragraphs: [
            "On a Maryland purchase, the sale agreement should arrive with the request. Processing should not have to chase the contract before the file can start.",
            "A refinance is opened on that same desk. It is not queued behind purchases or handed to a different team.",
          ],
        },
        {
          heading: "Recording is still a Nottingham job",
          paragraphs: [
            "Signing is not the end of a Maryland file. Post-closing keeps funding, recording, and the document audit.",
            `Call ${phone} to open an order or to ask for a pre-closing disclosure while you are still comparing fees.`,
          ],
        },
      ],
    },
    Pennsylvania: {
      title: "Opening a Pennsylvania title order",
      description:
        "Pennsylvania purchase and refinance orders are accepted at Integrity Title Group’s Nottingham office and assigned to a processor there.",
      lede: "A Pennsylvania property does not need a Pennsylvania storefront. The order is opened in Nottingham and stays with the processor named on the file.",
      sections: [
        {
          heading: "What to send when you open it",
          paragraphs: [
            "Send the Pennsylvania purchase with the sale agreement attached. That contract is what client care uses to start the file, and what the processor reads first.",
            "If you are refinancing Pennsylvania property, say so in the order. The file is opened as a refinance, not relabeled later as a purchase.",
          ],
        },
        {
          heading: "The person who has the file",
          paragraphs: [
            "Client care answers until a processor is assigned. After that, questions about the Pennsylvania order belong to processing, including when the matter is complicated.",
            "Agents and lenders do not need a second introduction when the file moves from opening to processing. The assignment is the handoff.",
          ],
        },
        {
          heading: "Documents and the last mile",
          paragraphs: [
            "Exchange the Pennsylvania file’s documents in Qualia. That is the portal ITG uses so the contract, the lender, and the parties are not split across inboxes.",
            `Funding and recording are post-closing work. Reach the office at ${phone} rather than putting payment instructions in a website note.`,
          ],
        },
      ],
    },
    Virginia: {
      title: "Virginia purchases, refinances, and fee quotes",
      description:
        "Integrity Title Group handles Virginia purchase and refinance title orders from Nottingham and can prepare a pre-closing disclosure while fees are still being compared.",
      lede: "A Virginia file is either a purchase that starts with the contract or a refinance opened on purpose. Fee questions can be answered before either one moves ahead.",
      sections: [
        {
          heading: "Decide which order you are opening",
          paragraphs: [
            "A Virginia purchase is opened from the sale agreement. Without that contract, processing is waiting on the basic terms of the deal.",
            "A Virginia refinance is its own order. It is prepared for signing, funding, and recording with the same post-closing attention as a sale.",
          ],
        },
        {
          heading: "Compare the fees before the file runs",
          paragraphs: [
            "If you are still choosing a title company for Virginia property, ask for a pre-closing disclosure. That request is for comparison. It is not the same step as opening the order.",
            "Once you do open it, the disclosure desk is no longer the contact. The processor assigned to the Virginia file is.",
          ],
        },
        {
          heading: "Where the papers live",
          paragraphs: [
            `The office that holds the Virginia file is ${office}. Qualia is how lenders, agents, and clients pass documents for that closing.`,
            "Confirm any wiring instructions by phone. An email or a form message is not the way those numbers are verified.",
          ],
        },
      ],
    },
    Delaware: {
      title: "Delaware closings from the Nottingham office",
      description:
        "Delaware is part of Integrity Title Group’s published service area. Title and settlement for those properties are done from Nottingham, not from a Delaware branch.",
      lede: "Delaware orders are accepted. They are worked beside the Maryland files, by the same three teams, from the only office the company keeps.",
      sections: [
        {
          heading: "No Delaware branch to visit",
          paragraphs: [
            `There is no Delaware address on this site. The office that will have the file is ${office}. Plan calls and document delivery around that desk.`,
            "A Delaware purchase still begins with the sale agreement. A Delaware refinance is opened as a refinance. The state of the property does not create a fourth team.",
          ],
        },
        {
          heading: "Three teams, in order",
          paragraphs: [
            "Client care takes the Delaware request and opens it. Processing then owns the open order. Post-closing takes the file after the parties sign.",
            "If you call about a Delaware file, name the stage. An unopened order, an assigned file, and a signed closing are three different desks.",
          ],
        },
        {
          heading: "After the Delaware signing",
          paragraphs: [
            "Post-closing funds, records, and audits the documents. That work does not return to the processor who handled the open order.",
            `The phone number for every Delaware stage is ${phone}.`,
          ],
        },
      ],
    },
    "New Jersey": {
      title: "Who to call on a New Jersey file",
      description:
        "New Jersey title orders at Integrity Title Group start with client care in Nottingham. Open-file questions then go to the assigned processor.",
      lede: "The useful question on a New Jersey matter is who holds it today. The answer changes when the order is opened, and it changes again after signing.",
      sections: [
        {
          heading: "Before anyone is assigned",
          paragraphs: [
            "Client care is the first voice on a New Jersey purchase or refinance. This is the desk that opens the order and the desk that still has it if no processor has been named.",
            "On a purchase, include the New Jersey sale agreement in that first request. The contract is part of opening the file, not a follow-up.",
          ],
        },
        {
          heading: "Once the order has a processor",
          paragraphs: [
            "Processing is the contact for the open New Jersey file. Complicated matters stay with that assignment instead of being split off.",
            "Do not send a second copy of the question to the general inbox and hope both desks answer. Use the desk that has the file.",
          ],
        },
        {
          heading: "What the website form is not for",
          paragraphs: [
            "The contact form can start a conversation or an order. It is the wrong place for account numbers and wire instructions.",
            `Confirm payment instructions by calling ${phone}. Qualia remains the portal for exchanging the New Jersey closing documents themselves.`,
          ],
        },
      ],
    },
    Ohio: {
      title: "The path of an Ohio title file",
      description:
        "An Ohio purchase or refinance at Integrity Title Group moves from client care to an assigned processor, then to post-closing for funding and recording.",
      lede: "An Ohio order is easier to follow if you watch the stage, not the state. Opening, processing, and post-closing are three different jobs in Nottingham.",
      sections: [
        {
          heading: "Stage one: the order is opened",
          paragraphs: [
            "Client care opens the Ohio purchase or refinance. On a purchase, the sale agreement should already be in hand so this stage is not spent collecting the contract.",
            "If you only need a fee comparison, ask for a pre-closing disclosure and wait. That request should not be treated as an opened Ohio order.",
          ],
        },
        {
          heading: "Stage two: a processor has it",
          paragraphs: [
            "A processor is assigned and works the Ohio file. Questions about title, the open order, or a complicated matter go to that person.",
            "Lenders and agents add documents in Qualia while the file is in processing. The portal is the shared record, not a side folder.",
          ],
        },
        {
          heading: "Stage three: signing, then the rest",
          paragraphs: [
            "The parties sign, and the Ohio file leaves processing. Post-closing handles funding, recording, and a document audit.",
            `Call ${phone} and name the stage if you are not sure which desk still has the file.`,
          ],
        },
      ],
    },
    Kentucky: {
      title: "Kentucky files, including the complicated ones",
      description:
        "Integrity Title Group assigns a processor to each Kentucky purchase or refinance, including matters that are not routine, and keeps that assignment through the open order.",
      lede: "A Kentucky file that is messy does not get a different company. It gets a processor in Nottingham, and that processor keeps it.",
      sections: [
        {
          heading: "The assignment is the point",
          paragraphs: [
            "Every Kentucky order is assigned. The assignment is what tells you who can answer questions about the open file.",
            "Complicated Kentucky matters stay with the processor who has them. They are not parked in a general queue.",
          ],
        },
        {
          heading: "Purchases need the agreement first",
          paragraphs: [
            "If the Kentucky transaction is a purchase, the sale agreement comes with the opening request. The processor should see the contract at the start, not after the file number exists.",
            "A Kentucky refinance skips that contract and is still opened as its own order, with post-closing reserved for after the signing.",
          ],
        },
        {
          heading: "The office that will answer",
          paragraphs: [
            `${office} is the only Integrity Title Group office. Kentucky clients, agents, and lenders use that address and Qualia.`,
            `For a Kentucky file already in motion, call ${phone} and ask for the desk that matches the stage: opening, processing, or post-closing.`,
          ],
        },
      ],
    },
    Indiana: {
      title: "Indiana orders through funding and recording",
      description:
        "Integrity Title Group carries Indiana purchase and refinance files through signing, then funds, records, and audits them from the Nottingham post-closing desk.",
      lede: "An Indiana closing is not finished when the documents are signed. Funding, recording, and the document audit are a separate desk.",
      sections: [
        {
          heading: "Open it completely",
          paragraphs: [
            "An Indiana purchase opens with the sale agreement included. An Indiana refinance opens as a refinance. Either way, client care is the desk that creates the file.",
            "Processing takes the Indiana order once it exists. That is the contact for questions while the file is open, including matters that take longer than a routine closing.",
          ],
        },
        {
          heading: "What happens after the signatures",
          paragraphs: [
            "Post-closing, not the processor, handles funding and recording for the Indiana file. The same team audits the documents.",
            "Authorization and layered checks are part of that audit. A signed package sitting in email is not the recording.",
          ],
        },
        {
          heading: "How Indiana clients reach that desk",
          paragraphs: [
            `Call ${phone}. If the signing has already happened, say so. The call belongs with post-closing, not with the person who opened the order.`,
            "Share the Indiana documents through Qualia. Keep wire instructions on the phone.",
          ],
        },
      ],
    },
    "North Carolina": {
      title: "North Carolina purchase files for agents and parties",
      description:
        "Integrity Title Group opens North Carolina purchases when the sale agreement arrives, then uses Qualia so agents, lenders, and clients share one file.",
      lede: "A North Carolina purchase stalls when the contract arrives late. Send the sale agreement with the order so the Nottingham processor can start.",
      sections: [
        {
          heading: "For the agent sending the file",
          paragraphs: [
            "The useful North Carolina package is the order plus the sale agreement. Client care uses that contract to open the file. Processing uses it to work the file.",
            "Introductions and event requests are a different desk from the North Carolina order. A closing file should not be sent as a general note.",
          ],
        },
        {
          heading: "One place for the documents",
          paragraphs: [
            "Qualia is the portal for the North Carolina closing. Lenders, agents, and clients exchange documents there instead of keeping private sets.",
            `The people behind that portal are at ${office}. The portal does not replace a call to ${phone} when the question is about wires or which desk has the file.`,
          ],
        },
        {
          heading: "If the North Carolina file is a refinance",
          paragraphs: [
            "Say that it is a refinance when you open it. There is no sale agreement to attach, and the order should not be written as if there were.",
            "After signing, North Carolina recording and funding move to post-closing. The agent’s question at that point is no longer a processing question.",
          ],
        },
      ],
    },
    "South Carolina": {
      title: "South Carolina refinances and purchases",
      description:
        "A South Carolina refinance at Integrity Title Group is opened and closed with the same processing and post-closing attention as a South Carolina purchase.",
      lede: "South Carolina refinances are full files. They are not a shorter version of a purchase, and they are not worked by a leftover desk.",
      sections: [
        {
          heading: "Opening a refinance",
          paragraphs: [
            "Name the South Carolina order as a refinance at the start. Client care opens it that way. The processor receives a refinance, not a purchase with the contract missing.",
            "Fee comparisons still belong with a pre-closing disclosure. Opening the refinance and asking for a quote are separate requests.",
          ],
        },
        {
          heading: "Opening a purchase",
          paragraphs: [
            "A South Carolina purchase is the path that needs the sale agreement. Attach it. The Nottingham team should not open the file and then wait for the deal’s own contract.",
            "Processing keeps the purchase through the open order, including when the matter is complicated. The assignment does not expire because the file is difficult.",
          ],
        },
        {
          heading: "Both paths end at the same post-closing desk",
          paragraphs: [
            "Purchase or refinance, the South Carolina signing hands the file to post-closing for funding, recording, and the document audit.",
            `Call ${phone} from either path. Qualia is the shared document portal for both.`,
          ],
        },
      ],
    },
    Florida: {
      title: "Florida title orders from a Maryland office",
      description:
        "Florida is on Integrity Title Group’s published state list. Those purchase and refinance files are handled from Nottingham, with no Florida office.",
      lede: "Florida property is in the service area. The distance from Maryland does not create a local branch or a different set of teams.",
      sections: [
        {
          heading: "On the list, worked from Nottingham",
          paragraphs: [
            `Florida purchase and refinance orders are accepted at ${office}. That is the office that will open the file, assign a processor, and record it.`,
            "Do not look for a Florida street address. The published office is in Nottingham, and the phone number does not change because the property is in Florida.",
          ],
        },
        {
          heading: "How a Florida order should arrive",
          paragraphs: [
            "A Florida purchase arrives with the sale agreement. A Florida refinance arrives labeled as a refinance. Client care opens whichever one you actually have.",
            "While you are only comparing costs, request a pre-closing disclosure. That is not an opened Florida file.",
          ],
        },
        {
          heading: "A property that is not in Florida either",
          paragraphs: [
            "If the property is outside the states on the service locations page, call before you send the order. Partner help may exist. It is not a promise that the file can be opened.",
            `For a Florida file that is on the list, call ${phone}. Use Qualia for the documents, and the phone for wire instructions.`,
          ],
        },
      ],
    },
  };

  return (
    pages[state] ?? {
      title: `Title and settlement for ${state} property`,
      description: `Integrity Title Group handles ${state} purchase and refinance orders from its Nottingham, Maryland office at ${office}.`,
      lede: `${state} is on the published service list. Orders are opened in Nottingham.`,
      sections: [
        {
          heading: `Opening a ${state} order`,
          paragraphs: [
            `Purchase and refinance transactions for ${state} property are handled at ${office}. Call ${phone} to reach client care.`,
            "Include the sale agreement on a purchase. Ask for a pre-closing disclosure if you are still comparing fees.",
          ],
        },
      ],
    }
  );
}
