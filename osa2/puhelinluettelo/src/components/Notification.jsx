import { useState, useEffect } from 'react';

const Notification = ({ message, type = 'success' }) => {
  const [visibleMessage, setVisibleMessage] = useState(message);

  useEffect(() => {
    // This will now correctly handle both setting and clearing messages.
    setVisibleMessage(message);
    if (message) {
      const timer = setTimeout(() => {
        setVisibleMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]); // Depend on message to trigger effect

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
