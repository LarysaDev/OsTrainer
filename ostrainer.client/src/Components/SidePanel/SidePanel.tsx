import * as React from "react";
import styles from "./SidePanel.module.less";

export interface SidePanelLink {
  label: string;
  link: string;
  active?: boolean;
}

interface SidePanelProps {
  links: SidePanelLink[];
}

export const links: SidePanelLink[] = [
  { label: "Dashboard", link: "/" },
  { label: "Scheduling", link: "/scheduling" },
  { label: "Page Replacement", link: "/page-replacement" },
  { label: "Avoiding Deadlocks", link: "/avoid-deadlocks" },
  { label: "Assignments", link: "/" },
];

export function updateActiveLinkByIndex(activeIndex: number): SidePanelLink[] {
  return links.map((link, index) => ({
    ...link,
    active: index === activeIndex
  }));
}

export const SidePanel: React.FC<SidePanelProps> = ({ links }) => {
  return (
    <div className={styles.continer}>
      <p className={styles.logo}>OS TRAINER</p>
      {links.map((link) => (
        <a  className={link.active ? styles.activeItem : styles.item} href={link.link}>{link.label}</a>
      ))}
    </div>
  );
};
