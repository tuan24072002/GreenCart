import axios from "axios";
import crypto from "crypto";
import Order from "../models/order.model.js";
import moment from "moment";

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