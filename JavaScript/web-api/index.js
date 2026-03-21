
const WebAPIUtils = {
  dom: {
    select: function(selector, context = document) {
      return context.querySelector(selector);
    },
    
    selectAll: function(selector, context = document) {
      return Array.from(context.querySelectorAll(selector));
    },
    
    create: function(tag, attributes = {}) {
      const element = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'textContent') {
          element.textContent = value;
        } else if (key === 'innerHTML') {
          element.innerHTML = value;
        } else {
          element.setAttribute(key, value);
        }
      });
      return element;
    },
    
    addClass: function(element, className) {
      element.classList.add(className);
      return element;
    },
    
    removeClass: function(element, className) {
      element.classList.remove(className);
      return element;
    },
    
    toggleClass: function(element, className) {
      element.classList.toggle(className);
      return element;
    },
    
    on: function(element, event, handler, options = {}) {
      element.addEventListener(event, handler, options);
      return () => element.removeEventListener(event, handler);
    },
    
    ready: function(callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    }
  },
  
  fetch: {
    get: async function(url, options = {}) {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    
    post: async function(url, data, options = {}) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    
    request: async function(url, options = {}) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || 10000);
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }
  },
  
  storage: {
    local: {
      get: function(key) {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch (e) {
          return null;
        }
      },
      
      set: function(key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e) {
          return false;
        }
      },
      
      remove: function(key) {
        localStorage.removeItem(key);
      },
      
      clear: function() {
        localStorage.clear();
      }
    },
    
    session: {
      get: function(key) {
        try {
          const item = sessionStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch (e) {
          return null;
        }
      },
      
      set: function(key, value) {
        try {
          sessionStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e) {
          return false;
        }
      },
      
      remove: function(key) {
        sessionStorage.removeItem(key);
      },
      
      clear: function() {
        sessionStorage.clear();
      }
    }
  },
  
  history: {
    push: function(url, state = {}, title = '') {
      history.pushState(state, title, url);
    },
    
    replace: function(url, state = {}, title = '') {
      history.replaceState(state, title, url);
    },
    
    onChange: function(callback) {
      window.addEventListener('popstate', (e) => {
        callback(e.state);
      });
    }
  },
  
  geolocation: {
    getCurrentPosition: function(options = {}) {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });
    },
    
    watchPosition: function(callback, options = {}) {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported');
        return null;
      }
      
      return navigator.geolocation.watchPosition(callback, null, options);
    },
    
    clearWatch: function(watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  },
  
  notification: {
    requestPermission: function() {
      return new Promise((resolve) => {
        if (!('Notification' in window)) {
          resolve('denied');
          return;
        }
        
        Notification.requestPermission().then(resolve);
      });
    },
    
    show: function(title, options = {}) {
      if (!('Notification' in window) || Notification.permission !== 'granted') {
        return null;
      }
      
      return new Notification(title, options);
    }
  },
  
  clipboard: {
    writeText: async function(text) {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not supported');
      }
      
      await navigator.clipboard.writeText(text);
    },
    
    readText: async function() {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not supported');
      }
      
      return await navigator.clipboard.readText();
    }
  },
  
  file: {
    readAsText: function(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    },
    
    readAsDataURL: function(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    },
    
    readAsArrayBuffer: function(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(file);
      });
    }
  },
  
  observer: {
    intersection: function(element, callback, options = {}) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(callback);
      }, options);
      
      observer.observe(element);
      return observer;
    },
    
    resize: function(element, callback) {
      const observer = new ResizeObserver((entries) => {
        entries.forEach(callback);
      });
      
      observer.observe(element);
      return observer;
    },
    
    mutation: function(target, callback, options = {}) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(callback);
      });
      
      observer.observe(target, options);
      return observer;
    }
  },
  
  websocket: {
    create: function(url, options = {}) {
      const ws = new WebSocket(url);
      
      ws.onopen = options.onOpen || (() => {});
      ws.onmessage = options.onMessage || (() => {});
      ws.onclose = options.onClose || (() => {});
      ws.onerror = options.onError || (() => {});
      
      return ws;
    }
  },
  
  canvas: {
    create: function(width, height) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return {
        canvas,
        ctx: canvas.getContext('2d')
      };
    },
    
    drawRect: function(ctx, x, y, width, height, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    },
    
    drawText: function(ctx, text, x, y, options = {}) {
      ctx.fillStyle = options.color || 'black';
      ctx.font = options.font || '16px Arial';
      ctx.fillText(text, x, y);
    },
    
    drawCircle: function(ctx, x, y, radius, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    },
    
    clear: function(ctx, width, height) {
      ctx.clearRect(0, 0, width, height);
    }
  },
  
  audio: {
    createContext: function() {
      return new (window.AudioContext || window.webkitAudioContext)();
    },
    
    createOscillator: function(context, frequency = 440, type = 'sine') {
      const oscillator = context.createOscillator();
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      return oscillator;
    },
    
    createGain: function(context, value = 1) {
      const gain = context.createGain();
      gain.gain.value = value;
      return gain;
    }
  },
  
  utils: {
    debounce: function(fn, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
      };
    },
    
    throttle: function(fn, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    
    once: function(fn) {
      let called = false;
      return function(...args) {
        if (!called) {
          called = true;
          return fn.apply(this, args);
        }
      };
    },
    
    memoize: function(fn) {
      const cache = new Map();
      return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
          return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
      };
    },
    
    supports: function(api) {
      // 在 Node.js 环境中返回 false
      if (typeof window === 'undefined') {
        return api ? false : {};
      }
      
      const apis = {
        geolocation: 'geolocation' in navigator,
        notification: 'Notification' in window,
        clipboard: 'clipboard' in navigator,
        serviceWorker: 'serviceWorker' in navigator,
        webWorker: 'Worker' in window,
        websocket: 'WebSocket' in window,
        canvas: 'HTMLCanvasElement' in window,
        audio: 'AudioContext' in window || 'webkitAudioContext' in window,
        intersectionObserver: 'IntersectionObserver' in window,
        resizeObserver: 'ResizeObserver' in window,
        mutationObserver: 'MutationObserver' in window,
        fetch: 'fetch' in window,
        localStorage: 'localStorage' in window,
        sessionStorage: 'sessionStorage' in window,
        history: 'history' in window
      };
      
      return api ? apis[api] : apis;
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WebAPIUtils;
}
