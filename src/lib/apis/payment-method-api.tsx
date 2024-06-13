import { Axios, AxiosResponse } from "axios";
import _fetch from "../_fetch";

const PaymentMethodApi = {
  get: (lang: string, status?: number): Promise<AxiosResponse<any>> => {
    if (status == 99) {
      return _fetch<AxiosResponse<any>>(`/billings/payment-methods?lang=${lang}`);
      
    }
    return _fetch<AxiosResponse<any>>(`/billings/payment-methods?status=${status}`);
  },
  makeDefault: (id: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(
      `/billings/payment-methods/${id}/default`,
      {
        method: "POST",
      }
    );
  },
  getDefault: (): Promise <AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(
      `/user/default-payment`,
      {
        method: "GET"
      }
    )
  },
  add: (data: any): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/billings/payment-methods`, {
      method: "POST",
      body: data,
    });
  },
  delete: (id: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/billings/payment-methods/${id}/remove`, {
      method: "DELETE",
    });
  },
};

export default PaymentMethodApi;
