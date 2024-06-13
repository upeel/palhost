import axios, { AxiosResponse } from "axios";
import _fetch from "../_fetch";

const url = process.env.NEXT_PUBLIC_API_URL;

type RegisterBody = {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
};

type LoginBody = {
  email: string;
  password: string;
};

type ChangePasswordBody = {
  password: string;
  new_password: string;
  confirm_password: string;
};

type SetPasswordBody = {
  password: string;
  password_confirmation: string;
}

export type SocialLoginResponse = {
  token: string;
};

const UserApi = {
  login: (body: LoginBody): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/login`, {
      method: "POST",
      body: body,
    });
  },
  signup: (body: RegisterBody): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/register`, {
      method: "POST",
      body: body,
    });
  },
  profile: (): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(
      `/user/profile`,
      {
        method: "GET",
      },
      false
    );
  },
  update: (body: any): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/user/update`, {
      method: "PUT",
      body: body,
    });
  },
  handleSocialLogin: (
    provider: string,
    query: string
  ): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/auth/callback/${provider}?${query}`, {
      method: "GET",
    });
  },
  dashboard: (): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/user/dashboard`, {
      method: "GET",
    });
  },
  changePassword: (body: ChangePasswordBody): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/user/change-password`, {
      method: "POST",
      body: body,
    });
  },
  forgotPassword: (body: any): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/forgot-password`, {
      method: "POST",
      body: body,
    });
  },
  setPassword: (body: SetPasswordBody): Promise<AxiosResponse<any>> => {
    return _fetch<AxiosResponse<any>>(`/user/set-password`, {
      method: "POST",
      body: body,
    });
  },
};

export default UserApi;
