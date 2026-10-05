import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../Avatar";
import NotifyModal from "../NotifyModal";

const Menu = () => {
  const navLinks = [
    { label: "Home", icon: "home", path: "/" },
    { label: "Message", icon: "near_me", path: "/message" },
    { label: "Discover", icon: "explore", path: "/discover" },
  ];

  const { auth, theme, notify } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };

  return (
    <nav className="menu">
      <ul className="menu_nav">
        {navLinks.map((link, index) => (
          <li className={`menu_nav_item ${isActive(link.path)}`} key={index}>
            <Link className="menu_nav_btn" to={link.path}>
              <span className="material-icons menu_nav_icon">{link.icon}</span>
              <span className="menu_nav_label">{link.label}</span>
            </Link>
          </li>
        ))}

        <li className="menu_nav_item dropdown">
          <span
            className="menu_nav_btn menu_nav_btn_icon"
            id="navbarNotify"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className={`material-icons ${notify.data.length > 0 ? "menu_nav_icon_alert" : ""}`}>
              notifications
            </span>
            {notify.data.length > 0 && (
              <span className="menu_notify_badge">{notify.data.length}</span>
            )}
          </span>
          <div className="dropdown-menu menu_dropdown" aria-labelledby="navbarNotify">
            <NotifyModal />
          </div>
        </li>

        <li className="menu_nav_item dropdown">
          <span
            className="menu_nav_btn menu_nav_btn_avatar"
            id="navbarProfile"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Avatar src={auth.user.avatar} size="medium-avatar" />
          </span>
          <ul className="dropdown-menu menu_dropdown" aria-labelledby="navbarProfile">
            <li>
              <Link className="menu_dropdown_item" to={`/profile/${auth.user._id}`}>
                Profile
              </Link>
            </li>
            <li>
              <label
                htmlFor="theme"
                className="menu_dropdown_item"
                onClick={() =>
                  dispatch({ type: GLOBALTYPES.THEME, payload: !theme })
                }
              >
                {theme ? "Light mode" : "Dark mode"}
              </label>
            </li>
            <li><hr className="menu_dropdown_divider" /></li>
            <li>
              <Link
                className="menu_dropdown_item menu_dropdown_item_danger"
                to="/"
                onClick={() => dispatch(logout())}
              >
                Logout
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
