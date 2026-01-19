import React, { createContext, useContext, useState } from "react";

const DropdownContext = createContext();

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild, ...props }) {
  const { setIsOpen } = useContext(DropdownContext);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick, ...props });
  }

  return <button onClick={handleClick} {...props}>{children}</button>;
}

export function DropdownMenuContent({ children, className = "", align = "center", ...props }) {
  const { isOpen, setIsOpen } = useContext(DropdownContext);

  if (!isOpen) return null;

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setIsOpen(false)}
      />
      <div 
        className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md animate-in fade-in-80 ${alignmentClasses[align]} ${className}`} 
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function DropdownMenuLabel({ children, className = "", ...props }) {
  return <div className={`px-2 py-1.5 text-sm font-semibold ${className}`} {...props}>{children}</div>;
}

export function DropdownMenuItem({ children, className = "", ...props }) {
  return (
    <div className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className = "" }) {
  return <hr className={`-mx-1 my-1 h-px bg-gray-200 ${className}`} />;
}
