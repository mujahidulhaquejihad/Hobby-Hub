import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { addUser, getConversations } from "../../redux/actions/messageAction";
import { getDataAPI } from '../../utils/fetchData';
import UserCard from "../UserCard";

const LeftSide = () => {
    const { auth, message } = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const pageEnd = useRef();
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUsers, setSearchUsers] = useState([]);

    const handleSearch = async e => {
        e.preventDefault();
        if (!search) return setSearchUsers([]);

        try {
            const res = await getDataAPI(`search?username=${search}`, auth.token);
            setSearchUsers(res.data.users);
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: err.response.data.msg },
            });
        }
    };

    // This function is now corrected to call the new action properly.
    const handleAddUser = (user) => {
        setSearch('');
        setSearchUsers([]);
        dispatch(addUser({ user })); // Pass the user object directly
        return navigate(`/message/${user._id}`);
    };

    const isActive = (user) => {
        if (id === user._id) return 'active';
        return '';
    }

    useEffect(() => {
        if (message.firstLoad) return;
        dispatch(getConversations({ auth }));
    }, [dispatch, auth, message.firstLoad]);

    // Effect for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((p) => p + 1);
                }
            },
            { threshold: 0.1 }
        );
        
        const currentObserver = pageEnd.current;
        if (currentObserver) {
            observer.observe(currentObserver);
        }
        
        return () => {
            if (currentObserver) {
                observer.unobserve(currentObserver);
            }
        };
    }, [setPage]);

    useEffect(() => {
        if (message.resultUsers >= (page - 1) * 9 && page > 1) {
            dispatch(getConversations({ auth, page }));
        }
    }, [message.resultUsers, page, auth, dispatch]);

    return (
        <>
            <form className="message_header" onSubmit={handleSearch}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                />
                <button style={{ display: "none" }} type="submit">Search</button>
            </form>

            <div className="message_chat_list">
                {searchUsers.length !== 0 ? (
                    <>
                        {searchUsers.map((user) => (
                            <div
                                key={user._id}
                                className={`message_user ${isActive(user)}`}
                                onClick={() => handleAddUser(user)}
                            >
                                <UserCard user={user} />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {message.users.map((user) => (
                            <div
                                key={user._id}
                                className={`message_user ${isActive(user)}`}
                                onClick={() => handleAddUser(user)}
                            >
                                <UserCard user={user} msg={true}>
                                    <i className="fas fa-circle" />
                                </UserCard>
                            </div>
                        ))}
                    </>
                )}
                <button style={{ opacity: 0 }} ref={pageEnd}>Load more...</button>
            </div>
        </>
    );
}

export default LeftSide;

