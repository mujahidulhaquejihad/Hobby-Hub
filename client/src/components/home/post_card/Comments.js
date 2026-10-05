import React, { useState, useMemo } from 'react';
import CommentDisplay from './CommentDisplay';

const Comments = ({ post }) => {
  const [next, setNext] = useState(2);

  // useMemo will only re-calculate when post.comments changes.
  // This is more efficient than using two separate useEffects.
  const { rootComments, repliesByParentId } = useMemo(() => {
    const root = [];
    // Using a Map is much faster for looking up replies than filtering the array every time.
    const replies = new Map();

    for (const comment of post.comments) {
      if (comment.reply) {
        if (!replies.has(comment.reply)) {
          replies.set(comment.reply, []);
        }
        replies.get(comment.reply).push(comment);
      } else {
        root.push(comment);
      }
    }
    return { rootComments: root, repliesByParentId: replies };
  }, [post.comments]);

  // This derives the visible comments and only updates when rootComments or next changes.
  const showComments = useMemo(() => {
    return rootComments.slice(rootComments.length - next);
  }, [rootComments, next]);

  return (
    <div className="comments">
      {showComments.map((comment) => (
        <CommentDisplay
          key={comment._id}
          comment={comment}
          post={post}
          // Reply lookup is now instant (O(1)) instead of filtering the whole array (O(n))
          replyCm={repliesByParentId.get(comment._id) || []}
        />
      ))}
      
      {rootComments.length - next > 0 ? (
        <div
          onClick={() => setNext(next + 10)}
          className="p-2 border-top"
          style={{ cursor: 'pointer', color: 'crimson' }}
        >
          Load more...
        </div>
      ) : (
        rootComments.length > 2 && (
          <div
            onClick={() => setNext(2)}
            className="p-2 border-top"
            style={{ cursor: 'pointer', color: 'crimson' }}
          >
            Hide Comments...
          </div>
        )
      )}
    </div>
  );
};

export default Comments;