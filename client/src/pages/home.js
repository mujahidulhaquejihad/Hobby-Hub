import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Posts from '../components/home/Posts';
import Status from '../components/home/Status';
import RightSideBar from "../components/home/RightSideBar";
import PostThumb from '../components/PostThumb';
import LoadIcon from '../images/loading.gif';
import { getDiscoverPosts } from '../redux/actions/discoverAction';

const Home = () => {
  const { homePosts, discover, auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const isFeedEmpty = !homePosts.loading && homePosts.result === 0;
  const hasSuggestedPosts = discover.posts && discover.posts.length > 0;

  useEffect(() => {
    if (isFeedEmpty && !discover.firstLoad) {
      dispatch(getDiscoverPosts(auth.token));
    }
  }, [isFeedEmpty, discover.firstLoad, auth.token, dispatch]);

  return (
    <div className="home row mx-0">
      <div className="col-md-8 home_main">
        <Status />
        {homePosts.loading ? (
          <div className="home_loading">
            <img src={LoadIcon} alt="Loading" />
          </div>
        ) : homePosts.result > 0 ? (
          <Posts />
        ) : (
          <>
            <div className="home_empty">
              <p>Your feed is empty. Follow people or explore suggested posts below.</p>
            </div>
            {discover.loading ? (
              <div className="home_loading">
                <img src={LoadIcon} alt="Loading" />
              </div>
            ) : hasSuggestedPosts ? (
              <section className="home_suggested">
                <h3 className="home_suggested_title">Suggested for you</h3>
                <PostThumb posts={discover.posts} result={discover.result} />
              </section>
            ) : null}
          </>
        )}
      </div>
      <div className="col-md-4 home_sidebar">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;
