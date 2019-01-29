<?php
//phpinfo();
require __DIR__ . "/../vendor/autoload.php";
use BitWasp\Bitcoin\Address\AddressCreator;
use BitWasp\Bitcoin\Address\PayToPubKeyHashAddress;
use BitWasp\Bitcoin\Bitcoin;
use BitWasp\Bitcoin\Crypto\EcAdapter\EcSerializer;
use BitWasp\Bitcoin\Crypto\EcAdapter\Serializer\Signature\CompactSignatureSerializerInterface;
use BitWasp\Bitcoin\MessageSigner\MessageSigner;
use BitWasp\Bitcoin\Network\NetworkFactory;
use BitWasp\Bitcoin\Serializer\MessageSigner\SignedMessageSerializer;


Bitcoin::setNetwork(NetworkFactory::bitcoin());

$app_address='18Cs7nfrzJaRZaMwrp3ZWctS6X4TUPaFJN';//bitcoin public address   平台验证参数 ,从网站后台中,已经生产的应用信息获取,这个数据不会改变

$input = file_get_contents("php://input");// 接受到通过post传递过来的充值信息参数,json格式
$input = json_decode($input,true);
$signatureStr = $input["signature"];
unset($input["signature"]);
$sigmsg = json_encode($input);
$sigmsg =md5($sigmsg);
$sig = '-----BEGIN BITCOIN SIGNED MESSAGE-----
'.$sigmsg.'
-----BEGIN SIGNATURE-----
'.$signatureStr.'
-----END BITCOIN SIGNED MESSAGE-----';

$addressCreator = new AddressCreator();
/** @var PayToPubKeyHashAddress $address */
$app_address = $addressCreator->fromString($app_address);
/** @var CompactSignatureSerializerInterface $compactSigSerializer */
$compactSigSerializer = EcSerializer::getSerializer(CompactSignatureSerializerInterface::class);
$serializer = new SignedMessageSerializer($compactSigSerializer);

$signedMessage = $serializer->parse($sig);
$signer = new MessageSigner();
if ($signer->verify($signedMessage, $app_address)) {
    echo "Signature verified!\n";// 验证加密签名成功
    /** 加密验证成功后，需要对订单信息做验证，并验证订单金额 */
    /** 根据cryptoValue*fiatRate计算出实际法币价值，和商户订单中的支付金额的整数位比对，不要比对小数位。为避免充值金额重复，密付会对小数位做加减处理 */
    
} else {
    echo "Failed to verify signature!\n";
}


?>
