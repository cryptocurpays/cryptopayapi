package cn.api.demo;

import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.bitcoinj.core.Address;
import org.bitcoinj.core.ECKey;
import org.bitcoinj.params.MainNetParams;

/**
 * Created by leo on 2018/12/3.
 */

@Controller
public class MainController {


    String app_address = "18Cs7nfrzJaRZaMwrp3ZWctS6X4TUPaFJN"; // bitcoin public address   平台验证参数 ,从网站后台中,已经生产的应用信息获取,这个数据不会改变
    Address expectedAddress = Address.fromBase58(MainNetParams.get(), app_address);

    /**
     * 接收 充值通知消息,实现deposit的post接口
     * @param request
     * @param response
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/deposit", produces = "application/json; charset=utf-8")
    public String httpMsgDecoder(HttpServletRequest request, HttpServletResponse response) {
        String returnMsg = "";
        try {
            String signature=request.getParameter("signature");//签名字段
            JSONObject js= new JSONObject();
            //从参数中,获取所有业务数据
            js.put("appId",request.getParameter("appId"));
            js.put("cryptoType",request.getParameter("cryptoType"));
            js.put("cryptoValue",request.getParameter("cryptoValue"));
            js.put("fee",request.getParameter("fee"));
            js.put("fiatCurrency",request.getParameter("fiatCurrency"));
            js.put("fiatRate",request.getParameter("fiatRate"));
            js.put("fromAddress",request.getParameter("fromAddress"));
            js.put("orderid",request.getParameter("orderid"));
            js.put("timestamp",request.getParameter("timestamp"));
            js.put("toAddress",request.getParameter("toAddress"));
            js.put("txId",request.getParameter("txId"));
            js.put("userId",request.getParameter("userId"));

            System.out.println(js.toString());



            //根据区块链 非对称加密验证规则计算验证
            String message = js.toString();
            MD5Helper md5 = new MD5Helper();
            ECKey key = ECKey.signedMessageToKey(md5.toMD5(message), signature);
            Address gotAddress = key.toAddress(MainNetParams.get());


            System.out.println("expectedAddress="+expectedAddress);//从平台获取的常量验证参数
            System.out.println("gotAddress="+gotAddress);//根据加密规则生成的计算参数,如果这两个数值相等的话,证明验证通过

            if(expectedAddress.equals(gotAddress)){
                // 签名验证成功后，需要验证订单相关信息，并验证 支付金额
                ///** 根据cryptoValue*fiatRate计算出实际法币价值，和商户订单中的支付金额的整数位比对，不要比对小数位。为避免充值金额重复，密付会对小数位做加减处理 */
    
                return "{\"message\":\"received!\"}";//System.out.println("success");
            }else{
                return "{\"message\":\"error!\"}";
            }
        }catch (Exception e){
            return "{\"message\":\"error!\"}";
        }


    }
}
