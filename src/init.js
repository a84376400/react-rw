import fpmc, { ping } from 'fpmc-jssdk';
import io from 'socket.io-client';
import PubSub from 'pubsub-js';
import { host, port} from './options.js';

fpmc.init({ mode:'DEV', appkey:'123123', masterKey:'123123', endpoint: `http://${ host}:${ port}/api`, v:'0.0.1' })
const socket = io(`ws://${ host}:${ port}`)

//Receive Data From Server Then Publish It
socket.on('message', msg => {
  if(typeof msg === 'string'){
    msg = JSON.parse(msg);
  }
  /*推送到devicePanel页面的设备警告*/
  PubSub.publish(msg.topic || msg.event || 'message', msg);
})

export default fpmc
