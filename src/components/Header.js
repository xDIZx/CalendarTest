// Header.js
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Typography,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Import the Arrow Down icon

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <InputBase
            placeholder="Search..."
            startAdornment={
              <IconButton>
                <SearchIcon sx={{ color: "#bcbccb" }} />
              </IconButton>
            }
            sx={{
              color: "#000",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "4px",
              padding: "0 8px",
              width: "250px",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ color: "#bcbccb" }}>
            <LocationOnIcon />
          </IconButton>
          <IconButton sx={{ color: "#bcbccb" }}>
            <ChatIcon />
          </IconButton>
          <IconButton sx={{ color: "#bcbccb" }}>
            <NotificationsIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: "16px",
              color: "#000",
            }}>
            <Typography variant="body1">Your Name</Typography>{" "}
            <ArrowDropDownIcon sx={{ color: "#000", marginLeft: "4px" }} />{" "}
            <img
              src="https://as2.ftcdn.net/v2/jpg/02/85/89/71/1000_F_285897164_Jj30xWSzaWVDktLZ2vqYU5fhu7HYWTrg.jpg" // Replace with your profile picture URL
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
