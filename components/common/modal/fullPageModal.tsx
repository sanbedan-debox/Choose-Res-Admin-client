import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import CButton from "../button/button";
import { ButtonType } from "../button/interface";
import { AnimatePresence, motion } from "framer-motion";
import { fadeIn } from "@/utils/animations";

interface FullPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  comments?: string;
  actionButtonLabel: string;
  onActionButtonClick: () => void;
}

const FullPageModal: React.FC<FullPageModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  comments,
  actionButtonLabel,
  onActionButtonClick,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-45 z-50 flex items-center justify-center"
        >
          <motion.div
            variants={fadeIn("up", "tween", 0, 0.3)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="bg-white w-full h-full max-h-full overflow-auto"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-4 ">
                <h2 className="text-2xl font-bold text-black">{title}</h2>
                <button
                  type="button"
                  className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
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

              <div className="flex-grow overflow-auto px-6 py-4">
                {comments && <p className="text-gray-700 mb-4">{comments}</p>}
                {children}
              </div>

              {/* <div className="sticky bottom-4 z-20  flex justify-center">
              <CButton
                variant={ButtonType.Primary}
                type="button"
                className="w-96 "
                onClick={onActionButtonClick}
              >
                {actionButtonLabel}
              </CButton>
            </div> */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FullPageModal;
