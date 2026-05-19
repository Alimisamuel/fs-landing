/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import useAlert from "@/hooks/useAlert";
import {
  Modal,
  Box,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Autocomplete,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BsCheckCircle } from "react-icons/bs";

import { initiateDonationPayment } from "@/services/utilsApi";
import { useRouter, useSearchParams } from "next/navigation";
import SuccessStep from "./steps/success";
import Loader from "../UI/Loader";
import { suggestedAmounts } from "./steps/currency";
import { currencies } from "@/features/Donation/Currencies";
import { useGetQuery } from "@/hooks/useQuery";
import Image from "next/image";
import FsInput from "../custom/FsInputs";

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

interface AutoCurrency {
  data: {
    city: string;
    country: string;
    countryCode: string;
    currency: string;
    ip: string;
    region: string;
    suggestedCurrency: string;
  };
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "94vw", sm: 480 },
  maxHeight: "92vh",
  overflowY: "auto",
  borderRadius: "20px",
  boxShadow: 24,
  outline: "none",
};

const defaultCurrency: Currency = {
  name: "British Pounds",
  currency: "GBP",
  symbol: "£",
};

const currencyOptions = [defaultCurrency, ...currencies].filter(
  (item, index, list) =>
    list.findIndex((currency) => currency.currency === item.currency) === index
);

const quickCurrencies = ["GBP", "USD", "EUR", "NGN"]
  .map((currencyCode) =>
    currencyOptions.find((item) => item.currency === currencyCode)
  )
  .filter(Boolean) as Currency[];

const quickCurrencyCodes = quickCurrencies.map((item) => item.currency);
const otherCurrencyOptions = currencyOptions.filter(
  (item) => !quickCurrencyCodes.includes(item.currency)
);

const DonationModal = ({ open, onClose, setModal }: ModalProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    defaultCurrency
  );
  const [hasManuallySelectedCurrency, setHasManuallySelectedCurrency] =
    useState(false);

  const [donationType, setDonationType] = useState("monthly");

  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [value, setValue] = useState<string>("10");

  const [isLoading, setIsLoading] = useState(false);
  const { data: detectedCurrencyData, isLoading: isDetectingCurrency } =
    useGetQuery<AutoCurrency>(
      ["currencies"],
      "/users/donations/detect-location"
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove existing separators and keep a single decimal point.
    const raw = e.target.value.replace(/,/g, "");

    if (!/^\d*\.?\d{0,2}$/.test(raw)) return;

    const [whole, decimal] = raw.split(".");
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formatted =
      decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;

    setValue(formatted);
  };

  const toNumber = (val: string): number => {
    return Number(val.replace(/,/g, ""));
  };

  const handleAlert = useAlert();

  // Prepare Flutterwave config based on current state
  const amountNumber = toNumber(value);
  const currency = selectedCurrency?.currency || "NGN";
  const currencySymbol = selectedCurrency?.symbol || "₦";
  const amountOptions =
    suggestedAmounts[currency]?.slice(0, 3) ?? suggestedAmounts.GBP.slice(0, 3);

  const setCurrency = (
    nextCurrency: Currency,
    options: { manual?: boolean } = {}
  ) => {
    setSelectedCurrency(nextCurrency);
    setValue("");
    if (options.manual) {
      setHasManuallySelectedCurrency(true);
    }
  };

  useEffect(() => {
    if (
      hasManuallySelectedCurrency ||
      !detectedCurrencyData?.data?.suggestedCurrency
    ) {
      return;
    }

    const detectedCurrency = currencyOptions.find(
      (item) => item.currency === detectedCurrencyData.data.suggestedCurrency
    );

    if (detectedCurrency) {
      setCurrency(detectedCurrency);
    }
  }, [detectedCurrencyData, hasManuallySelectedCurrency]);

  const handleInitiateDonation = async () => {
    if (!amountNumber || amountNumber <= 0) {
      handleAlert({
        variant: "error",
        message: "Please enter a donation amount.",
      });
      return;
    }

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
    setActiveStep(1);
    router.replace("/browse", { scroll: false });
  };

  const handleClose = () => {
    onClose();
    setActiveStep(1);
  };

  const formatDonationType = () => {
    if (donationType === "one_time") return "once";
    return donationType;
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {isLoading && <Loader />}
        {activeStep < 3 && (
          <div className="rounded-[20px] bg-white p-5 text-[#0D0D12] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-[800] optima leading-tight text-[#101828]">
                  Support FaithStream
                </h2>
                <p className=" text-[12px] text-[#667085]">
                  Every gift, however small, helps keep free content flowing for
                  believers everywhere.
                </p>
              </div>
              <IconButton
                onClick={handleClose}
                sx={{
                  bgcolor: "#F2F4F7",
                  color: "#667085",
                  "&:hover": { bgcolor: "#E4E7EC" },
                }}
              >
                <IoClose />
              </IconButton>
            </div>

            {/* <div className="mt-5 flex items-start gap-3 rounded-[10px] bg-primary/10 px-4 py-2 text-primary">
              <BsCheckCircle className="mt-0.5 shrink-0" />
              <p className="text-[12px] font-[600] leading-4">
                FaithStream is free for everyone, everywhere. Your support makes
                that possible.
              </p>
            </div> */}

            <div className="mt-5 grid grid-cols-2 rounded-[9px] border border-[#E4E7EC] bg-white p-1">
              <button
                type="button"
                onClick={() => setDonationType("monthly")}
                className={`h-[40px] rounded-[8px] text-[14px] font-[700] transition ${
                  donationType === "monthly"
                    ? "bg-primary text-white shadow-sm"
                    : "text-[#667085]"
                }`}
              >
                Give monthly
              </button>
              <button
                type="button"
                onClick={() => setDonationType("one_time")}
                className={`h-[40px] rounded-[8px] text-[14px] font-[700] transition ${
                  donationType === "one_time"
                    ? "bg-primary text-white shadow-sm"
                    : "text-[#667085]"
                }`}
              >
                Give once
              </button>
            </div>

             <div className="mt-4 rounded-[12px] border border-[#E4E7EC] bg-[#FCFCFD] p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-[800] text-[#101828]">
                    Change currency
                  </p>
                  <p className="text-[10px] text-[#667085]">
                    Currently giving in {selectedCurrency?.name}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[12px] font-[800] text-primary">
                  {currency}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {quickCurrencies.map((item) => {
                  const isSelected = item.currency === currency;

                  return (
                    <button
                      key={item.currency}
                      type="button"
                      onClick={() => {
                        setCurrency(item, { manual: true });
                      }}
                      className={`h-[42px] rounded-[9px] border text-[13px] font-[800] transition ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-[#E4E7EC] bg-white text-[#344054] hover:border-primary/50"
                      }`}
                    >
                      {item.symbol} {item.currency}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3">
                <p className="text-[12px] font-[700] text-[#344054]">
                  Select another currency
                </p>
                  <Autocomplete
                          disablePortal
                          options={currencies}
                          getOptionLabel={(option) => option.name}
                          sx={{ width: "100%" }}
                            onChange={(_, next) => {
                      if (!next) return;
                      setCurrency(next, { manual: true });
                    }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Other Currencies"
                              InputProps={{
                                ...params.InputProps,
                                sx: {
                                  border: "1px solid #EAECF0",
                                  borderRadius: "8px",
                                  color: "#333",
                                  fontSize: "13px",
                                  "& input": {
                                    padding: "10px 12px",
                                  },
                                },
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props}>
                              <Image
                                src={option.flag}
                                alt={option.currency}
                                width={50}
                                height={50}
                                className=" w-5 h-3 mr-3"
                              />{" "}
                              {option.name}
                            </li>
                          )}
                         
                        />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {amountOptions.map((amount) => {
                const formatted = amount.toLocaleString();
                const isSelected = value === formatted;

                return (
                  <button
                    type="button"
                    key={amount}
                    onClick={() => setValue(formatted)}
                    className={`h-[40px] rounded-[9px] border text-[12px] font-[800] transition ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-[#E4E7EC] bg-white text-[#101828] hover:border-primary/50"
                    }`}
                  >
                    {currencySymbol}
                    {formatted}
                  </button>
                );
              })}
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#E4E7EC]" />
              <p className="text-[13px] text-[#98A2B3]">or enter any amount</p>
              <div className="h-px flex-1 bg-[#E4E7EC]" />
            </div>

            <TextField
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="1.00"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="text-[24px] font-[800] text-[#000]">
                        {currencySymbol}
                      </span>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <span className="hidden text-[12px] font-[500] text-[#98A2B3] sm:inline">
                        any amount is welcome
                      </span>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  height: "56px",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#000",
                },
              }}
            />

           

            <p className="mt-4 text-center text-[12px] font-[600] italic text-primary">
              Thank you. Your support keeps FaithStream free for everyone.
            </p>

            <Button
              disabled={!value || isLoading}
              onClick={handleInitiateDonation}
              variant="contained"
              fullWidth
              startIcon={isLoading && <CircularProgress size={18} />}
              sx={{
                mt: 3,
                height: "50px",
                borderRadius: "10px",
                bgcolor: "#701F63",
                fontSize: "16px",
                fontWeight: 800,
                textTransform: "none",
                "&:hover": { bgcolor: "#5B1851" },
              }}
            >
              Give {currencySymbol}
              {value || "0"} {formatDonationType()}
            </Button>
          </div>
        )}

        {activeStep === 3 && <SuccessStep onFinish={handleFinish} />}
      </Box>
    </Modal>
  );
};

export default DonationModal;
