let host = 'localhost', port = '9994';
if(!!window){
  if(!!window.setting){
    host = window.setting.host || host;
    port = window.setting.port || host;
  }
}

export { host, port };
