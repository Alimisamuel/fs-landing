import { Button, ListItemButton } from "@mui/material";
import React from "react";

interface DonationTypeProps {
  donationType: string;
  setDonationType: (type: string) => void;
  onContinue: () => void;
}

const DonationType: React.FC<DonationTypeProps> = ({
  donationType,
  setDonationType,
  onContinue,
}) => {
  return (
    <div className="mt-10">
      {d_types?.map((t, idx) => (
        <ListItemButton
          selected={donationType === t.value}
          onClick={() => setDonationType(t.value)}
          key={idx}
          sx={{
            border: "1px solid #F1F2F4",
            mb: 3,
            borderRadius: "8px",
            "&.Mui-selected": {
              bgcolor: "#F2F4F7",
            },
          }}
        >
          <div className="w-full flex items-center justify-between py-2">
            <p className="text-[14px] font-medium">{t.label}</p>
            <div className="w-[20px] h-[20px] rounded-full border-4 border-[#F4EBFF] bg-[#B867BA] flex justify-center items-center">
              <div className="bg-white rounded-full w-[8px] h-[8px] flex justify-center items-center">
                {donationType === t.value && (
                  <div className="bg-primary rounded-full w-[5px] h-[5px]"></div>
                )}
              </div>
            </div>
          </div>
        </ListItemButton>
      ))}

      <Button
        disabled={!donationType}
        onClick={()=>onContinue()}
        variant="contained"
        fullWidth
        sx={{ mt: 4, height: "40px" }}
      >
        Continue
      </Button>
    </div>
  );
};

export default DonationType;

const d_types = [
  {
    label: "One-time donation",
    value: "one_time",
  },
  {
    label: "Weekly donation",
    value: "weekly",
  },
  {
    label: "Monthly donation",
    value: "monthly",
  },
  {
    label: "Yearly donation",
    value: "yearly",
  },
];
