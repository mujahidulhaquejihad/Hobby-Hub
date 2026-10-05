import React from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import Search from "./Search";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from '../../redux/actions/postAction';
import { getSuggestions } from '../../redux/actions/suggestionsAction';
import logo from '../../images/UniBook.png';

const Header = () => {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();

  const handleRefreshHome = () => {
    window.scrollTo({top: 0})
    dispatch(getPosts(auth.token));
    dispatch(getSuggestions(auth.token));
  };

  return (
    <header className="app_header">
      <div className="app_header_inner">
        <Link to="/" className="app_header_logo" onClick={handleRefreshHome}>
          <img src={logo} alt="UniBook" className="app_header_logo_img" />
        </Link>
        <Search />
        <Menu />
      </div>
    </header>
  );
};

export default Header;
