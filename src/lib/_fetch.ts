import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface IApiRequestConfig {
  method?: string;
  body?: any;
  contentType?: string;
}

const getAuth = (): string => {
  let accessToken = localStorage.getItem("access_token");

  return `Bearer ${accessToken}`;
};

const _fetch = async <T>(
  url: string,
  options: IApiRequestConfig = {
    method: "GET",
    body: {},
    contentType: "application/json",
  },
  shouldRedirectToLogin = true
): Promise<AxiosResponse<T>> => {
  let request: AxiosRequestConfig = {
    url,
    baseURL,
    method: options.method,
    headers: {
      Authorization: getAuth(),
      "Content-Type": options.contentType || "application/json",
      Accept: "application/json",
    },
  };

  if (options.method === "POST" || options.method === "PUT") {
    request.data = options.body;
  }

  try {
    let response: AxiosResponse<T> = await axios.request<T>(request);

    if (response.status >= 200 && response.status < 400) {
      return response;
    }

    throw { message: "Unexpected Error while calling API" };
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.clear();

      if (shouldRedirectToLogin) {
        window.location.href = "/auth/signin";
      }
    }
    throw error;
  }
};

export default _fetch;
