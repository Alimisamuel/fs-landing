import { Button } from "@mui/material";
import Image from "next/image";

interface SuccessStepProps {
  onFinish: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onFinish }) => {
  return (
    <div className="flex  p-5 rounded-[12px] bg-white  flex-row gap-x-5 items-start">
      <Image
        src="/icons/success.svg"
        alt="success"
        width={40}
        height={40}
      />
      <div>
        <p className="text-[#101828] font-[700]  text-[18px] ">
          Thank you for your generosity!
        </p>
        <p className="text-[#667085] text-[14px]">
          Your donation was successful and will go a long way
          <br /> in supporting our mission.{" "}
        </p>
        <div className="mt-10 border flex justify-end ">
          <Button
            onClick={onFinish}
            variant="contained"
            sx={{ height: "45px", px: 3, borderRadius: "8px" }}
          >
            You&#39;re welcome
          </Button>
        </div>
      </div>
    </div>
  );
};


export default SuccessStep;