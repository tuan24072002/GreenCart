import { Skeleton } from "./ui/skeleton"

const ProductCardSkeleton = () => {
    return (
        <div className="border border-border bg-card rounded-md max-w-54 md:px-4 px-3 py-2">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <Skeleton className="w-full h-32" />
            </div>
            <div className="text-muted-foreground text-sm px-2 mt-4 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-2 w-full" />
                <div className="flex flex-col gap-2 mt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="px-2 py-4 w-20 ml-auto" />
            </div>
        </div>
    )
}

export default ProductCardSkeleton