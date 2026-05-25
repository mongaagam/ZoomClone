const hostname = window.location.hostname;
const port = window.location.port;

const isLocal = 
    hostname === "localhost" || 
    hostname === "127.0.0.1" || 
    hostname.endsWith(".local") || 
    hostname.includes(":") || // IPv6
    hostname.startsWith("192.168.") || 
    hostname.startsWith("192.0.0.") || 
    hostname.startsWith("10.") || 
    hostname.startsWith("172.16.") || 
    hostname.startsWith("172.17.") || 
    hostname.startsWith("172.18.") || 
    hostname.startsWith("172.19.") || 
    hostname.startsWith("172.20.") || 
    hostname.startsWith("172.21.") || 
    hostname.startsWith("172.22.") || 
    hostname.startsWith("172.23.") || 
    hostname.startsWith("172.24.") || 
    hostname.startsWith("172.25.") || 
    hostname.startsWith("172.26.") || 
    hostname.startsWith("172.27.") || 
    hostname.startsWith("172.28.") || 
    hostname.startsWith("172.29.") || 
    hostname.startsWith("172.30.") || 
    hostname.startsWith("172.31.") ||
    port === "3000";

const server = isLocal ?
    (hostname.includes(":") ? `http://[${hostname}]:8000` : `http://${hostname}:8000`) :
    "https://zoom-clone-backend-ipqc.onrender.com";


export default server;