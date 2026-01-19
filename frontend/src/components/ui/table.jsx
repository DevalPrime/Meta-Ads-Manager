export function Table({ children, ...props }) {
  return <table className="w-full caption-bottom text-sm" {...props}>{children}</table>;
}

export function TableHeader({ children, ...props }) {
  return <thead className="border-b" {...props}>{children}</thead>;
}

export function TableBody({ children, ...props }) {
  return <tbody className="[&_tr:last-child]:border-0" {...props}>{children}</tbody>;
}

export function TableRow({ children, className = "", onClick, ...props }) {
  return <tr className={`border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100 ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick} {...props}>{children}</tr>;
}

export function TableHead({ children, className = "", ...props }) {
  return <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>{children}</th>;
}

export function TableCell({ children, className = "", ...props }) {
  return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props}>{children}</td>;
}
