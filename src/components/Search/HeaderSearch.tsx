"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { TextField } from "@mui/material";
import { RiSearch2Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

const HeaderSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(searchParams.get("q") || "");


    const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedQuery]);

  const handleToggle = () => {
    if (isOpen && query) {
      setQuery("");
    }
    setIsOpen(!isOpen);
  };


  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 282, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <TextField
             inputRef={inputRef}
              value={query}
              autoComplete="off"
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              size="small"
            
              placeholder="Tittle, actors, genres"
              slotProps={{
                input: {
                  style: {
                    color: "#fff",
                    background: "#000000b7",
                    fontSize: "13px",
                    padding: "3px 10px",
                  },
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-primary-foreground border border-gray-500 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
        aria-label={isOpen ? "Close search" : "Open search"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <RiSearch2Line className="text-[16px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default HeaderSearch;
