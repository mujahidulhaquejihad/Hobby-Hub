import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
// 1. This is the corrected import for the modern 'uuid' library
import { v4 as uuidv4 } from 'uuid';

const UserCard = ({ children, user, border, handleClose, setShowFollowers, setShowFollowing, msg }) => {

    const handleCloseAll = () => {
        if (handleClose) handleClose();
        if (setShowFollowers) setShowFollowers(false);
        if (setShowFollowing) setShowFollowing(false);
    };

    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
            <div>
                <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
                    className="d-flex align-items-center">

                    <Avatar src={user.avatar} size="big-avatar" />

                    <div className="ml-2" style={{ transform: 'translateY(-2px)' }}>
                        <span className="d-block">{user.username}</span>
                        <small style={{ opacity: 0.7 }}>
                            {
                                msg 
                                ? <div>{user.text}</div>
                                : user.fullname
                            }
                        </small>
                    </div>
                </Link>
            </div>
            {/* Using uuidv4() as a key where a stable ID isn't available */}
            <div key={uuidv4()}>
                {children}
            </div>
        </div>
    );
};

export default UserCard;
