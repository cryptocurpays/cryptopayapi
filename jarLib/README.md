jar包使用方法

引入jar包后，调用一下逻辑
CryptoPayAPI cp = new CryptoPayAPI("1yuz3vEzi4VJ12piU9t5P6rr9Nga9eZUg");//从平台新建应用,生成的验证地址
//充值成功消息中,所带的所有post参数,转换成字符串
String postData = "{\"appId\":\"8731\",\"cryptoType\":\"ccn\",\"cryptoValue\":\"100\",\"fee\":\"-2\",\"fiatCurrency\":\"cny\",\"fiatRate\":\"1\",\"fromAddress\":\"otc\",\"orderid\":\"3052566513132906496\",\"timestamp\":\"1545879045834\",\"toAddress\":\"0x1b80834ffc829ae037ff2866cff8575ec36ae94e\",\"txId\":\"0x010962fb47697dfe678decd1bcb3377973\",\"userId\":\"legend\",\"signature\":\"H2Oh5tpq3KaDMWdrGbYX9VNk9pXtb8UqxG9ZtZfE8xDWLK0O4z7lWJILrlcWA3FGrUjtL3YhhcJB4D19DrYONJ8=\"}";
//返回true,说明验证成功,false,则签名验证失败
System.out.println(cp.signature(postData));

//本例子会验证失败，仅提供使用示范。
