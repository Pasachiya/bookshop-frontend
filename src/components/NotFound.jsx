import 'react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="error-code">404</div>
      
      <div className="glitch-wrapper">
        <div className="glitch" data-text="PAGE NOT FOUND">PAGE NOT FOUND</div>
      </div>
      
      <div className="actions">
        <button className="home-button" onClick={() => window.location.href = '/'}>
          Back to Home
        </button>
        <button className="contact-button" onClick={() => window.location.href = '/contact'}>
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default NotFound;