import { io } from 'socket.io-client'
import { BACKEND_URL } from './utils'

export async function initSocket() {
    const option = {
        "force new connection": true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket']
    }
    
    return io(BACKEND_URL, option)
}