import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowsRotate,
  faBookOpen,
  faBuilding,
  faBuildingColumns,
  faCalculator,
  faCheck,
  faCircleQuestion,
  faClipboardList,
  faEllipsis,
  faComments,
  faEnvelope,
  faFax,
  faFont,
  faFileContract,
  faFileLines,
  faFileSignature,
  faFolderOpen,
  faFolderPlus,
  faHandshake,
  faImages,
  faHeadset,
  faHouse,
  faHouseUser,
  faKey,
  faListCheck,
  faLocationDot,
  faLock,
  faMagnifyingGlass,
  faMapLocationDot,
  faNewspaper,
  faPenNib,
  faPhone,
  faScaleBalanced,
  faShieldHalved,
  faStamp,
  faUserTie,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const serviceIcons: Record<string, IconDefinition> = {
  "title-and-settlement": faScaleBalanced,
  "purchase-transactions": faHouse,
  "refinance-transactions": faArrowsRotate,
  "title-processing": faFolderOpen,
  "closing-and-settlement": faFileSignature,
  "post-closing": faStamp,
  quotes: faCalculator,
  "secure-portal": faShieldHalved,
};

export const resourceIcons: Record<string, IconDefinition> = {
  faq: faCircleQuestion,
  glossary: faFont,
  search: faMagnifyingGlass,
  "what-is-title-insurance": faBookOpen,
  "what-to-expect-at-closing": faListCheck,
  buyers: faHouseUser,
  sellers: faKey,
  "real-estate-agents": faUserTie,
  lenders: faBuildingColumns,
};

export const audienceIcons: Record<string, IconDefinition> = {
  buyers: faHouseUser,
  sellers: faKey,
  refinance: faArrowsRotate,
  agents: faUserTie,
  lenders: faBuildingColumns,
};

export const pillarIcons = [faCheck, faLock, faComments] as const;
export const reasonIcons = [faHandshake, faMagnifyingGlass, faHeadset, faCheck] as const;
export const stepIcons = [faFolderPlus, faMagnifyingGlass, faClipboardList, faPenNib, faStamp] as const;
export const teamIcons = [faHeadset, faFolderOpen, faStamp] as const;
export const orderIcons = [faFileContract, faHouse, faCalculator, faShieldHalved] as const;

/** Solid house with a heart cut into the front. */
export const faHouseHeart: IconDefinition = {
  prefix: "fas",
  iconName: "house-heart",
  icon: [
    512,
    512,
    [],
    "e1b0",
    "M256 56L440 216h-40v232H112V216H72L256 56zM168 286Q168 352 256 418Q344 352 344 286A44 44 0 0 0 256 286A44 44 0 0 0 168 286z",
  ],
};

export const pageIcons = {
  about: faBuilding,
  team: faUsers,
  services: faScaleBalanced,
  contact: faPhone,
  coverage: faMapLocationDot,
  resources: faBookOpen,
  articles: faNewspaper,
  order: faFolderPlus,
  other: faEllipsis,
  library: faImages,
  inquiries: faEnvelope,
} as const;

export { faEnvelope, faFax, faFileLines, faLocationDot, faLock, faPhone };

export function iconFor(map: Record<string, IconDefinition>, key: string) {
  return map[key] ?? faFileLines;
}
