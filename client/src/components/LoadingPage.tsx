import { assets } from '@/assets/assets'

const LoadingPage = () => {
    return (
        <div className='w-screen h-screen flex items-center justify-center absolute top-0 left-0 z-50'>
            <img src={assets.logo} alt="Loading" className='w-1/5' />
        </div>
    )
}

export default LoadingPage