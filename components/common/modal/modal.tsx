import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: "xs" | "sm" | "md" | "ml" | "lg" | "xl";
  title: string;
  comments?: string;
}

const ReusableModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  width = "md",
  title,
  comments,
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
    ml: "w-1/2",
    lg: "w-3/4",
    xl: "w-full",
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div
        className={`rounded shadow-lg bg-white ${widthClasses[width]} z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-5 px-6">
          <div className="flex items-start justify-between py-2 rounded-t">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-black">{title}</h2>
            </div>
            <button
              type="button"
              className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-primary dark:hover:text-white"
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
          {comments && (
            <p
              className="text-gray-700
           mb-4"
            >
              {comments}
            </p>
          )}{" "}
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReusableModal;
