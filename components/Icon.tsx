import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export function Icon({
  icon,
  className = "text-base text-brass",
}: {
  icon: IconDefinition;
  className?: string;
}) {
  return <FontAwesomeIcon icon={icon} className={className} fixedWidth />;
}
