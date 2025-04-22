import { FormEvent } from 'react';
import { Wallet2 } from 'lucide-react';
import { paymentMethods } from '@/assets/assets';
import { Button } from '../ui/button';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { paymentMomo, paymentVNPay, paymentZaloPay, setSelectedMethod, setShowCheckoutOnline } from '@/slice/payment/Payment.slice';
import { placeOrderOnline } from '@/slice/order/Order.slice';
import toast from 'react-hot-toast';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from 'react-i18next';
type Props = {
    dataPayment: ProductType[],
    isPlaceOrder: boolean
}
function CheckoutOnline({ dataPayment, isPlaceOrder }: Props) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const appState = useAppSelector(state => state.app);
    const orderState = useAppSelector(state => state.order);
    const paymentState = useAppSelector(state => state.payment);
    const addressState = useAppSelector(state => state.address);
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const dataPay = dataPayment.map((item) => ({
            product: item.id,
            quantity: item.quantity
        }));
        if (paymentState.selectedMethod === "momo") {
            dispatch(setShowCheckoutOnline(false));
            // output [{ product: '123', quantity: 1 }]
            if (isPlaceOrder) {
                const payload = {
                    items: dataPay,
                    address: addressState.item.id
                }
                dispatch(placeOrderOnline(payload));
            } else {
                dispatch(paymentMomo({
                    orderId: orderState.item.id,
                    amount: orderState.item.amount,
                    lang: appState.language
                }))
            }
        } else if (paymentState.selectedMethod === "zalopay") {
            dispatch(setShowCheckoutOnline(false));
            if (isPlaceOrder) {
                const payload = {
                    items: dataPay,
                    address: addressState.item.id
                }
                dispatch(placeOrderOnline(payload));
            } else {
                dispatch(paymentZaloPay({
                    orderId: orderState.item.id,
                    amount: orderState.item.amount
                }))
            }
        } else if (paymentState.selectedMethod === "vnpay") {
            dispatch(setShowCheckoutOnline(false));
            if (isPlaceOrder) {
                const payload = {
                    items: dataPay,
                    address: addressState.item.id
                }
                dispatch(placeOrderOnline(payload));
            } else {
                dispatch(paymentVNPay({
                    orderId: orderState.item.id,
                    amount: orderState.item.amount,
                    lang: appState.language === "vi" ? "vn" : appState.language === 'en' ? 'en' : ""
                }))
            }
        } else {
            toast.error("This payment method is not available. Please choose a different one.")
        }
    }
    return (
        <Dialog open={paymentState.showCheckoutOnline} onOpenChange={(open) => dispatch(setShowCheckoutOnline(open))}>
            <DialogContent className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 !z-50">
                <DialogHeader className="mb-6">
                    <DialogTitle className="flex items-center gap-2 flex-1">
                        <Wallet2 className="w-6 h-6 text-primary" />
                        <span className="md:text-xl text-lg font-semibold text-gray-800">{t("checkoutOnline.title")}</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentState.selectedMethod === method.id
                                    ? 'border-primary/70 bg-primary/10'
                                    : 'border-gray-200 hover:border-blue-200'
                                    }`}
                                onClick={() => dispatch(setSelectedMethod(method.id))}
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        src={method.logo}
                                        alt={method.name}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                </div>
                                <div className="ml-4 flex-grow">
                                    <h3 className="font-medium text-gray-900">{t(`checkoutOnline.${method.name}.title`)}</h3>
                                    <p className="text-sm text-gray-500">{t(`checkoutOnline.${method.name}.desc`)}</p>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 ${paymentState.selectedMethod === method.id
                                            ? 'border-primary/70 bg-primary/70'
                                            : 'border-gray-300'
                                            }`}
                                    >
                                        {paymentState.selectedMethod === method.id && (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button
                            type='submit'
                            className={`w-full mt-6 py-6 px-4 rounded-lg font-medium transition-all ${paymentState.selectedMethod
                                ? 'bg-primary text-white hover:bg-primary-dull'
                                : 'bg-gray-100 text-gray-400 !cursor-not-allowed'
                                }`}
                            disabled={!paymentState.selectedMethod}
                        >
                            {t(`checkoutOnline.button`)}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CheckoutOnline;