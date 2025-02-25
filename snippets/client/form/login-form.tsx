"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { loginFormSchema, LoginFormValues } from "@/lib/auth/schemas";
import { AuthHeader } from "../_components/auth-header";
import { MigrationAlert } from "../_components/migration-alert";
import { useRequestHandlers } from "@/lib/hooks/use-request-handlers";

export function LoginForm({ redirectUrl }: { redirectUrl: string }) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
      rememberMe: false,
    },
  });

  const router = useRouter();

  const { actions, loading } = useRequestHandlers([
    {
      endpoint: "/api/auth/login",
      name: "login",
      data: form.watch(),
      method: "POST",
    },
  ]);

  async function onSubmit() {
    await actions.login();

    router.push(redirectUrl);
  }

  return (
    <Form {...form}>
      <MigrationAlert />
      <AuthHeader
        title="Welcome back!"
        description="Enter your details to login"
      />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="usernameOrEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  variant="card"
                  disabled={loading}
                  autoComplete="false"
                  {...field}
                  tabIndex={0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    variant="card"
                    disabled={loading}
                    autoComplete="false"
                    {...field}
                    tabIndex={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      tabIndex={2}
                      className="bg-muted/20"
                    />
                  </FormControl>
                  <FormLabel>Remember me</FormLabel>
                </FormItem>
              )}
            />
            <div className="text-xs">
              Forgot Password?{" "}
              <Link
                href="/forgot-password"
                className="text-right text-theme duration-300 hover:underline"
                data-loading={loading}
              >
                Reset it
              </Link>
            </div>
          </div>
        </div>
        <Button
          disabled={loading}
          type="submit"
          className="mt-4 w-full"
          tabIndex={3}
        >
          Login
        </Button>
        <div className="mt-4 text-xs" data-loading={loading}>
          New user?{" "}
          <Link
            href="/register"
            className="text-right text-theme duration-300 hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}
