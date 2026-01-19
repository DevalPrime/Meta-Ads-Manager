export function Badge({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "bg-gray-100 text-gray-900 border-transparent",
    success: "bg-green-100 text-green-800 border-transparent",
    warning: "bg-yellow-100 text-yellow-800 border-transparent",
    destructive: "bg-red-100 text-red-800 border-transparent",
    outline: "text-gray-900 border-gray-300",
  };
  
  const variantClass = variants[variant] || variants.default;
  
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClass} ${className}`} {...props}>{children}</span>;
}
