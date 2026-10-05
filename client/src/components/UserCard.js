import React from 'react';
import Avatar from './Avatar';
import { Link, useNavigate } from 'react-router-dom';

const UserCard = ({ children, user, border, handleClose, setShowFollowers, setShowFollowing, msg, showMessage }) => {
    const navigate = useNavigate();
    const handleCloseAll = () => {
        if (handleClose) handleClose();
        if (setShowFollowers) setShowFollowers(false);
        if (setShowFollowing) setShowFollowing(false);
    };

    const handleMessage = (e) => {
        e.preventDefault();
        handleCloseAll();
        navigate(`/message/${user._id}`);
    };

    return (
        <div className={`user_card d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
            <div className="user_card_info">
                <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
                    className="d-flex align-items-center">
                    <Avatar src={user.avatar} size="big-avatar" />
                    <div className="ml-2 user_card_meta">
                        <span className="d-block user_card_username">{user.username}</span>
                        <small className="user_card_fullname">
                            {msg ? <div>{user.text}</div> : user.fullname}
                        </small>
                    </div>
                </Link>
            </div>
            <div className="user_card_actions">
                {showMessage && (
                    <Link to={`/message/${user._id}`} onClick={handleMessage} className="user_card_message_btn">
                        Message
                    </Link>
                )}
                {children}
            </div>
        </div>
    );
};

export default UserCard;
