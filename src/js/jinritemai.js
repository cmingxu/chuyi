class JinRiTeMaiConsts {
    static orderListPageUrl =
      "https://fxg.jinritemai.com/ffa/morder/order/list";
    static orderDetailUrlTpl =
      "https://fxg.jinritemai.com/api/order/detail?order_id=${oid}&appid=${appid}&__token=${token}&_lid=879933770728";
    static host = "fxg.jinritemai.com";
    static chatPageUrlTpl =
      "https://im.jinritemai.com/pc_seller/main/chat?otherSideId=${otheruid}&fromOrder=${oid}&fromGoods=";

    static chatPageURL = "https://im.jinritemai.com/pc_seller/main/chat";
    static chatPageHost = "m.jinritemai.com";

    static exampleOrderId = "4743907853662458930";
    static exampleUid = "51029549973";

    static searchListURL = "https://fxg.jinritemai.com/api/order/searchlist";
  }

  module.exports = JinRiTeMaiConsts;