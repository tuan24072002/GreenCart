import { useAppContext } from "@/context/AppContext"
import { ArrowLeft, Box, CheckCircle, Truck } from "lucide-react"
import { useTranslation } from "react-i18next"
type Props = {
    orderId: string
    amount: string
    orderType: string
}
const Success = ({ orderId, amount, orderType }: Props) => {
    const { t } = useTranslation();
    const { currency, navigate } = useAppContext();
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center mb-8">
                    <button onClick={() => navigate("/")} className="flex items-center text-green-700 hover:text-green-800 transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span>{t(`redirectPayment.success.back`)}</span>
                    </button>
                </div>
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-20 h-20 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {t(`redirectPayment.success.title`)}
                        </h1>
                        <p className="text-gray-600">
                            {t(`redirectPayment.success.thanks`)} <span className="text-primary">
                                GreenCart
                            </span>
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-green-50 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700 font-medium">{t(`redirectPayment.success.orderId`)}:</span>
                            <span className="text-green-700 font-bold">{orderId}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700 font-medium">{t(`redirectPayment.success.total`)}:</span>
                            <span className="text-green-700 font-bold">{Number(amount)?.toLocaleString()}{currency}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">{t(`redirectPayment.success.paymentMethod`)}:</span>
                            <span className="text-gray-800">{orderType}</span>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-6 mb-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <Box className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-medium text-gray-800 mb-1">{t(`redirectPayment.success.title1`)}</h3>
                                <p className="text-gray-600 text-sm">
                                    {t(`redirectPayment.success.desc1`)}
                                </p>
                            </div>
                        </div>
                        <div className="my-4 border-t border-gray-200"></div>
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <Truck className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-medium text-gray-800 mb-1">{t(`redirectPayment.success.title2`)}</h3>
                                <p className="text-gray-600 text-sm">
                                    {t(`redirectPayment.success.desc2`)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate("/my-orders")} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                            {t(`redirectPayment.success.followOrder`)}
                        </button>
                        <button onClick={() => navigate("/products")} className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">
                            {t(`redirectPayment.success.continue`)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Success