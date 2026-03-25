import { useSnackbar, VariantType } from "notistack";

type HandleAlertParams = {
  message: string;
  variant: VariantType;
};

const useAlert = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleAlert = ({ message, variant }: HandleAlertParams) => {
    enqueueSnackbar(message, { variant });
  };

  return handleAlert;
};

export default useAlert;