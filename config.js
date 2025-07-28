// Use localhost for development, production URL for deployed version
window.API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? "http://localhost:3000" 
    : "https://sap-technologies.onrender.com";
    
    