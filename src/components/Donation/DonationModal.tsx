/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import useAlert from "@/hooks/useAlert";
import { Modal, Box, IconButton } from "@mui/material";

import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";

import { initiateDonationPayment } from "@/services/utilsApi";
import { useRouter, useSearchParams } from "next/navigation";
import CurrencyStep from "./steps/currency";
import AmountStep from "./steps/amount";
import SuccessStep from "./steps/success";
import DonationType from "./steps/donation-type";
import Loader from "../UI/Loader";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  setModal: (val: boolean) => void;
}

export type Currency = {
  image?: string;
  name: string;
  flag?: string;
  currency: string; // ISO code (e.g., "USD")
  symbol: string; // Symbol (e.g., "$")
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  borderRadius: "12px",
  boxShadow: 24,
};

const DonationModal = ({ open, onClose, setModal }: ModalProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );

  const [donationType, setDonationType] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [value, setValue] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    const raw = e.target.value.replace(/,/g, "");

    // Only allow numbers
    if (!/^\d*$/.test(raw)) return;

    // Format with commas
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setValue(formatted);
  };

  const toNumber = (val: string): number => {
    return Number(val.replace(/,/g, ""));
  };

  const handleAlert = useAlert();

  // Prepare Flutterwave config based on current state
  const amountNumber = toNumber(value);
  const currency = selectedCurrency?.currency || "NGN";

  const handleInitiateDonation = async () => {
    setIsLoading(true);

    const new_type = donationType === "one_time" ? donationType : "recurring";
    const freq = donationType !== "one_time" ? donationType : null;
    await initiateDonationPayment(
      amountNumber,
      currency,
      "https://user.thefaithstream.com/browse",
      new_type,
      freq
    )
      .then((res) => {
        const paymentLink = res?.data?.payment?.paymentLink;

        if (res?.success) {
        
          window.location.href = paymentLink;
        } else {
          handleAlert({
            variant: "error",
            message: "Payment link not found. Please try again.",
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        handleAlert({
          variant: "error",
          message: `${err?.message || "Failed to initialize payment"}`,
        });
        setIsLoading(false);
      });
  };

  const [hasHandledStatus, setHasHandledStatus] = useState(false);

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "completed" && !hasHandledStatus) {
      setModal(true);
      setActiveStep(3);
      setHasHandledStatus(true);
    }
  }, [searchParams, hasHandledStatus, setModal]);

  const handleFinish = () => {
    setModal(false);
    setActiveStep(0);
    router.replace("/browse", { scroll: false });
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
        {
          isLoading && <Loader/>
        }
        {activeStep < 3 && (
          <div className="p-5 rounded-[12px] w-[400px] md:w-[600px] bg-white text-[#0D0D12]">
            <div className="w-full flex justify-between">
              {activeStep > 0 && (
                <IconButton onClick={() => setActiveStep(0)}>
                  <IoMdArrowBack className="text-black" />
                </IconButton>
              )}
              <div />
              <div>
                <p className="font-bold text-center">
                  {activeStep === 0
                    ? "Your support helps us share more inspiring stories"
                    : activeStep === 1
                    ? "Your generosity keeps Faithstream alive"
                    : "How Would You Like to Give?"}
                </p>
                <p className="text-center text-[14px] text-[#344054]">
                  {activeStep === 0
                    ? "Please choose your preferred currency"
                    : activeStep === 1
                    ? "Enter amount you had love to donate"
                    : "Choose how you would like to support this work of faith — as a one-time seed or as a continual act of giving."}
                </p>
              </div>
              <div>
                <IconButton
                  onClick={onClose}
                  sx={{ border: "1px solid #F0F0F0" }}
                >
                  <IoClose className="text-[#666D80]" />
                </IconButton>
              </div>
            </div>

            {/* Currencies */}
            {activeStep === 0 && (
              <CurrencyStep
                selectedCurrency={selectedCurrency}
                onSelectCurrency={setSelectedCurrency}
                onContinue={() => {
                  setActiveStep(1);
                  setValue("");
                }}
              />
            )}

            {activeStep === 1 && (
              <AmountStep
                selectedCurrency={selectedCurrency}
                value={value}
                onChange={handleChange}
                onSelectAmount={(amount) => setValue(amount.toLocaleString())}
                onContinue={() => setActiveStep(2)}
                isLoading={isLoading}
              />
            )}

            {activeStep === 2 && (
              <DonationType
                donationType={donationType}
                setDonationType={setDonationType}
                onContinue={handleInitiateDonation}
              />
            )}
          </div>
        )}

        {activeStep === 3 && <SuccessStep onFinish={handleFinish} />}
      </Box>
    </Modal>
  );
};

export default DonationModal;
