// Archivo: src/components/ProductSkeleton.jsx
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-square rounded-[22px] bg-stone" />
    <div className="pt-4 px-1 space-y-2">
      <div className="h-2.5 w-12 rounded-full bg-stone" />
      <div className="h-4 w-3/4 rounded-full bg-stone" />
      <div className="h-4 w-1/3 rounded-full bg-stone" />
    </div>
  </div>
);

export default ProductSkeleton;
