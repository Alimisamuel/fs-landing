/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  Box,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import useAlert from "@/hooks/useAlert";
import { HiOutlineChevronDown } from "react-icons/hi2";
import { currencies } from "./Currencies";
import { initiateDonationPayment } from "@/services/utilsApi";
import Image from "next/image";

// Currency type definition
type Currency = {
  image?: string;
  name: string;
  currency: string;
  symbol: string;
};

// Suggested amounts for different currencies
const suggestedAmounts: { [key: string]: number[] } = {
  NGN: [2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000],
  USD: [10, 25, 50, 100, 250, 500, 1000, 2000],
  GBP: [10, 25, 50, 100, 250, 500, 1000, 2000],
  EUR: [10, 25, 50, 100, 250, 500, 1000, 2000],
};

const donationTypes = [
  { label: "One-time donation", value: "one_time" },
  { label: "Weekly donation", value: "weekly" },
  { label: "Monthly donation", value: "monthly" },
  { label: "Yearly donation", value: "yearly" },
];

const Donation = () => {
  // State for donation functionality
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  ); // Default to NGN
  const [amount, setAmount] = useState<string>("");
  const [donationType, setDonationType] = useState("one_time");
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const handleAlert = useAlert();

  // Handle amount input change with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(raw)) return;
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAmount(formatted);
  };

  // Convert formatted string to number
  const toNumber = (value: string): number => {
    return Number(value.replace(/,/g, ""));
  };

  // Handle suggested amount click
  const handleSuggestedAmountClick = (suggestedAmount: number) => {
    setAmount(suggestedAmount.toLocaleString());
  };

  // Prepare Paystack config
  const amountNumber = toNumber(amount);
  const currency = selectedCurrency?.currency || "NGN";

  const handleInitiateDonation = async () => {
    setIsLoading(true);
    const type = donationType === "one_time" ? "one_time" : "recurring";
    const recurringFrequency = donationType !== "one_time" ? donationType : null;
    await initiateDonationPayment(
      amountNumber,
      currency,
      "https://user.thefaithstream.com/browse",
      type,
      recurringFrequency
    )
      .then((res) => {
        const paymentLink = res?.data?.payment?.paymentLink;

        if (res?.success && paymentLink) {
         
          // Redirect the user
          window.location.href = paymentLink;
        } else {
          handleAlert({
            variant: "error",
            message: res?.message || "Payment link not found. Please try again.",
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

  return (
    <div className="text-black">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[18px] font-bold">GIVE</p>
          <p className="text-[#667085] text-[14px] mt-1">
            Your support keeps the mission alive
          </p>
        </div>
        <Button>Last Seven Days</Button>
      </div>

      <Box
        sx={{
          height: "198px",
          background: `url("/images/donation.png")`,
          backgroundSize: "cover",
          mt: 4,
          borderRadius: "8px",
        }}
      />

      <div className="mt-3">
        <Grid container spacing={2}>
          <Grid size={8}>
            <div
              className="border border-[#E4E9F199] rounded-[8px] p-[24px]"
              style={{ boxShadow: "0px 1px 2px 0px #1018280F" }}
            >
              {/* New Donation Screen */}
              <div className="w-full">
                <p className="text-[18px] font-bold text-[#101828] mb-6">
                  New Donation
                </p>

                {/* Currency Selection */}
                <div className="mb-8">
                  <p className="text-[13px] font-[900] text-[#36394A] mb-4">
                    Select Currency
                  </p>
                  <FormControl fullWidth>
                    <Select
                      IconComponent={HiOutlineChevronDown}
                      value={selectedCurrency.currency}
                      onChange={(e) => {
                        const selected = currencies.find(
                          (c) => c.currency === e.target.value
                        );
                        if (selected) setSelectedCurrency(selected);
                      }}
                      displayEmpty
                      renderValue={(value) => {
                        const currency = currencies.find(
                          (c) => c.currency === value
                        );
                        if (!currency) return null;
                        return (
                          <div className="flex items-center gap-3">
                            <p className="text-center w-[50px] font-bold">
                              {currency.symbol}
                            </p>
                            <span className="text-[14px]">{currency.name}</span>
                          </div>
                        );
                      }}
                      sx={{
                        height: "56px",
                        backgroundColor: "#F9FAFB",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          padding: "16px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E4E7EC",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#D0D5DD",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#701F63",
                        },
                      }}
                    >
                      {currencies.map((currency) => (
                        <MenuItem
                          key={currency.currency}
                          value={currency.currency}
                        >
                          <div className="flex items-center gap-3">
                            {/* Nigerian Flag representation for NGN */}
                            <Image
                              src={currency.flag}
                              alt={currency.currency}
                              width={50}
                              height={50}
                              className=" w-5 h-3 mr-3"
                            />
                            <span className="text-[14px]">{currency.name}</span>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Amount Input */}
                <div className="mb-0 bg-white">
                  <p className="text-[16px] font-medium text-[#101828] mb-4 bg-[#F2F4F7] py-3 px-4">
                    Enter Amount
                  </p>
                  <TextField
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder={
                      selectedCurrency?.currency === "NGN" ? "500" : "5"
                    }
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <span className="text-[#333B4A] text-[28px] font-bold">
                              {selectedCurrency.symbol}
                            </span>
                          </InputAdornment>
                        ),
                        style: {
                          fontSize: "28px",
                          fontWeight: 700,
                          color: "#333B4A",
                          height: "100px",
                          padding: "20px",
                        },
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "transparent",
                        border: "none",
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover fieldset": {
                          border: "none",
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                    }}
                  />
                </div>
                <Divider sx={{ mb: 2 }} />
                {/* Suggested Amounts */}
                <div className="mb-10 bg-white">
                  <div className="grid grid-cols-4 gap-4">
                    {suggestedAmounts[selectedCurrency.currency]?.map(
                      (suggestedAmount) => (
                        <button
                          key={suggestedAmount}
                          onClick={() =>
                            handleSuggestedAmountClick(suggestedAmount)
                          }
                          className="px-3 py-4 bg-[#F9FAFB] border border-[#E4E7EC] rounded-xl text-[#101828] font-semibold hover:bg-[#F3F4F6] hover:border-[#701F63] transition-all duration-200 text-center text-[14px]"
                        >
                          {selectedCurrency.symbol}
                          {suggestedAmount.toLocaleString()}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-[13px] font-[900] text-[#36394A] mb-4">
                    Donation Type
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {donationTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setDonationType(type.value)}
                        className={`px-4 py-3 rounded-xl text-left border transition-all duration-200 ${
                          donationType === type.value
                            ? "bg-[#F5EAF7] border-[#7F2D8B] text-[#7F2D8B]"
                            : "bg-[#F9FAFB] border-[#E4E7EC] text-[#101828] hover:border-[#7F2D8B]"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={handleInitiateDonation}
                  disabled={
                    !amount ||
                    isLoading ||
                    toNumber(amount) < 100 ||
                    !donationType
                  }
                  variant="contained"
                  fullWidth
                  startIcon={
                    isLoading && <CircularProgress size={20} color="inherit" />
                  }
                  sx={{
                    height: "56px",
                    backgroundColor: "#7F2D8B",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#6B2478",
                      boxShadow: "none",
                    },
                    "&:disabled": {
                      backgroundColor: "#F2F4F7",
                      color: "#98A2B3",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isLoading ? "Processing..." : "Continue"}
                </Button>
              </div>
            </div>
          </Grid>
          <Grid size={4}>
            <div
              className="border border-[#E4E9F199] rounded-[8px] p-[24px]"
              style={{ boxShadow: "0px 1px 2px 0px #1018280F" }}
            >
              {/* Right side content can be added here */}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Donation;
