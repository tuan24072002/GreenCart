import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { useAppContext } from "@/context/AppContext"
import { paymentMomo, resetActionStatePayment } from "@/slice/payment/Payment.slice"
import { processing } from "@/utils/alert"
import { AlertCircle, ArrowLeft, CreditCard, RefreshCcw, XCircle } from "lucide-react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
type Props = {
    orderId: string
    amount: string
    orderType: string
}
const Failed = ({ orderId, amount, orderType }: Props) => {
    const { t } = useTranslation();
    const { currency, navigate } = useAppContext();
    const dispatch = useAppDispatch();
    const paymentState = useAppSelector(state => state.payment);
    const appState = useAppSelector(state => state.app);
    const handleRetry = () => {
        if (paymentState.selectedMethod === "momo") {
            dispatch(paymentMomo({
                orderId: orderId,
                amount: amount,
                lang: appState.language
            }))
        } else {
            navigate("/my-orders")
        }
    }
    useEffect(() => {
        switch (paymentState.statusAction) {
            case "failed":
                toast.error(paymentState.error ?? "");
                dispatch(resetActionStatePayment());
                break;
            case "loading":
                processing("Processing", true);
                break;
            case "completed":
                if (paymentState.itemMomo.resultCode === 0) {
                    window.location.href = paymentState.itemMomo.payUrl;
                }
                dispatch(resetActionStatePayment());
                break;
        }
    }, [dispatch, paymentState.error, paymentState.itemMomo.payUrl, paymentState.itemMomo.resultCode, paymentState.statusAction])
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center mb-8">
                    <button onClick={() => navigate("/")} className="flex items-center text-red-700 hover:text-red-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span>{t(`redirectPayment.failed.back`)}</span>
                    </button>
                </div>

                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <XCircle className="w-20 h-20 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {t(`redirectPayment.failed.title`)}
                        </h1>
                        <p className="text-gray-600">
                            {t(`redirectPayment.failed.sorry`)}
                        </p>
                    </div>

                    <div className="bg-red-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700 font-medium">{t(`redirectPayment.failed.orderId`)}:</span>
                            <span className="text-red-700 font-bold">{orderId}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700 font-medium">{t(`redirectPayment.failed.total`)}:</span>
                            <span className="text-red-700 font-bold">{Number(amount)?.toLocaleString()}{currency}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">{t(`redirectPayment.failed.paymentMethod`)}:</span>
                            <span className="text-gray-800">{orderType}</span>
                        </div>
                    </div>

                    <div className="border border-red-200 rounded-xl p-6 mb-6 bg-red-50">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-medium text-gray-800 mb-1">{t(`redirectPayment.failed.reason.title`)}</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {t(`redirectPayment.failed.reason.desc`)}
                                </p>
                                <div className="bg-white rounded-lg p-4 border border-red-100">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">{t(`redirectPayment.failed.reason.idea.title`)}:</h4>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li className="flex items-center">
                                            <RefreshCcw className="w-4 h-4 mr-2 text-red-500" />
                                            {t(`redirectPayment.failed.reason.idea.idea1`)}
                                        </li>
                                        <li className="flex items-center">
                                            <CreditCard className="w-4 h-4 mr-2 text-red-500" />
                                            {t(`redirectPayment.failed.reason.idea.idea2`)}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-gray-600 text-sm">
                            {t(`redirectPayment.failed.desc`)}
                            <a href="tel:0587928264" className="text-red-600 hover:text-red-700 ml-1">
                                hotline 058 7928 264
                            </a>
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={handleRetry} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                            {t(`redirectPayment.failed.paymentAgain`)}
                        </button>
                        <button onClick={() => navigate("/my-orders")} className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                            {t(`redirectPayment.failed.otherPayment`)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Failed