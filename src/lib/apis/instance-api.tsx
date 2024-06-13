import axios, { AxiosResponse } from "axios";
import _fetch from "../_fetch";
import { Instance } from "@/types/instance";

const url = process.env.NEXT_PUBLIC_API_URL;

const InstanceApi = {
  get: (lang: string, status?: number, page?: number, perPage?: number): Promise<AxiosResponse<any>> => {
    if (status == 99) {
      return _fetch<AxiosResponse<any>>(`/instances?lang=${lang}&page=${page}&per_page=${perPage}`);
    }
    return _fetch<AxiosResponse<any>>(`/instances?lang=${lang}&page=${page}&per_page=${perPage}&status=${status}`);
  },
  getActiveList: (): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/instances/active`);
  },
  getAll: (lang: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/instances?lang=${lang}`);
  },
  showPassword: (token: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/instances/show-password/${token}`);
  },
  showSettings: (lang: string, token: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/instances/settings/${token}?lang=${lang}`);
  },
  getStatuses: (lang: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/instances/statuses?lang=${lang}`);
  },
  getInstance: (lang: string, token: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/instances/details/${token}?lang=${lang}`);
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
  getConfig: (lang: string, token: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/instances/settings/${token}?lang=${lang}`);
  },
  updateConfig: (token: string, body: any): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/instances/settings/${token}`, {
      method: "PUT",
      body: body,
    });
  },
  restart: (token: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(
      `/instances/reboot/${token}`,
      {
        method: "GET",
      }
    );
  },
  start: (token: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(
      `/instances/start/${token}`,
      {
        method: "GET",
      }
    );
  },
  stop: (token: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(
      `/instances/stop/${token}`,
      {
        method: "GET",
      }
    );
  },
  update: (token: string): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(
      `/instances/update/${token}`,
      {
        method: "GET",
      }
    );
  },
};

export default InstanceApi;
