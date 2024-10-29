import * as React from "react";
import LogoutLink from "../../../Components/LogoutLink.tsx";
import AuthorizeView, {
  AuthorizedUser,
} from "../../../Components/AuthorizeView.tsx";
import styles from "./Dashboard.module.less";
import {
  SidePanel,
  SidePanelLink,
} from "../../../Components/SidePanel/SidePanel";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { AssignedCourses } from "../AssignedCourses/AssignedCourses.tsx";
import { courses } from "../AssignedCourses/dump.ts";

export const links: SidePanelLink[] = [
  { label: "Dashboard", link: "/", active: true },
  { label: "Scheduling", link: "/scheduling" },
  { label: "Page Replacement", link: "/page-replacement" },
  { label: "Avoiding Deadlocks", link: "/" },
  { label: "Assignments", link: "/" },
];

const studentName = "MY ACCOUNT";

export function StudentDashboard() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <AuthorizeView>
      <div className={styles.container}>
        <div style={{ width: "20%" }}>
          <SidePanel links={links} />
        </div>
        <div className={styles.main}>
          {/* Profile icon */}
          <div className={styles.profile}>
            <Stack direction="row" spacing={2}>
              <div>
                <Button
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={open ? "composition-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  {studentName}
                </Button>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom-start"
                            ? "left top"
                            : "left bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                            onKeyDown={handleListKeyDown}
                          >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>
                              My account
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <span>
                                <LogoutLink>
                                  Logout <AuthorizedUser value="email" />
                                </LogoutLink>
                              </span>
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            </Stack>
          </div>
          {/* End of profile icon */}
          {courses.length > 0 ? (
            <AssignedCourses />
          ) : (
            "You are not assigned to any courses"
          )}
        </div>
      </div>
    </AuthorizeView>
  );
}
