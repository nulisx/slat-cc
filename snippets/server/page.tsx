import React from "react";

import type { FilterSearchParams } from "@/lib/application/templates/types";

import { getUserIdFromToken } from "@/lib/auth/actions";
import {
  getFilteredTemplates,
  getMaxPages,
} from "@/lib/application/templates/actions";

import { SearchInput } from "@/components/core/search-input";
import { TemplateCard } from "./template-card";
import { TemplatesFilter } from "./templates-filter";
import { TemplateCreate } from "./template-create";
import { Pagination } from "@/components/core/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchUsername,
  fetchIsUserPremium,
} from "@/lib/application/users/actions";

// app/(dashboard)/dashboard/templates/_components/templates-page.tsx

export function TemplatesPage({
  filters,
  discover,
}: {
  filters: FilterSearchParams;
  discover?: boolean;
}) {
  return (
    <div className="space-y-8">
      <SearchInput placeholder="Search templates..." value={filters.q} />
      <React.Suspense fallback={<LoadingTemplatesContent />}>
        <TemplatesContent filters={filters} discover={discover} />
      </React.Suspense>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Skeleton className="h-8 w-24" />
          </div>
        }
      >
        <AsyncPagination filters={filters} />
      </React.Suspense>
    </div>
  );
}

async function TemplatesContent({
  filters,
  discover,
}: {
  filters: FilterSearchParams;
  discover?: boolean;
}) {
  const userId = await getUserIdFromToken();

  const [templates, premium, username] = await Promise.all([
    getFilteredTemplates(filters),
    fetchIsUserPremium(userId),
    fetchUsername(userId),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TemplatesFilter filters={filters} discover={discover} />
        <TemplateCreate isPremium={premium} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            filters={filters}
            isPremium={premium}
            username={username}
          />
        ))}
      </div>
    </div>
  );
}

async function AsyncPagination({ filters }: { filters: FilterSearchParams }) {
  const maxPages = await getMaxPages(filters);
  const pageNumber = Number(filters.page);
  return <Pagination page={pageNumber} maxPages={maxPages} />;
}

function LoadingTemplatesContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {new Array(12).fill(null).map((_, index) => (
          <Skeleton key={index} className="h-48" />
        ))}
      </div>
    </div>
  );
}
