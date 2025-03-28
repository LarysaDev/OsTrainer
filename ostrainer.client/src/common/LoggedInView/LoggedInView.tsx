import * as React from "react";
import AuthorizeView from "../../Components/AuthorizeView.tsx";
import { SidePanel, SidePanelLink } from "../../Components/SidePanel/SidePanel";
import styles from "./LoggedInView.module.less";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import LogoutLink from "../../Components/LogoutLink.tsx";
import { AuthorizedUser } from "../../Components/AuthorizeView.tsx";

export interface LoggedInFrameProps {
  links: SidePanelLink[];
  children: React.ReactNode;
}

export function LoggedInView(props: LoggedInFrameProps) {
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

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <AuthorizeView>
        <div className={styles.container}>
          <div style={{ width: "20%", position: 'sticky', top: 0, height: '100vh' }}>
            <SidePanel links={props.links} />
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
                    Мій профіль
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
                              <MenuItem onClick={() => window.location.href = "/profile"}>
                                Мій акаунт
                              </MenuItem>
                              <MenuItem onClick={handleClose}>
                                <span>
                                  <LogoutLink>
                                    Вийти <AuthorizedUser value="email" />
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
            {props.children}
          </div>
        </div>
      </AuthorizeView>
    </>
  );
}
