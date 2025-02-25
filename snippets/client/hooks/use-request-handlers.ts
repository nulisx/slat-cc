"use client";

import * as React from "react";
import { ofetch } from "ofetch";
import { toast } from "sonner";

// lib/hooks/use-request-handlers.ts

type Config<T> = {
  name: string;
  endpoint: string;
  method?: "PATCH" | "POST" | "DELETE" | "GET";
  data?: T;
  options?: AdvancedOptions;
};

type AdvancedOptions = {
  stringify?: boolean;
  suppressToast?: boolean;
  rejectError?: boolean;
  message?: {
    loading?: string;
    success?: string;
    error?: string;
  };
};

const DEFAULT_MESSAGES = {
  loading: "Processing...",
  success: "Operation successful!",
  error: "Something went wrong.",
};

const getMessage = (
  config: Config<any>,
  type: "loading" | "success" | "error"
): string => {
  return config.options?.message?.[type] || DEFAULT_MESSAGES[type];
};

const getRequestConfig = <T extends any | Record<string, any>>(
  stringify = true,
  data?: T
) => {
  return {
    body:
      stringify && data !== undefined
        ? JSON.stringify(data)
        : (data as BodyInit | null | undefined),
    headers: stringify ? { "Content-Type": "application/json" } : undefined,
  };
};

export const useRequestHandlers = <T extends any | Record<string, any>>(
  configs: Config<T>[]
) => {
  const [loading, setLoading] = React.useState(false);

  const run = React.useMemo(
    () => async (config: Config<T>, values?: T) => {
      const action = async () => {
        setLoading(true);
        try {
          const res = await ofetch<{
            message: string;
            data: any;
          }>(config.endpoint, {
            method: config.method || "PATCH",
            ...getRequestConfig(
              config?.options?.stringify,
              config?.data || values
            ),
            onResponseError({ response }) {
              throw new Error(
                response._data?.message || "An unknown error occurred."
              );
            },
          });

          return { message: res.message, data: res.data };
        } catch (e) {
          console.log(e);
          throw e;
        } finally {
          setLoading(false);
        }
      };

      if (config.options?.suppressToast) {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await action();
            resolve(response?.data);
          } catch (e) {
            console.error(e);
            reject(e);
          }
        });
      } else {
        return new Promise((resolve, reject) => {
          toast.promise(action, {
            loading: getMessage(config, "loading"),
            success: (result) => {
              resolve(result?.data);
              return result?.message;
            },
            error: (e) => {
              if (config.options?.rejectError) {
                reject(e); // reject err for external handling
              }
              return e.message || getMessage(config, "error");
            },
          });
        });
      }
    },
    []
  );

  // create actions with exact keys from config names
  const actions = React.useMemo(
    () =>
      Object.fromEntries(
        configs.map((config) => [
          config.name,
          (formData?: T) => run(config, formData),
        ])
      ) as Record<
        (typeof configs)[number]["name"],
        (formData?: T) => Promise<any>
      >,
    [configs, run]
  );

  return { actions, loading };
};
