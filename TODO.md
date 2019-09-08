# TODO

## All Things At **V1.0.0**

#### T014: [ ] Dashboard
- 1. [ ] chart
- 2. [ ] Warnning/Error Event Notifications

#### T013: [ ] Group control the devices
- 1. [ ] boardcast or send ?
- 2. [ ] should setTag if boardcast
- 3. [ ] should execute sql to get the sn numbers

#### T012: [ ] try to fix the error after lost TCP connection

- Use the step component , See [https://alibaba.github.io/ice/component/step#%E4%BB%A3%E7%A0%81%E7%A4%BA%E4%BE%8B](https://alibaba.github.io/ice/component/step#%E4%BB%A3%E7%A0%81%E7%A4%BA%E4%BE%8B)
- 1. [ ] get info from NB network
- 2. [ ] try to restart the Net Unit
- 3. [ ] try to restart the device
- 4. [ ] report an error & create a issue ticket
- 5. [ ] fix it offline
- 6. [ ] feedback & reconnect
- 7. [ ] done!
- 8. [ ] mark the point times

#### T011: [ ] How to save the camera info ?

#### T010: [ ] Do the logic thing when receive the device push data

- 1. Define the error/warnning conditions & actions(SMS, Notify, Email, Call, Alarm)
- 2. Load the conditions
- 3. Do logic when received the push data

#### T009: [x] Save all the control command to db in device panel

#### T008: [x] Run `ffmpeg` with `child_process`
- 1. [ ] How to notify the server to stop the command?

#### T007: [x] Play the rtsp video stream in web player
- 1. Normally, the camera support service by `rtsp` protocal.
  - dahua: `rtsp://admin:admin@192.168.1.108:554/cam/realmonitor?channel=1&subtype=1`
  - haikang: `rtsp://admin:admin123@192.168.1.205:554/h264/ch1/main/av_stream`
- 2. But, the browsers cant play it.
- 3. So, we need trasform the `rtsp` to `rtmp`.
- 4. ~Use `h5s`~ **It doesn't work!!!**
  - download page [https://linkingvision.com/download/h5stream/](https://linkingvision.com/download/h5stream/)
  - start serv `h5ss rtsp://192.168.1.108:554/cam/realmonitor?channel=1&subtype=1 admin admin`

- 5. `ffmpeg` can make it
  - ffmpeg format to hls
  [https://blog.csdn.net/wutong_login/article/details/42292787](https://blog.csdn.net/wutong_login/article/details/42292787)

  See detail at [https://www.cnblogs.com/gaoji/p/6872365.html](https://www.cnblogs.com/gaoji/p/6872365.html)
  - Nginx
    - We need add rtmp module for nginx
      - [x] windows OK
      - [ ] Linux 
        ```bash
        git clone https://github.com/arut/nginx-rtmp-module.git  
        # centos redhat
        # yum -y install openssl openssl-devel
        # ubuntu debain
        apt-get install openssl libssl-dev
        wget http://nginx.org/download/nginx-1.14.0.tar.gz  
        tar -zxvf nginx-1.14.0.tar.gz  
        cd nginx-1.14.0  
        ./configure --prefix=/usr/local/nginx  --add-module=../nginx-rtmp-module  --with-http_ssl_module    
        make && make install
        ```
    - Edit the nginx.conf
      ```bash
      # insert into the root element
      rtmp {  
        server {  
            listen 1935;  
	 
            application live {  
                live on;  
            }
	        application hls {      
                live on;      
                hls on;      
                hls_path data/misc/hls;    
                hls_fragment 1s;     
                hls_playlist_length 3s;   
            }  
        }  
      }
      # insert after the http server element
      location /stat {    
        rtmp_stat all;    
        rtmp_stat_stylesheet stat.xsl;    
      }    
  
      location /stat.xsl {    
        root nginx-rtmp-module/;    
      }    
          
      location /control {    
        rtmp_control all;    
      } 
	  location /hls {    
        types {    
            application/vnd.apple.mpegurl m3u8;    
            video/mp2t ts;    
        }    
        root data/misc;    
        add_header Cache-Control no-cache;    
      } 
      ```
  - ffmpeg
    - Install it in Linux (Debain or Ubuntu)
        ```bash
        sudo apt-get install yasm nasm \
                build-essential automake autoconf \
                libtool pkg-config libcurl4-openssl-dev \
                intltool libxml2-dev libgtk2.0-dev \
                libnotify-dev libglib2.0-dev libevent-dev \
                checkinstall
        wget https://www.ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2
        tar jxvf ffmpeg-snapshot.tar.bz2
        cd ffmpeg
        ./configure --prefix=/usr
        time make -j 8
        cat RELEASE
        sudo checkinstall
        sudo dpkg --install ffmpeg_*.deb
        ```
    - Run it and transform the stream: `rtmp://192.168.100.196:1935/live/test`
      ```bash
      ffmpeg -i "rtsp://admin:admin@192.168.100.201:554/cam/realmonitor?channel=1&subtype=1" -f flv -r 25 -s 1960*1280 -an "rtmp://192.168.100.196:1935/live/test"

      ffmpeg -i "rtsp://admin:admin123@192.168.100.211:554/h264/ch1/main/av_stream" -f flv -r 25 -s 1960*1280 -an "rtmp://localhost:1935/live/test"
      ```
- 6. Notice
  - 单是 RTMP 的话不需要第三方库，如果是 HLS 的话需要引入videojs-contrib-hls，看具体情况而定。

- 7. Add video.js in react
  - See [http://docs.videojs.com/tutorial-react.html](http://docs.videojs.com/tutorial-react.html)

#### T006: [x] Add SearchInput In TableList Component

#### T005: [x] Add Pagination 

#### T004: [x] Import `moment.js` 

#### T003: [x] Clean Login Info After Logout 

#### T002: [x] save Login Info Into LocalStorage 

#### T001: [x] Cant Open Other Pages Before Login Success! 

- 1. Add a component for path `/`; 

     Like `<Route path="/" component={ Application }>` 
- 2. Do something Intercept When `componentDidMount()`

    ```javascript
    class Application extends Component{
        constructor(props) {
            super(props)
        }

        getUserInfo(){
            // get user session here
            return JSON.parse(localStorage.getItem('__USER__'))
        }

        isLogin(){
            let user = this.getUserInfo()
            if(user){
                return user.name
            }else{
                return false
            }
        }

        componentDidMount(){
            if(!this.isLogin()){
                // intercept the url change
                browserHistory.push('/login')
            }
        }

        render (){
            return (
            <div>
                {this.props.children}
            </div>
            )
        }
    }

    ```