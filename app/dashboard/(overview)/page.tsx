import clsx from "clsx";
import { lusitana } from "../../ui/fonts";
import {
  fetchCardData,
  fetchLatestInvoices,
  fetchRevenue,
} from "../../lib/data";
import RevenueChart from "../../ui/dashboard/revenue-chart";
import LatestInvoices from "../../ui/dashboard/latest-invoices";
import { sql } from "@vercel/postgres";
import Cards, { Card } from "../../ui/dashboard/cards";
import { Suspense } from "react";
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/app/ui/skeletons";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main>
      <h1 className={clsx("mb-4 text-xl md:text-2xl", lusitana.className)}>
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <Cards />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
