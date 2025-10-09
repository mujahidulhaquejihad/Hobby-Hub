import React from 'react';
import Avatar from '../../Avatar';
import { Link } from 'react-router-dom';
import moment from 'moment';

const CommentCard = ({ children, comment, post, theme }) => {
    return (
        <div className="comment_card mt-2" style={{ opacity: 1 }}>
            <Link to={`/profile/${comment.user._id}`} className="d-flex text-dark">
                <Avatar src={comment.user.avatar} size="small-avatar" />
                <h6 className="mx-1">{comment.user.username}</h6>
            </Link>

            <div className="comment_content">
                <div className="flex-fill"
                    style={{
                        filter: theme ? 'invert(1)' : 'invert(0)',
                        color: theme ? 'white' : '#111',
                    }}>
                    <span>{comment.content}</span>
                </div>
                
                <div className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                    <small className="text-muted me-3">
                        {moment(comment.createdAt).fromNow()}
                    </small>
                </div>
            </div>
            {children}
        </div>
    );
};

export default CommentCard;
