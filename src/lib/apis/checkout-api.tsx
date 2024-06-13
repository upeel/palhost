import { AxiosResponse } from "axios";
import _fetch from "../_fetch";

type CheckoutBody = {
  product_code: string;
  region: string;
};

const CheckoutApi = {
  checkout: (body: CheckoutBody): Promise<AxiosResponse<any>> => {
    return _fetch(`/checkout`, {
      method: "POST",
      body,
    });
  },
};

export default CheckoutApi;
