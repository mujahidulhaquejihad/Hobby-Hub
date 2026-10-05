import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { createPost, updatePost } from "../redux/actions/postAction";
import Icons from "./Icons";
import { imageShow, videoShow } from "../utils/mediaShow";

const StatusModal = () => {
  const { auth, theme, status, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(false);
  const videoRef = useRef();
  const refCanvas = useRef();
  const [tracks, setTracks] = useState("");

  const handleChangeImages = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) {
        return (err = "File does not exist.");
      }
      if (file.size > 1024 * 1024 * 5) {
        return (err = "Image size must be less than 5 mb.");
      }
      return newImages.push(file);
    });
    if (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    }
    setImages([...images, ...newImages]);
  };

  const deleteImages = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);

    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    let URL = refCanvas.current.toDataURL();
    setImages([...images, { camera: URL }]);
  };

  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasContent = (content && content.trim()) || images.length > 0;
    if (!hasContent) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Add some text or a photo." },
      });
    }

    if (status.onEdit) {
      dispatch(updatePost({ content, images, auth, status }));
    } else {
      dispatch(createPost({ content, images, auth, socket }));
    }

    setContent("");
    setImages([]);
    if (tracks) {
      tracks.stop();
    }
    dispatch({
      type: GLOBALTYPES.STATUS,
      payload: false,
    });
  };

  useEffect(() => {
    if (status && typeof status === "object" && status.onEdit) {
      setContent(status.content || "");
      setImages(status.images || []);
    } else if (!status) {
      setContent("");
      setImages([]);
    }
  }, [status]);

  

  const isEdit = status && typeof status === "object" && status.onEdit;
  const title = isEdit ? "Edit post" : "Create post";

  return (
    <div className="status_modal" onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: false })}>
      <form
        className="status_modal_card"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="status_header">
          <h2 className="status_modal_title">{title}</h2>
          <button
            type="button"
            className="status_modal_close"
            aria-label="Close"
            onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: false })}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="status_body">
          <textarea
            className="status_modal_textarea"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            name="content"
            placeholder={isEdit ? "Update your post..." : `${auth.user?.username || "You"}, what's on your mind?`}
          />

          <div className="status_modal_actions_row">
            <div className="flex-fill" />
            <Icons setContent={setContent} content={content} theme={theme} />
          </div>

          <div className="show_images">
            {images.map((img, index) => (
              <div key={index} className="file_img">
                {img.camera ? (
                  imageShow(img.camera, theme)
                ) : img.url ? (
                  <>
                    {img.url.match(/video/i)
                      ? videoShow(img.url)
                      : imageShow(img.url)}
                  </>
                ) : (
                  <>
                    {img.type && img.type.match(/video/i)
                      ? videoShow(URL.createObjectURL(img), theme)
                      : imageShow(URL.createObjectURL(img), theme)}
                  </>
                )}
                <button type="button" className="file_img_remove" onClick={() => deleteImages(index)} aria-label="Remove">
                  <span className="material-icons">close</span>
                </button>
              </div>
            ))}
          </div>

          {stream && (
            <div className="status_stream">
              <video
                width="100%"
                height="100%"
                ref={videoRef}
                autoPlay
                muted
              />
              <button type="button" className="stream_stop" onClick={handleStopStream} aria-label="Stop camera">
                <span className="material-icons">close</span>
              </button>
              <canvas style={{ display: "none" }} ref={refCanvas} />
            </div>
          )}

          <div className="input_images">
            {stream ? (
              <button type="button" className="input_images_btn" onClick={handleCapture} aria-label="Capture">
                <span className="material-icons">camera</span>
              </button>
            ) : (
              <>
                <button type="button" className="input_images_btn" onClick={handleStream} aria-label="Camera">
                  <span className="material-icons">camera_alt</span>
                </button>
                <div className="file_upload">
                  <span className="material-icons">photo_library</span>
                  <input
                    onChange={handleChangeImages}
                    type="file"
                    name="file"
                    id="file"
                    multiple
                    accept="image/*,video/*"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="status_footer">
          <button type="submit" className="btn-1 status_submit_btn">
            {isEdit ? "Update" : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusModal;
