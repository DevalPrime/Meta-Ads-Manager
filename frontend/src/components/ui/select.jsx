import React, { createContext, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";

const SelectContext = createContext();

export function Select({ children, defaultValue, onValueChange }) {
  const [value, setValue] = useState(defaultValue || "");
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, isOpen, setIsOpen, handleSelect }}>
      <div className="relative inline-block">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className = "", ...props }) {
  const { setIsOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setIsOpen((prev) => !prev)}
      className={`flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} 
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);
  return <span className="text-gray-900">{value || placeholder}</span>;
}

export function SelectContent({ children, className = "", ...props }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setIsOpen(false)}
      />
      <div 
        className={`absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-900 shadow-md animate-in fade-in-80 ${className}`} 
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function SelectItem({ children, value, ...props }) {
  const { handleSelect, value: selectedValue } = useContext(SelectContext);

  return (
    <div 
      onClick={() => handleSelect(value)}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${selectedValue === value ? 'bg-gray-100 font-medium' : ''}`} 
      {...props}
    >
      {children}
    </div>
  );
}
