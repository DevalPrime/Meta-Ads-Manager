import React from "react";

export function Tabs({ children, value, onValueChange, ...props }) {
  return <div {...props}>{children}</div>;
}

export function TabsList({ children, className = "", ...props }) {
  return <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`} {...props}>{children}</div>;
}

export function TabsTrigger({ children, className = "", value, ...props }) {
  return <button className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm ${className}`} {...props}>{children}</button>;
}

export function TabsContent({ children, className = "", value, ...props }) {
  return <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`} {...props}>{children}</div>;
}
