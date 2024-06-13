import { Axios, AxiosResponse } from "axios";
import _fetch from "../_fetch";
import { Invoice } from "@/types/invoice";

const InvoiceApi = {
  get: (lang: string, status?: number, page?: number, perPage?: number): Promise<AxiosResponse<any>> => {
    if (status == 99) {
      return _fetch<AxiosResponse<any>>(`/billings/invoices?lang=${lang}&page=${page}&per_page=${perPage}`);
    }
    return _fetch<AxiosResponse<any>>(`/billings/invoices?lang=${lang}&page=${page}&per_page=${perPage}&status=${status}`);
  },
  getUnpaid: (status?: number): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/billings/invoices?status=${status}`);
  },
  getInvoiceByInvoiceNumber: (invoice_no: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`billings/invoices/${invoice_no}`);
  },
  makeAdvancePayment: ({
    client_token,
    payment_method,
  }: {
    client_token: string;
    payment_method: string;
  }): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/advance-payment`, {
      method: "POST",
      body: {
        payment_method,
        client_token,
      },
    });
  },
};

export default InvoiceApi;
