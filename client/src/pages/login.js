import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin, login } from "../redux/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import logoImg from "../images/UniBook.png";

const Login = () => {
    const initialState = { email: "", password: "" };
    const [userData, setUserData] = useState(initialState);
    const [userType, setUserType] = useState(false);
    const { email, password } = userData;
    const [typePass, setTypePass] = useState(false);

    const { auth } = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.token) navigate("/");
    }, [auth.token, navigate]);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userType) {
            dispatch(login(userData));
        } else {
            dispatch(adminLogin(userData));
        }
    };

    return (
        <div className="auth_page">
            <div className="auth_card">
                <div className="auth_logo">
                    <img src={logoImg} alt="UniBook" className="auth_logo_img" />
                    <h1 className="auth_logo_text">UniBook</h1>
                    <p className="auth_tagline">Share your passions. Connect with others.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="auth_field">
                        <label htmlFor="login-email" className="auth_label">
                            Email
                        </label>
                        <div className="auth_input_wrap">
                            <input
                                type="email"
                                className="auth_input"
                                id="login-email"
                                placeholder="you@example.com"
                                onChange={handleChangeInput}
                                value={email}
                                name="email"
                            />
                        </div>
                        <p className="auth_help">We'll never share your email with anyone else.</p>
                    </div>
                    <div className="auth_field">
                        <label htmlFor="login-password" className="auth_label">
                            Password
                        </label>
                        <div className="auth_input_wrap">
                            <input
                                type={typePass ? "text" : "password"}
                                className="auth_input"
                                id="login-password"
                                placeholder="••••••••"
                                onChange={handleChangeInput}
                                value={password}
                                name="password"
                            />
                            <button
                                type="button"
                                className="auth_pass_toggle"
                                onClick={() => setTypePass(!typePass)}
                                aria-label={typePass ? "Hide password" : "Show password"}
                            >
                                {typePass ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <div className="auth_toggle_group">
                        <div className="auth_toggle_option">
                            <input
                                type="radio"
                                id="login-user"
                                name="login-role"
                                checked={!userType}
                                onChange={() => setUserType(false)}
                            />
                            <label htmlFor="login-user">User</label>
                        </div>
                        <div className="auth_toggle_option">
                            <input
                                type="radio"
                                id="login-admin"
                                name="login-role"
                                checked={userType}
                                onChange={() => setUserType(true)}
                            />
                            <label htmlFor="login-admin">Admin</label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="auth_submit"
                        disabled={!email || !password}
                    >
                        Sign in
                    </button>
                    <p className="auth_footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
