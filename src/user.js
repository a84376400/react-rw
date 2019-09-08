//外部拿到function后就会立刻执行
const _service = (() => {
    //local var define
    const ls = window.localStorage;
    const UESR_HASH = '__USER_HASH__';
    const _s = { _u: {} };
    // _u: {
    //   id: 1,
    //   name: '',
    //   token: '123',
    //   invalidTime: 0,
    // },
    //inject functions 声明funcion
    _s.get = (k) => {
      if (k)
        return _s._u[k];
      return _s._u;
    }
    _s.getId = () => {
      return _s._u.id;
    }
    _s.getToken = () => {
      return _s._u.token;
    }
    _s.isValid = () => {
      if (!_s._u.invalidTime) return false
      return _s._u.invalidTime > new Date().getTime();
    }
    _s.getName = () => {
      return _s._u.username;
    }
    _s.set = (k, v) => {
      _s._u[k] = v;
      return _s;
    }
    _s.logout = () => {
      _s._u = undefined;
      ls.removeItem(UESR_HASH);
    }
    _s.isLogin = () => {
      _s.load();
      return !(undefined === _s._u.id) && _s.isValid();
    }
    _s.load = () => {
      var _val = ls.getItem(UESR_HASH);
      if (null !== _val) {
        _s._u = JSON.parse(_val);
      }
      return _s;
    }
    _s.save = () => {
      ls.setItem(UESR_HASH, JSON.stringify(_s._u));
      return _s;
    }
    _s.update = (u) => {
      u.invalidTime = new Date().getTime() + 12 * 60 * 60 * 1000
      _s._u = u;
      return _s.save();
    }
    return _s;
})();
const UserService = {
    me: () => {
        return _service;
    }

}
export default UserService;
