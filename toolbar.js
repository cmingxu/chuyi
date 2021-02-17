const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const path = require("path");

class Toolbar {
    toolbar = null;
    cookies = {};
    sessionInstance = null;
    query_token = null;
    query_appid = null;
    query_lid = null;
    chat_window_id = null;
  
    constructor() {
      let toolbarCSS = fs
        .readFileSync(path.join(app.getAppPath(), "style.css"))
        .toString();
      let cssHolder = document.createElement("style");
      cssHolder.type = "text/css";
      cssHolder.innerHTML = toolbarCSS;
      document.head.append(cssHolder);
  
      let toolbarHTML = fs
        .readFileSync(path.join(app.getAppPath(), "toolbar.html"))
        .toString();
      let holder = document.createElement("div");
      holder.innerHTML = toolbarHTML;
      document.body.append(holder);
  
      this.toolbar = document.getElementById("chuyi-toolbar");
      document.cookie.split("; ", -1).forEach((cookie) => {
        let pair = cookie.split("=");
        this.cookies[pair[0]] = pair[1];
      });
  
      this.sessionInstance = session.fromPartition("persist:chuyi");
    }
  
    show() {
      this.toolbar.style.display = "block";
    }
    hide() {
      this.toolbar.style.display = "none";
    }
  
    checkInJinritemaiSite() {
      return window.location.host == JinRiTeMaiConsts.host;
    }
  
    checkAuthenticationPass() {
      return !!this.cookies["sso"];
    }
  
    checkInOrderListPage() {
      return window.location.href == JinRiTeMaiConsts.orderListPageUrl;
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
  
    registerEventListeners() {
      const filter = {
        urls: ["*://fxg.jinritemai.com/*"],
      };
  
      this.sessionInstance.webRequest.onCompleted(filter, (details) => {
        console.log(details.url);
        let query = url.parse(details.url).query;
        let decodedQuery = querystring.parse(query);
        if (decodedQuery._lid) {
          this._lid = decodedQuery._lid;
        }
  
        if (decodedQuery.__token) {
          this.__token = decodedQuery.__token;
        }
  
        if (decodedQuery.appid) {
          this.appid = decodedQuery.appid;
        }
      });
  
      document
        .getElementById("order-detail-btn")
        .addEventListener("click", () => {
          this.getOrder(JinRiTeMaiConsts.exampleOrderId)
            .then((resp) => {
              return resp.json();
            })
            .then((data) => {
              console.log(data);
              document.getElementById("order-user-info").innerText =
                data.data.user.user_id;
            })
            .catch((err) => {
              document.getElementById("order-user-info").innerText = err;
            });
        });
  
      document.getElementById("auto-chat-btn").addEventListener("click", () => {
        let chatUrlTpl = JinRiTeMaiConsts.chatPageUrlTpl;
        let chatUrl = chatUrlTpl
          .replace("${otheruid}", JinRiTeMaiConsts.exampleUid)
          .replace("${oid}", JinRiTeMaiConsts.exampleUid);
        this.chat_window_id = window.open(chatUrl, "_blank");
        setTimeout(() => {
          this.chat_window_id.close();
        }, 24000);
      });
    }
  
    unregisterEventListeners() {}
  }
  
  module.exports = Toolbar;