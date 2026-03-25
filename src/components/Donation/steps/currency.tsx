import React, { useEffect } from "react";
import {
  Autocomplete,
  Avatar,
  Button,
  Grid,
  ListItemButton,
  TextField,
} from "@mui/material";
import { Currency } from "../DonationModal";
import Image from "next/image";
import { currencies } from "@/features/Donation/Currencies";
import { useGetQuery } from "@/hooks/useQuery";
import Loader from "@/components/UI/Loader";

interface CurrencyStepProps {
  selectedCurrency: Currency | null;
  onSelectCurrency: (currency: Currency | null) => void;
  onContinue: () => void;
}

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

const CurrencyStep: React.FC<CurrencyStepProps> = ({
  selectedCurrency,
  onSelectCurrency,
  onContinue,
}) => {
  const { data, isLoading } = useGetQuery<AutoCurrency>(
    ["currencies"],
    "/users/donations/detect-location"
  );

  // Auto-select detected currency once, if none is chosen yet
  useEffect(() => {
    if (!data?.data?.suggestedCurrency || selectedCurrency) return;

    const suggestedCode = data.data.suggestedCurrency;

    // Try to match against the primary Currencies used in this modal
    const primaryMatch = Currencies.find(
      (c) => c.currency === suggestedCode
    );

    if (primaryMatch) {
      onSelectCurrency(primaryMatch);
      return;
    }

    // Fallback: try to match against the full currencies list
    const fallbackMatch = currencies.find(
      (c) => c.currency === suggestedCode
    );

    if (fallbackMatch) {
      onSelectCurrency({
        image: undefined,
        name: fallbackMatch.name,
        currency: fallbackMatch.currency,
        symbol: fallbackMatch.symbol,
        flag: fallbackMatch.flag,
      });
    }
  }, [data, selectedCurrency, onSelectCurrency]);

  return (
    <div className="mt-10">
      {isLoading && <Loader />}
      <Grid container spacing={2}>
        {Currencies.map((currency, idx) => (
          <Grid size={3} key={idx}>
            <ListItemButton
              onClick={() => onSelectCurrency(currency)}
              selected={selectedCurrency === currency}
              sx={{
                border: "1px solid #EAECF0",
                borderRadius: "8px",
                flexDirection: "column",
                p: 1,
                height:'150px'
              }}
            >
              <div className="w-full flex justify-end ">
                <div className="w-[20px] h-[20px] rounded-full border-4 border-[#F4EBFF] bg-[#B867BA] flex justify-center items-center">
                  <div className="bg-white rounded-full w-[8px] h-[8px] flex justify-center items-center">
                    {selectedCurrency === currency && (
                      <div className="bg-primary rounded-full w-[5px] h-[5px]"></div>
                    )}
                  </div>
                </div>
              </div>
              <Avatar src={currency.image} sx={{ mt: 2 }} />
              <p className="text-[10px] text-center mt-3 text-[#212121] font-semibold mb-4">
                {currency.name}
              </p>
            </ListItemButton>
          </Grid>
        ))}
      </Grid>
      <div className="mt-4">
        <p className="mb-2 text-[14px] font-[500]">Other Currencies</p>
        <Autocomplete
          disablePortal
          options={currencies}
          getOptionLabel={(option) => option.name}
          sx={{ width: "100%" }}
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
          onChange={(_, value) => {
            onSelectCurrency(value ?? null);
          }}
        />
      </div>

      <Button
        disabled={!selectedCurrency}
        onClick={onContinue}
        variant="contained"
        fullWidth
        sx={{ mt: 4, height: "40px" }}
      >
        Continue
      </Button>
    </div>
  );
};

export default CurrencyStep;

const Currencies: Currency[] = [
  {
    image: "/images/currency/pounds.png",
    name: "British Pounds",
    currency: "GBP",
    symbol: "£",
  },
  {
    image: "/images/currency/naira.png",
    name: "Nigerian Naira",
    currency: "NGN",
    symbol: "₦",
  },
  {
    image: "/images/currency/dollar.png",
    name: "US Dollars",
    currency: "USD",
    symbol: "$",
  },
  {
    image: "/images/currency/europe.png",
    name: "European Union Euro",
    currency: "EUR",
    symbol: "€",
  },
];
type SuggestedAmounts = {
  [key: string]: number[];
};

export const suggestedAmounts: SuggestedAmounts = {
  USD: [10, 25, 50, 100, 250, 500, 1000, 2000],
  GBP: [10, 25, 50, 100, 250, 500, 1000, 2000],
  EUR: [10, 25, 50, 100, 250, 500, 1000, 2000],
  NGN: [2000, 4000, 6000, 8000, 12000, 14000, 16000, 18000],
};
