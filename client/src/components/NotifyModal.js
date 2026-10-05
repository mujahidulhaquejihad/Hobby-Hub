import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import moment from 'moment';
import { deleteAllNotifies, isReadNotify, NOTIFY_TYPES } from '../redux/actions/notifyAction';

const NotifyModal = () => {
  const { auth, notify } = useSelector(state => state);
  const dispatch = useDispatch();

  const handleIsRead = (msg) => {
    dispatch(isReadNotify({ msg, auth }));
  };

  const handleDeleteAll = () => {
    const newArr = notify.data.filter(item => item.isRead === false);
    if (newArr.length === 0) return dispatch(deleteAllNotifies(auth.token));
    if (window.confirm(`You have ${newArr.length} unread notifications. Delete all?`)) {
      return dispatch(deleteAllNotifies(auth.token));
    }
  };

  const handleSound = () => {
    dispatch({ type: NOTIFY_TYPES.UPDATE_SOUND, payload: !notify.sound });
  };

  return (
    <div className="notify_dropdown">
      <div className="notify_dropdown_header">
        <h3 className="notify_dropdown_title">Notifications</h3>
        <button
          type="button"
          className="notify_dropdown_sound"
          onClick={handleSound}
          aria-label={notify.sound ? 'Mute notifications' : 'Unmute notifications'}
        >
          <span className="material-icons">{notify.sound ? 'notifications_active' : 'notifications_off'}</span>
        </button>
      </div>

      <div className="notify_dropdown_list">
        {notify.data.length === 0 ? (
          <p className="notify_dropdown_empty">No notifications yet</p>
        ) : (
          notify.data.map((msg, index) => (
            <Link
              key={index}
              to={msg.url}
              className={`notify_dropdown_item ${!msg.isRead ? 'notify_dropdown_item_unread' : ''}`}
              onClick={() => handleIsRead(msg)}
            >
              <Avatar src={msg.user.avatar} size="medium-avatar" />
              <div className="notify_dropdown_content">
                <p className="notify_dropdown_text">
                  <strong>{msg.user.username}</strong>
                  {' '}{msg.text}
                </p>
                {msg.content && (
                  <span className="notify_dropdown_preview">{msg.content.slice(0, 30)}…</span>
                )}
                <span className="notify_dropdown_time">{moment(msg.createdAt).fromNow()}</span>
              </div>
              {msg.image && (
                <Avatar src={msg.image} size="small-avatar" />
              )}
              {!msg.isRead && <span className="notify_dropdown_dot" />}
            </Link>
          ))
        )}
      </div>

      {notify.data.length > 0 && (
        <>
          <div className="notify_dropdown_divider" />
          <button
            type="button"
            className="notify_dropdown_clear"
            onClick={handleDeleteAll}
          >
            Clear all
          </button>
        </>
      )}
    </div>
  );
};

export default NotifyModal;
