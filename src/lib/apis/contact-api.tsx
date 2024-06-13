import axios, { AxiosResponse } from "axios";
import _fetch from "../_fetch";

const ContactApi = {
  submit: (body: any): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/contact-us`, {
      method: "POST",
      body: body,
    });
  },
  submitTicket: (body: any): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/user/ticket`, {
      method: "POST",
      body: body,
    });
  },
}

export default ContactApi;