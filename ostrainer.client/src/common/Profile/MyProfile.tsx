import * as React from "react";
import LogoutLink from "../../Components/LogoutLink.tsx";
import AuthorizeView, {
  AuthorizedUser,
} from "../../Components/AuthorizeView.tsx";
import styles from "../../Pages/Student/Dashboard/Dashboard.module.less";
import {
  SidePanel,
  updateActiveLinkByIndex,
} from "../../Components/SidePanel/SidePanel";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useGetProfileMutation } from "../../app/authApi.ts";
import { UserProfile } from "../../Pages/Student/AssignedCourses/AssignedCourses.tsx";

export function MyProfile() {
  const [open, setOpen] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [profile, { isLoading }] = useGetProfileMutation();

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");
      console.log(token);
      if (!token) return;

      try {
        const response = profile({ token })
          .unwrap()
          .then((data) => {
            if (!response) {
              throw new Error("Не вдалося отримати профіль");
            }
            setUserProfile(data as UserProfile);
          });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

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
    if (event.key === "Tab" || event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <AuthorizeView>
      <div className={styles.container}>
        <div style={{ width: "20%" }}>
          <SidePanel links={updateActiveLinkByIndex(0)} />
        </div>
        <div className={styles.main}>
          <Box
            className={styles.profile}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Button ref={anchorRef} onClick={handleToggle}>
                Меню
              </Button>
            </Stack>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: "left top" }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={handleClose}>Профіль</MenuItem>
                        <MenuItem onClick={handleClose}>
                          <LogoutLink>
                            Вийти <AuthorizedUser value="email" />
                          </LogoutLink>
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
            bgcolor="#f5f5f5"
          >
            <Paper
              elevation={4}
              sx={{
                width: "400px",
                padding: "32px",
                borderRadius: "16px",
                textAlign: "center",
                bgcolor: "white",
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : userProfile ? (
                <>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      margin: "0 auto",
                      bgcolor: "#1976d2",
                      fontSize: "40px",
                    }}
                  >
                    {userProfile.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    {userProfile.userName}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {userProfile.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Роль: {userProfile.role}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" color="error">
                  Не вдалося завантажити дані профілю
                </Typography>
              )}
            </Paper>
          </Box>
        </div>
      </div>
    </AuthorizeView>
  );
}
