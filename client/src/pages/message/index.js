import React from 'react'
import LeftSide from '../../components/message/LeftSide'

const Message = () => {
    return (
      <div className="message d-flex">
        <div className="col-md-4 px-0 message_left">
          <LeftSide />
        </div>

        <div className="col-md-8 px-0 message_right">
          <div className="message_placeholder">
            <span className="material-icons">chat_bubble_outline</span>
            <h4>Messenger</h4>
            <p>Search for anyone by name or username above, then start a conversation.</p>
          </div>
        </div>
      </div>
    );
}

export default Message
