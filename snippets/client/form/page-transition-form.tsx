"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MdAnimation } from "react-icons/md";

import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Card, CardHeaderWithStatus } from "@/components/ui/card";

import {
  pageTransitionFormSchema,
  PageTransitionValues,
} from "@/lib/zod/schemas/application";
import { LIMITS, PAGE_TRANSITIONS } from "@slat/utils";
import { useRequestHandlers } from "@/lib/hooks/use-request-handlers";
import { BiolinkConfig } from "@/lib/types";
import { CommandPopover } from "@/components/form/command-popover";
import { useDebouncedFormSave } from "@/lib/hooks/use-debounced-form-save";
import { ReferenceSlider } from "@/components/form/reference-slider";

// app/(dashboard)/dashboard/customize/premium/_components/page-transition-form.tsx

export function PageTransitionForm({
  data,
  premium,
}: {
  data: BiolinkConfig;
  premium: boolean;
}) {
  const form = useForm<PageTransitionValues>({
    resolver: zodResolver(pageTransitionFormSchema),
    defaultValues: {
      transition: data.effects.pageTransition,
      duration: data.misc.pageTransitionDuration,
    },
  });

  const { actions } = useRequestHandlers([
    {
      name: "save",
      endpoint: "/api/account/manage/premium/page-transition",
      options: {
        suppressToast: true,
      },
    },
  ]);

  const [state, errorMessage] = useDebouncedFormSave(
    async (values: PageTransitionValues) => {
      await actions.save(values);
    },
    form,
    500
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(actions.save)}>
        <Card className="space-y-4 p-4">
          <CardHeaderWithStatus
            icon={MdAnimation}
            state={state}
            errorMessage={errorMessage}
          >
            Page Transition
          </CardHeaderWithStatus>
          <FormField
            control={form.control}
            name="transition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transition</FormLabel>
                <FormControl>
                  <CommandPopover
                    value={field.value}
                    onChange={field.onChange}
                    premium={premium}
                    disabled={!premium}
                    items={[
                      ...PAGE_TRANSITIONS.map((item) => ({
                        value: item.value,
                        name: item.name,
                        premium: true,
                      })),
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <ReferenceSlider
                    min={LIMITS.MIN_DURATION}
                    max={LIMITS.MAX_DURATION}
                    step={0.1}
                    value={field.value}
                    onValueChange={field.onChange}
                    unit="s"
                    disabled={!premium}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
      </form>
    </Form>
  );
}
