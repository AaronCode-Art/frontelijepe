import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface ToastProps {
  msg: string;
  onClose: () => void;
}

export default function Toast({ msg, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-white border border-green-200 shadow-xl rounded-xl px-5 py-3 animate-slide-in-right">
      <CheckCircle className="text-green-500 shrink-0" size={20} />
      <span className="text-sm font-medium text-gray-800">{msg}</span>
    </div>
  );
}
