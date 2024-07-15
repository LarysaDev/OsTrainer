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
