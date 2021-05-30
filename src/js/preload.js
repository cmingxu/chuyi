const remote = require("electron").remote;
const { app, session } = remote;
const JinRiTeMaiConsts = remote.require("./jinritemai");

const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const path = require("path");

// Global variables
let G = {};
G.orderListToolbar = null
G.showOrderListToolbarBtn = null;


window.addEventListener('popstate', () => {
  setTimeout(() => {
    popstate();
  }, 1000);
});

document.addEventListener("DOMContentLoaded", () => {
  domContentLoaded();
});

function popstate() {
  if(window.location.href == JinRiTeMaiConsts.orderListPageUrl && G.showOrderListToolbarBtn == null) {
    let searchBtn = document.querySelector("#search-form-container button.ant-btn-primary");
    let x = document.createElement("button");
    x.type = "button";
    x.classList.add("ant-btn", "sp", "ant-btn-danger");
    x.cssTextContent = "margin-left: 8px;";
    x.innerText = "批量发消息";
    searchBtn.parentElement.insertBefore(x, searchBtn);
    G.showOrderListToolbarBtn = x;
    x.addEventListener("click", () => { G.orderListToolbar.show() });
  }
}

function domContentLoaded() {
  if (window.location.href == JinRiTeMaiConsts.chatPageURL) {
    let afterMessageSent = () => {
      window.close();
    }
    new ChatWindow().sendMesage("nihao", afterMessageSent);    
  } 
  if (Utils.checkInJinritemaiSite() && G.orderListToolbar == null) {
    G.orderListToolbar = new OrderListToolbar();
    G.orderListToolbar.registerEventListeners();
  }
}

/////////////////// Chat Window ////////////////////////////
class ChatWindow {
  constructor() {}

  sendMesage(message, callback) {
    const inputTypes = [
      window.HTMLInputElement,
      window.HTMLSelectElement,
      window.HTMLTextAreaElement,
    ];

    let triggerInputChange = (node, value = "") => {
      // only process the change on elements we know have a value setter in their constructor
      if (inputTypes.indexOf(node.__proto__.constructor) > -1) {
        const setValue = Object.getOwnPropertyDescriptor(
          node.__proto__,
          "value"
        ).set;
        const event = new Event("input", { bubbles: true });
        setValue.call(node, value);
        node.dispatchEvent(event);
      }
    };
    let inputArea = document.querySelector("textarea");
    let sendBtn = null;
    document.querySelectorAll("div[role=button]").forEach((dom) => {
      if (dom.textContent.includes("发 送")) {
        sendBtn = dom;
      }
    });

    triggerInputChange(inputArea, message);
    sendBtn.click();
    setTimeout(() => {
      callback();
    }, 200);
  }
}

///////////////// Utils /////////////////
class Utils {
  static checkInJinritemaiSite() {
    return window.location.host == JinRiTeMaiConsts.host;
  }

  static checkAuthenticationPass() {
    return !!this.cookies["sso"];
  }

  static checkInOrderListPage() {
    return window.location.href == JinRiTeMaiConsts.orderListPageUrl;
  }

  static injectCSS(document, cssFileName) {
    let cssTextContent = fs
      .readFileSync(path.join(app.getAppPath(), cssFileName))
      .toString();
    let cssHolder = document.createElement("style");
    cssHolder.type = "text/css";
    cssHolder.innerHTML = cssTextContent;
    document.head.append(cssHolder);
  }

  static injectHTML(document, htmlFileName) {
    let htmlContent = fs
      .readFileSync(path.join(app.getAppPath(), htmlFileName))
      .toString();
    let holder = document.createElement("div");
    holder.innerHTML = htmlContent;
    document.body.append(holder);

    this.toolbar = document.getElementById("chuyi-toolbar");
    this.toolbar.style.display = "block";
  }
}
////////////// NonOrderListToolBar /////////
class NonOrderListToolbar {
  constructor() {
    this.sessionInstance = session.fromPartition("persist:chuyi");

    Utils.injectCSS(document, "style.css");
    Utils.injectHTML(document, "non-orderlist-toolbar.html");
  }
}
/////////////// OrderListToolBar ///////////
class OrderListToolbar {
  toolbarOverlay = null;
  cookies = {};
  sessionInstance = null;
  sentBtn = null;
  cancelSentBtn = null;
  debugPanel = null;

  orderListRequestURL = null;
  orderListCurrentPage = 0;

  constructor() {
    Utils.injectCSS(document, "style.css");
    Utils.injectHTML(document, "orderlist-toolbar.html");

    this.sessionInstance = session.fromPartition("persist:chuyi");
    this.toolbarOverlay = document.getElementById("chuyi-toolbar-overlay");
    this.sentBtn = document.getElementById("message-sent-btn");
    this.cancelSentBtn = document.getElementById("cancel-sent-btn");
    this.debugPanel = document.getElementById("chat-log-panel");

    document.cookie.split("; ", -1).forEach((cookie) => {
      let pair = cookie.split("=");
      this.cookies[pair[0]] = pair[1];
    });
  }

  debug(message) {
    let p = document.createElement("p");
    p.innerText = message;
    this.debugPanel.append(p);
  }

  show() {
    this.toolbarOverlay.style.display = "flex";
  }

  hide() {
    this.toolbarOverlay.style.display = "none";
  }

  getOrder(oid) {
    let tpl = JinRiTeMaiConsts.orderDetailUrlTpl;
    let orderDetailURL = tpl
      .replace("${oid}", oid)
      .replace("${token}", this.__token)
      .replace("${appid}", this.appid)
      .replace("${lid}", this._lid);
    return fetch(orderDetailURL);
  }

  parseQueryInfo(query){
    if (query._lid) {
      this._lid = query._lid;
    }

    if (query.__token) {
      this.__token = query.__token;
    }

    if (query.appid) {
      this.appid = query.appid;
    }
  }

  registerEventListeners(){
    this.cancelSentBtn.addEventListener('click', () => {G.orderListToolbar.hide()});

    const filter = {
      urls: ["*://fxg.jinritemai.com/*"],
    };

    this.sessionInstance.webRequest.onCompleted(filter, (details) => {
      console.log(details.url);
      let query = url.parse(details.url).query;
      let decodedQuery = querystring.parse(query);
      this.parseQueryInfo(decodedQuery);
      if(details.url.includes(JinRiTeMaiConsts.searchListURL)){
        this.orderListRequestURL = details.url;
        this.orderListCurrentPage = decodedQuery.page;
        this.debug(this.orderListRequestURL);
        this.debug(this.orderListCurrentPage);
      }
    });
  }
}
