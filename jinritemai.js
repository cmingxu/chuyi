class JinRiTeMaiConsts {
    static orderListPageUrl =
      "https://fxg.jinritemai.com/index.html#/ffa/morder/order/list";
    static orderDetailUrlTpl =
      "https://fxg.jinritemai.com/api/order/detail?order_id=${oid}&appid=${appid}&__token=${token}&_lid=879933770728";
    static host = "fxg.jinritemai.com";
    static chatPageUrlTpl =
      "https://im.jinritemai.com/pc_seller/main/chat?otherSideId=${otheruid}&fromOrder=${oid}&fromGoods=";
    static exampleOrderId = "4757317673561632025";
    static exampleUid = "82830902902";
  }

  module.exports = JinRiTeMaiConsts;