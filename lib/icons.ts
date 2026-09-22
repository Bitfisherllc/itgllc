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
  faComments,
  faEnvelope,
  faFax,
  faFileContract,
  faFileLines,
  faFileSignature,
  faFolderOpen,
  faFolderPlus,
  faHandshake,
  faHeadset,
  faHouse,
  faHouseUser,
  faKey,
  faListCheck,
  faLocationDot,
  faLock,
  faMagnifyingGlass,
  faMapLocationDot,
  faPenNib,
  faPhone,
  faScaleBalanced,
  faShieldHalved,
  faStamp,
  faUserTie,
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

export const pageIcons = {
  about: faBuilding,
  services: faScaleBalanced,
  contact: faPhone,
  coverage: faMapLocationDot,
  resources: faBookOpen,
  order: faFolderPlus,
} as const;

export { faEnvelope, faFax, faFileLines, faLocationDot, faLock, faPhone };

export function iconFor(map: Record<string, IconDefinition>, key: string) {
  return map[key] ?? faFileLines;
}
