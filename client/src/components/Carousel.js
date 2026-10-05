import React from "react";
import { useSelector } from "react-redux";

const Carousel = ({ images, id }) => {
  const { theme } = useSelector(state => state);
  const isActive = index => {
    if (index === 0) return "active";
  };
  const list = (Array.isArray(images) ? images : []).filter((img) => img?.url);
  if (list.length === 0) return null;
  return (
    <div id={`image${id}`} className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {list.map((img, index) => (
          <button
            key={index}
            type="button"
            data-bs-target={`#image${id}`}
            data-bs-slide-to={index}
            className={isActive(index)}
            aria-current="true"
          />
        ))}
      </div>
      <div className="carousel-inner">
        {list.map((img, index) => {
          const url = img.url;
          const isVideo = typeof url === "string" && url.match(/video/i);
          return (
            <div key={index} className={`carousel-item ${isActive(index)}`}>
              {isVideo ? (
                <video
                  controls
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                  src={url}
                  className="d-block w-100"
                  alt=""
                />
              ) : (
                <img
                  style={{ filter: theme ? "invert(1)" : "invert(0)" }}
                  src={url}
                  className="d-block w-100"
                  alt=""
                />
              )}
            </div>
          );
        })}
      </div>
      <button
        style={{ width: "5%" }}
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#image${id}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        style={{ width: "5%" }}
        className="carousel-control-next"
        type="button"
        data-bs-target={`#image${id}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
