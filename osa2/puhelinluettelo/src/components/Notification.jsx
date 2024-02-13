import { useState, useEffect } from 'react';

const Notification = ({ message, type = 'success' }) => {
  const [visibleMessage, setVisibleMessage] = useState(message);

  useEffect(() => {
    if (message) {
      setVisibleMessage(message);
      const timer = setTimeout(() => {
        setVisibleMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (visibleMessage === null) {
    return null;
  }

  const className = `notification ${type === 'success' ? 'success' : 'error'}`;
  return (
    <div className={className} role={className === 'error' ? 'alert' : undefined}>
      {visibleMessage}
    </div>
  );
};

export default Notification;
