/**
 * @format
 */

import {AppRegistry} from 'react-native';
import LoginStack from './components/Stacks/LoginStack';
import {name as appName} from './app.json';

// Push notification configuration
// const serverIp = '3.97.53.16'; // Server IP
// const serverIp = '10.244.31.128'; // Amanda's local IP (ShawOpen, ubcsecure doesn't work)
// const serverIp = '192.168.1.11'; // Connor's local IP
const serverIp = '192.168.1.83'; // Brennan's local IP

// Set global variables
global.serverIp = serverIp;
global.userId = 71747974; // TODO: set to actual ID fetched during login

AppRegistry.registerComponent(appName, () => LoginStack);
