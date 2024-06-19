import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: "xs" | "sm" | "md" | "lg" | "xl";
  title: string;
}

const ReusableModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  width = "md",
  title,
}) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if ((event.target as Element).classList.contains("modal-overlay")) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    xs: "w-1/5",
    sm: "w-1/4",
    md: "w-1/3",
    lg: "w-3/4",
    xl: "w-full",
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div
        style={{
          background: "rgb(4,7,29)",
          backgroundColor:
            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        }}
        className={`rounded shadow-lg ${widthClasses[width]} z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-dot-white/[0.12] md:bg-dot-white/[0.15] py-5 px-6">
          <div className="flex items-start justify-between py-2 mb-4 rounded-t dark:border-gray-600">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReusableModal;
