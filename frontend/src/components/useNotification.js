import { useState } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState({ message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification({ message: '', type: '' });
  };

  return { notification, showNotification, closeNotification };
};


export default useNotification;