module.exports = class EventEmitter {

  constructor(context) {
    this._emitterContext = context;
    this._listeners = new Map();
  }

  on(type, listener) {
    if (this._listeners.has(type)) {
      this._listeners.get(type).push(listener);
    } else {
      this._listeners.set(type, [listener]);
    }
    return this;
  }

  off(type, listener) {
    if (this._listeners.has(type)) {
      const eventListeners = this._listeners.get(type);
      const listenerIndex = eventListeners.indexOf(listener);
      if (listenerIndex !== -1) {
        this._listeners.get(type).splice(listenerIndex, 1);
      }
    }
    return this;
  }

  emit(type, payload) {
    if (!this._emitterContext) throw new Error('Context is not set on EventEmitter');
    const listeners = this._listeners.get(type);
    if (listeners) {
      listeners.forEach((listener) => {
        listener.call(this._emitterContext, payload);
      });
    }
  }
}
