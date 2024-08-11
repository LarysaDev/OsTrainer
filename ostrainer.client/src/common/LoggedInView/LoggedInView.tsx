import * as React from "react";
import AuthorizeView from "../../Components/AuthorizeView.tsx";
import { SidePanel, SidePanelLink } from "../../Components/SidePanel/SidePanel";
import styles from './LoggedInView.module.less';

export interface LoggedInFrameProps {
  links: SidePanelLink[];
  children: React.ReactNode;
}

export function LoggedInView(props: LoggedInFrameProps) {
  return (
    <>
      <AuthorizeView>
        <div className={styles.container}>
          <div style={{ width: "20%" }}>
            <SidePanel links={props.links} />
          </div>
          <div className={styles.main}>{props.children}</div>
        </div>
      </AuthorizeView>
    </>
  );
}
