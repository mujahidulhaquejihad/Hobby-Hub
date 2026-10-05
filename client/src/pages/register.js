import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../redux/actions/authAction';
import logoImg from '../images/UniBook.png';

const Register = () => {
    const { auth, alert } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialState = { fullname: "", username: "", email: "", password: "", cf_password: "", gender: "male" };
    const [userData, setUserData] = useState(initialState);
    const { fullname, username, email, password, cf_password } = userData;

    const [typePass, setTypePass] = useState(false);
    const [typeCfPass, setTypeCfPass] = useState(false);

    useEffect(() => {
        if (auth.token) navigate("/");
    }, [auth.token, navigate]);

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(userData));
    };

    return (
        <div className="auth_page">
            <div className="auth_card">
                <div className="auth_logo">
                    <img src={logoImg} alt="UniBook" className="auth_logo_img" />
                    <h1 className="auth_logo_text">UniBook</h1>
                    <p className="auth_tagline">Join the community. Start sharing today.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="auth_field">
                        <label htmlFor="reg-fullname" className="auth_label">
                            Full name
                        </label>
                        <div className={`auth_input_wrap ${alert.fullname ? "auth_input_error" : ""}`}>
                            <input
                                type="text"
                                className="auth_input"
                                id="reg-fullname"
                                placeholder="Jane Doe"
                                onChange={handleChangeInput}
                                value={fullname}
                                name="fullname"
                            />
                        </div>
                        {alert.fullname && <p className="auth_error">{alert.fullname}</p>}
                    </div>
                    <div className="auth_field">
                        <label htmlFor="reg-username" className="auth_label">
                            Username
                        </label>
                        <div className={`auth_input_wrap ${alert.username ? "auth_input_error" : ""}`}>
                            <input
                                type="text"
                                className="auth_input"
                                id="reg-username"
                                placeholder="janedoe"
                                onChange={handleChangeInput}
                                value={username.toLowerCase().replace(/ /g, "")}
                                name="username"
                            />
                        </div>
                        {alert.username && <p className="auth_error">{alert.username}</p>}
                    </div>
                    <div className="auth_field">
                        <label htmlFor="reg-email" className="auth_label">
                            Email
                        </label>
                        <div className={`auth_input_wrap ${alert.email ? "auth_input_error" : ""}`}>
                            <input
                                type="email"
                                className="auth_input"
                                id="reg-email"
                                placeholder="you@example.com"
                                onChange={handleChangeInput}
                                value={email}
                                name="email"
                            />
                        </div>
                        {alert.email && <p className="auth_error">{alert.email}</p>}
                    </div>
                    <div className="auth_field">
                        <label htmlFor="reg-password" className="auth_label">
                            Password
                        </label>
                        <div className={`auth_input_wrap ${alert.password ? "auth_input_error" : ""}`}>
                            <input
                                type={typePass ? "text" : "password"}
                                className="auth_input"
                                id="reg-password"
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
                        {alert.password && <p className="auth_error">{alert.password}</p>}
                    </div>
                    <div className="auth_field">
                        <label htmlFor="reg-cf_password" className="auth_label">
                            Confirm password
                        </label>
                        <div className={`auth_input_wrap ${alert.cf_password ? "auth_input_error" : ""}`}>
                            <input
                                type={typeCfPass ? "text" : "password"}
                                className="auth_input"
                                id="reg-cf_password"
                                placeholder="••••••••"
                                onChange={handleChangeInput}
                                value={cf_password}
                                name="cf_password"
                            />
                            <button
                                type="button"
                                className="auth_pass_toggle"
                                onClick={() => setTypeCfPass(!typeCfPass)}
                                aria-label={typeCfPass ? "Hide password" : "Show password"}
                            >
                                {typeCfPass ? "Hide" : "Show"}
                            </button>
                        </div>
                        {alert.cf_password && <p className="auth_error">{alert.cf_password}</p>}
                    </div>
                    <div className="auth_toggle_group">
                        <div className="auth_toggle_option">
                            <input
                                type="radio"
                                id="reg-male"
                                name="gender"
                                value="male"
                                checked={userData.gender === "male"}
                                onChange={handleChangeInput}
                            />
                            <label htmlFor="reg-male">Male</label>
                        </div>
                        <div className="auth_toggle_option">
                            <input
                                type="radio"
                                id="reg-female"
                                name="gender"
                                value="female"
                                checked={userData.gender === "female"}
                                onChange={handleChangeInput}
                            />
                            <label htmlFor="reg-female">Female</label>
                        </div>
                    </div>
                    <button type="submit" className="auth_submit">
                        Create account
                    </button>
                    <p className="auth_footer">
                        Already have an account? <Link to="/">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
