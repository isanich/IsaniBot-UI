class BaseWrapper {
  constructor() {

    this._content = {};
    this._isReady = $.Deferred();
    this._serverEndpoint = 'http://iiss.me/discord/plugin/';
    this._endpoints = [];
  }

  _downloadContent(type) {
    let counter = this._endpoints.length;

    if (typeof DEBUG_FLAG !== 'undefined') {
      this._content = {
        'css': CSS_SOURCE,
        'html': HTML_SOURCE,
        'locales': LOCALES_SOURCE
      }[type];

      this._isReady.resolve();
    }
    else {
      this._endpoints.forEach(endpoint => {
        setTimeout(() => {
          request({url: this._serverEndpoint + endpoint}, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              this._content[endpoint.match(/([^/]+)(?=\.\w+$)/)[0]] = body.replace(/(\r\n|\n|\r)/gm, "");
            }
            counter -= 1;
            if (counter === 0) {
              this._isReady.resolve();
            }
          });
        }, 1);
      });
    }
  }

  getContent(name) {
    return this._content[name];
  }

  setContent(content) {
    this._content = content;
  }

  isReady() {
    return this._isReady;
  }
}

class CssWrapper extends BaseWrapper {
  constructor() {

    super();
    this._endpoints = [
        'src/css/isaniBotUI.css',
        'src/css/longChannelNames.css',
        'src/css/titleBar.css'
    ];

    this._downloadContent('css');
  }
}

class HtmlWrapper extends BaseWrapper {
  constructor() {
    super();
    this._endpoints = [
        'src/html/newEventPanel.html',
        'src/html/settings.html'
    ];

    this._downloadContent('html');
  }
}

class LocalesWrapper extends BaseWrapper {
  constructor() {
    super();
    this._endpoints = [
        'src/data/locales.json'
    ]

    this._downloadContent('locales');
  }
}