import axios from "axios";
import crypto from "crypto";
import Order from "../models/order.model.js";
import moment from "moment";
import querystring from "qs";

const accessKeyMomo = process.env.MOMO_ACCESS_KEY;
const secretKeyMomo = process.env.MOMO_SECRET_KEY;


// Momo
export const paymentMomo = async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    const {
        orderId,
        amount,
        lang
    } = req.body;

    if (!orderId || !amount || !lang) {
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        })
    }

    //parameters
    const orderInfo = 'GreenCart payment with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = process.env.FRONTEND_URL + "/redirectUrl/momo";
    const ipnUrl = process.env.CALLBACK_URL + '/api/payment/momo/callback'; //Momo callback return result by this url
    const requestType = "payWithMethod";
    const requestId = `${moment().format('YYMMDDHHmmss')}_${orderId}`;
    const extraData = '';
    const orderGroupId = '';
    const autoCapture = true;
    // const lang = "en";

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature = "accessKey=" + accessKeyMomo + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + requestId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

    //signature
    const signature = crypto.createHmac('sha256', secretKeyMomo)
        .update(rawSignature)
        .digest('hex');

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        orderId: requestId,
        amount: amount,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });
    //option for axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody)
        },
        data: requestBody
    }
    let result;
    try {
        result = await axios(options);
        return res.status(201).json({
            success: true, data: result.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const callbackMomo = async (req, res) => {
    try {
        const { orderId, resultCode, message } = req.body;
        if (resultCode !== 0) {
            return res.status(400).json({
                success: false,
                message: message
            })
        }
        //update order here
        await Order.findByIdAndUpdate(orderId?.split("_")[1], { isPaid: true, paymentType: "Momo" });

        return res.status(200).json({
            success: true,
            message: message
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const checkTransactionMomo = async (req, res) => {
    const { orderId, lang } = req.body;
    if (!orderId || !lang) {
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        })
    }
    const rawSignature = `accessKey=${accessKeyMomo}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
    const signature = crypto
        .createHmac('sha256', secretKeyMomo)
        .update(rawSignature)
        .digest('hex');
    const requestBody = JSON.stringify({
        partnerCode: "MOMO",
        requestId: orderId,
        orderId,
        signature: signature,
        lang: lang
    });

    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/query",
        headers: {
            "Content-Type": "application/json"
        },
        data: requestBody
    }
    let result;
    try {
        result = await axios(options);
        return res.status(200).json({
            success: true, data: result.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const confirmPaymentMomo = async (req, res) => {
    const {
        orderId,
        amount,
        lang
    } = req.body;
    if (!orderId || !amount || !lang) {
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        })
    }
    const partnerCode = "MOMO";
    const requestId = orderId;
    const requestType = "capture";
    const rawSignature = `accessKey=${accessKeyMomo}&amount=${amount}&description=&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
        .createHmac('sha256', secretKeyMomo)
        .update(rawSignature)
        .digest('hex');
    const requestBody = JSON.stringify({
        partnerCode,
        requestId,
        orderId,
        requestType,
        amount: amount + "",
        signature,
        lang
    });
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/confirm",
        headers: {
            "Content-Type": "application/json"
        },
        data: requestBody
    }
    let result;
    try {
        result = await axios(options);
        return res.status(200).json({
            success: true, data: result.data
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// ZaloPay
export const paymentZaloPay = async (req, res) => {
    try {
        const {
            orderId,
            amount
        } = req.body;
        const embed_data = {
            redirectUrl: process.env.FRONTEND_URL + "/redirectUrl/zalopay"
        };

        const items = [];
        const order = {
            app_id: process.env.ZALOPAY_APPID,
            app_trans_id: `${moment().format('YYMMDDHHmmss')}_${orderId}`,
            app_user: req.user.userId,
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: amount,
            callback_url: process.env.CALLBACK_URL + '/api/payment/zalopay/callback',
            description: `GreenCart - Payment for the order #${orderId}`,
            bank_code: ""
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data =
            process.env.ZALOPAY_APPID +
            "|" +
            order.app_trans_id +
            "|" +
            order.app_user +
            "|" +
            order.amount +
            "|" +
            order.app_time +
            "|" +
            order.embed_data +
            "|" +
            order.item;
        order.mac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY1)
            .update(data)
            .digest('hex');

        try {
            const response = await axios.post("https://sb-openapi.zalopay.vn/v2/create", null, { params: order });
            return res.status(200).json({ success: true, data: response.data });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const callbackZaloPay = async (req, res) => {
    try {
        const dataStr = req.body.data;
        const reqMac = req.body.mac;

        const mac = crypto.createHmac('sha256', process.env.ZALOPAY_KEY2)
            .update(dataStr)
            .digest('hex');
        if (mac !== reqMac) {
            return res.status(400).json({ success: false, message: "Mac not equal" });
        } else {
            const data = JSON.parse(dataStr);
            await Order.findByIdAndUpdate(data.app_trans_id?.split("_")[1], { isPaid: true, paymentType: "ZaloPay" });

            return res.status(200).json({
                success: true,
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// VNPay
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj?.hasOwnProperty(key)) {
            str?.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
export const paymentVNPay = async (req, res) => {
    try {
        const {
            orderId,
            amount,
            lang
        } = req.query;

        process.env.TZ = 'Asia/Ho_Chi_Minh';

        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = process.env.VNPAY_TMNCODE;
        let secretKey = process.env.VNPAY_HASHSECRET;
        let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        // let returnUrl = process.env.FRONTEND_URL + "/redirectUrl/vnpay";
        let returnUrl = process.env.CALLBACK_URL + '/api/payment/vnpay/callback';
        let bankCode = "";

        let locale = lang;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = `${moment().format('YYMMDDHHmmss')}_${orderId}`;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + `${moment().format('YYMMDDHHmmss')}_${orderId}`;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return res.status(200).json({
            success: true,
            data: { vnpUrl }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const callbackVNPay = async (req, res) => {
    try {
        let vnp_Params = { ...req.query };

        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        let secretKey = process.env.VNPAY_HASHSECRET;
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        const orderId = vnp_Params["vnp_TxnRef"].split("_")[1];

        if (secureHash === signed && vnp_Params["vnp_TransactionStatus"] === "00") {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            await Order.findByIdAndUpdate(orderId, { isPaid: true, paymentType: "VNPay" });
            return res.redirect(
                `${process.env.FRONTEND_URL}/redirectUrl/vnpay?status=0&orderId=${orderId}&amount=${Number(vnp_Params["vnp_Amount"]) / 100}`
            );
        } else {
            return res.redirect(
                `${process.env.FRONTEND_URL}/redirectUrl/vnpay?status=1&orderId=${orderId}&amount=${Number(vnp_Params["vnp_Amount"]) / 100}`
            );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}