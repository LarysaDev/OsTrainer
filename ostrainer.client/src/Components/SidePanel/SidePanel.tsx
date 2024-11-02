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
  { label: "Головна", link: "/" },
  { label: "Планування потоків", link: "/scheduling" },
  { label: "Заміщення сторінок", link: "/page-replacement" },
  { label: "Уникнення дедлоків", link: "/avoid-deadlocks" },
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
