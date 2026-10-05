import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { imageShow, videoShow } from "../utils/mediaShow";

const PostThumb = ({ posts, result }) => {
  const { theme } = useSelector((state) => state);

  if (result === 0 ){
    return <h2 className="text-center color-c1">No Post</h2>
  }

    const imageShow = (src) => {
      return (
        <img
          src={src}
          alt={src}
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        />
      );
    };

    const videoShow = (src) => {
      return (
        <video
          controls
          src={src}
          alt={src}
          style={{ filter: theme ? "invert(1)" : "invert(0)" }}
        />
      );
    };
    return (
      <div className="post_thumb">
        {posts && posts.map((post) => {
          const firstMedia = post.images?.[0]?.url;
          const isVideo = typeof firstMedia === "string" && firstMedia.match(/video/i);
          return (
            <Link to={`/post/${post._id}`} key={post._id}>
              <div className="post_thumb_display">
                {firstMedia ? (
                  isVideo ? videoShow(firstMedia, theme) : imageShow(firstMedia, theme)
                ) : (
                  <div className="post_thumb_placeholder">No media</div>
                )}
                <div className="post_thumb_menu">
                  <i className="far fa-thumbs-up">{post.likes?.length ?? 0}</i>
                  <i className="far fa-comments">{post.comments?.length ?? 0}</i>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
};

export default PostThumb
