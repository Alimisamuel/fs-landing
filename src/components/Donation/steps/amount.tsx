import { Button, CircularProgress, Grid, InputAdornment, ListItemButton, TextField } from "@mui/material";
import { Currency } from "../DonationModal";
import { suggestedAmounts } from "./currency";

interface AmountStepProps {
  selectedCurrency: Currency | null;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectAmount: (amount: number) => void;
  onContinue: () => void;
  isLoading: boolean;
}

const AmountStep: React.FC<AmountStepProps> = ({
  selectedCurrency,
  value,
  onChange,
  onSelectAmount,
  onContinue,
  isLoading,
}) => {
  const amounts =
    suggestedAmounts[selectedCurrency?.currency || "USD"] ?? [];

  return (
    <>
      <div className="mt-5 border border-[#E4E9F18C] rounded-[8px]">
        <div className="bg-[#FAFAFA] text-[#101828] py-2 px-4">
          <p>Enter Amount</p>
        </div>
        <TextField
          type="text" // important: use text to allow formatting
          value={value}
          onChange={onChange}
          placeholder={selectedCurrency?.currency === "NGN" ? "500" : "5"}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <p className="font-black text-black">
                    {selectedCurrency?.symbol}
                  </p>
                </InputAdornment>
              ),
              style: {
                color: "#333B4A",
                fontSize: "28px",
                fontWeight: 700,
              },
            },
          }}
          fullWidth
        />
        <div className="mx-5 border-t mt-3 pt-5 pb-5">
          <Grid container spacing={2}>
            {amounts.map((amount) => (
              <Grid size={3} key={amount}>
                <ListItemButton
                  sx={{
                    bgcolor: "#F7F8F9CC",
                    borderRadius: "5px",
                    color: "#101828",
                    fontWeight: 500,
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="px-3 py-1 rounded-lg border hover:bg-gray-100"
                  onClick={() => onSelectAmount(amount)}
                >
                  {selectedCurrency?.symbol}
                  {amount.toLocaleString()}
                </ListItemButton>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <div>
        <Button
          disabled={!selectedCurrency || !value || isLoading}
          onClick={onContinue}
          variant="contained"
          fullWidth
          startIcon={isLoading && <CircularProgress size={20} />}
          sx={{ height: "40px", mt: 3 }}
        >
          Continue
        </Button>
      </div>
    </>
  );
};


export default AmountStep;