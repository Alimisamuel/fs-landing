import { AnimatePresence, motion } from "framer-motion";
import { FC, ReactNode, useState } from "react";


interface FlyoutLinkProps {
  children: ReactNode;
  FlyoutContent?: FC;
}

const FlyoutContainer: FC<FlyoutLinkProps> = ({ children, FlyoutContent }) => {
  const [open, setOpen] = useState(false);

  const showFlyout = FlyoutContent && open;

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative flex flex-col items-center"
    >
      {children}
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-full rounded-lg shadow-lg z-10"
          >
            <div className="relative">
              {/* Optional arrow */}
              <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 " />
              <div className="pt-2">
                <FlyoutContent />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default FlyoutContainer;