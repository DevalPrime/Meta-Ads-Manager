export function Sheet({ children, open, onOpenChange }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)}></div>
      {children}
    </div>
  );
}

export function SheetContent({ children, className = "", side = "right", ...props }) {
  const sideStyles = {
    right: "inset-y-0 right-0 border-l",
    left: "inset-y-0 left-0 border-r",
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
  };
  
  return (
    <div className={`fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out ${sideStyles[side] || sideStyles.right} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function SheetHeader({ children, ...props }) {
  return <div className="flex flex-col space-y-2 text-center sm:text-left" {...props}>{children}</div>;
}

export function SheetTitle({ children, className = "", ...props }) {
  return <h2 className={`text-lg font-semibold text-gray-900 ${className}`} {...props}>{children}</h2>;
}
