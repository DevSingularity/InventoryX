import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { pollNotifications } from '../../features/notifications/notificationSlice';


const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    dispatch(pollNotifications());
    const pollId = setInterval(() => {
      dispatch(pollNotifications());
    }, 30000);

    return () => clearInterval(pollId);
  }, [dispatch, token]);

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
