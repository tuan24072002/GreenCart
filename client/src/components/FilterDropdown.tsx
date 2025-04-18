import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setFiltered } from '@/slice/product/Product.slice';
interface Props {
    className?: string;
    category?: string;
}
const FilterDropdown = ({ className, category }: Props) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { list } = useAppSelector(state => state.product);
    const { navigate } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [rating, setRating] = useState(0);

    const categories = useMemo(
        () => ['All', ...new Set(list.map(product => product.category))],
        [list]
    );

    useEffect(() => {
        const filteredProducts = list.filter(product => {
            const minPrice = priceRange.min ? parseFloat(priceRange.min.replace(/\D/g, '')) : null;
            const maxPrice = priceRange.max ? parseFloat(priceRange.max.replace(/\D/g, '')) : null;
            if (minPrice && product.offerPrice < minPrice) return false;
            if (maxPrice && product.offerPrice > maxPrice) return false;
            if (rating > 0 && product.rating !== rating) return false;
            if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
            return true;
        });
        dispatch(setFiltered(filteredProducts));
    }, [rating, priceRange.min, priceRange.max, selectedCategory, list, dispatch])
    useEffect(() => {
        if (category) {
            setSelectedCategory(categories.find(cat => cat.toLowerCase() === category?.toLowerCase()) || 'All');
            setPriceRange({ min: '', max: '' });
            setRating(0);
        } else {
            dispatch(setFiltered(list));
        }
    }, [category, categories, dispatch, list])
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        let value = e.target.value;
        value = value.replace(/\D/g, '');
        if (type === 'min') setPriceRange({ ...priceRange, min: value });
        if (type === 'max') setPriceRange({ ...priceRange, max: value });
    };

    const handlePriceBlur = (type: 'min' | 'max') => {
        if (type === "min" && priceRange.min) {
            const numberValue = parseInt(priceRange.min, 10);
            if (!isNaN(numberValue)) {
                setPriceRange({ ...priceRange, min: numberValue.toLocaleString() + " VNĐ" });
            }
        } else if (type === "max" && priceRange.max) {
            const numberValue = parseInt(priceRange.max, 10);
            if (!isNaN(numberValue)) {
                setPriceRange({ ...priceRange, max: numberValue.toLocaleString() + " VNĐ" });
            }
        } else {
            return;
        }
    };

    const handlePriceFocus = (type: 'min' | 'max') => {
        if (type === "min" && priceRange.min) {
            const numericValue = priceRange.min.replace(/,/g, '').replace(/ VNĐ/g, '');
            setPriceRange({ ...priceRange, min: numericValue });
        } else if (type === "max" && priceRange.max) {
            const numericValue = priceRange.max.replace(/,/g, '').replace(/ VNĐ/g, '');
            setPriceRange({ ...priceRange, max: numericValue });
        } else {
            return;
        }
    };

    return (
        <div className={cn("", className)}>
            <div className="w-full">
                <label className="block text-sm font-medium text-primary mb-1">
                    {t(`products.filter.category`)}
                </label>
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        if (e.target.value === "All") {
                            navigate("/products");
                        } else {
                            navigate(`/products/${e.target.value.toLowerCase()}`);
                        }
                        setSelectedCategory(e.target.value)
                    }}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                    {categories.map((cat, index) => (
                        <option key={`category-${index}`} value={cat}>
                            {t(`products.category.${cat.toLowerCase()}`)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-primary mb-1">
                    {t(`products.filter.rating`)}
                </label>
                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                    <option value={0}>{t(`products.all`)}</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-primary mb-1">
                    {t(`products.filter.min`)}
                </label>
                <input
                    type="text"
                    value={priceRange.min}
                    placeholder='VNĐ'
                    onChange={(e) => handlePriceChange(e, 'min')}
                    onBlur={() => handlePriceBlur('min')}
                    onFocus={() => handlePriceFocus('min')}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
            </div>
            <div className="w-full">
                <label className="block text-sm font-medium text-primary mb-1">
                    {t(`products.filter.max`)}
                </label>
                <input
                    type="text"
                    value={priceRange.max}
                    placeholder='VNĐ'
                    onChange={(e) => handlePriceChange(e, 'max')}
                    onBlur={() => handlePriceBlur('max')}
                    onFocus={() => handlePriceFocus('max')}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
            </div>
        </div>
    );
};

export default FilterDropdown