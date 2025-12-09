// WebSocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketService = (() => {
    let client = null;
    
    const connect = (onMessageReceived) => {
        // Set the token
        let token = localStorage.getItem('jwtToken');
        WebSocketService.token = token;

        client = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_BACKEND_URL}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,  // Include the token here
            },
            onConnect: (frame) => {
                console.log('Connected: ', frame);
                client.subscribe('/user/topic/notifications', (message) => {
                    if (onMessageReceived) {
                        onMessageReceived(JSON.parse(message.body));
                    }
                });
            },
            onDisconnect: () => {
                console.log('Disconnected');
            },
            debug: (str) => {
                console.log(str);
            }
        });

        client.activate();
    };

    const disconnect = () => {
        if (client) {
            client.deactivate();
        }
    };

    return {
        connect,
        disconnect
    };
})();

export default WebSocketService;
