import { useTranslation } from "react-i18next"

const NewsLetter = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
            <h1 className="md:text-4xl text-2xl font-semibold text-accent-foreground">{t(`home.missDeal.title`)}</h1>
            <p className="md:text-lg text-muted-foreground pb-8">
                {t(`home.missDeal.desc`)}
            </p>
            <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input
                    className="border border-border rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-muted-foreground"
                    type="text"
                    placeholder={t(`home.missDeal.form.placeholder`)}
                    required
                />
                <button type="submit" className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none">
                    {t(`home.missDeal.form.button`)}
                </button>
            </form>
        </div>
    )
}

export default NewsLetter