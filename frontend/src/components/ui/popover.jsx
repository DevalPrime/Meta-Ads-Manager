import React, { createContext, useContext, useState } from "react";

const PopoverContext = createContext();

export function Popover({ children, open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild, ...props }) {
  const { setIsOpen } = useContext(PopoverContext);
  
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick, ...props });
  }

  return <button onClick={handleClick} {...props}>{children}</button>;
}

export function PopoverContent({ children, className = "", align = "center", ...props }) {
  const { isOpen, setIsOpen } = useContext(PopoverContext);

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
        className={`absolute z-50 mt-2 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-900 shadow-md outline-none animate-in fade-in-80 ${alignmentClasses[align]} ${className}`} 
        {...props}
      >
        {children}
      </div>
    </>
  );
}
