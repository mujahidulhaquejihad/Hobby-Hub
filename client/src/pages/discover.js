import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDiscoverPosts, DISCOVER_TYPES } from '../redux/actions/discoverAction';
import PostThumb from '../components/PostThumb';
import LoadMoreBtn from '../components/LoadMoreBtn';
import LoadIcon from '../images/loading.gif';
import { getDataAPI } from '../utils/fetchData';

const Discover = () => {
    const { auth, discover } = useSelector(state => state);
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);

    useEffect(() => {
        // Fetch initial posts only if they haven't been loaded before
        if (!discover.firstLoad) {
            dispatch(getDiscoverPosts(auth.token));
        }
    }, [dispatch, auth.token, discover.firstLoad]);

    const handleLoadMore = async () => {
        setLoad(true);
        // The number of posts to skip is (page - 1) * posts_per_page
        // But since your initial page is 2, and you skip `num`,
        // the calculation becomes simpler for subsequent loads.
        // `discover.page * 8` assumes your backend skips `num` items.
        // Let's adjust this slightly for clarity:
        const offset = (discover.page - 1) * 8;
        const res = await getDataAPI(`post_discover?num=${offset}`, auth.token);
        dispatch({ type: DISCOVER_TYPES.UPDATE_POSTS, payload: res.data });
        setLoad(false);
    };

    return (
        <div>
            {discover.loading ? (
                <img src={LoadIcon} alt="Loading..." className="d-block mx-auto my-4" />
            ) : (
                <PostThumb posts={discover.posts} result={discover.result} />
            )}

            {load && <img src={LoadIcon} alt="Loading..." className="d-block mx-auto" />}

            {!discover.loading && (
                <LoadMoreBtn
                    result={discover.result}
                    page={discover.page}
                    load={load}
                    handleLoadMore={handleLoadMore}
                />
            )}
        </div>
    );
};

export default Discover;