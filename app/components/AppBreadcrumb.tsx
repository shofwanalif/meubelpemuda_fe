"use client";

import React from "react";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";

const breadcrumbNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  branch: "Cabang",
  products: "Produk",
  sales: "Penjualan",
  user: "User",
  profile: "Profil",
  "waiting-room": "Ruang Tunggu",
};

const isDynamicId = (segment: string) => {
  const idRegex = /^(?=.*[0-9])(?=.*[a-z])[a-z0-9]{15,}$/i;
  return idRegex.test(segment) || segment.length > 20;
};

export function AppBreadcrumb() {
  const pathname = usePathname();

  // 1. Ambil semua segmen asli untuk keperluan konstruksi URL
  const allSegments = pathname.split("/").filter((i) => i);

  // 2. Siapkan array items dengan Home sebagai default
  const breadcrumbItems: any[] = [
    {
      title: <Link href="/">Home</Link>,
      key: "home",
    },
  ];

  // 3. Iterasi semua segmen, tapi filter nama role
  allSegments.forEach((segment, index) => {
    // Abaikan jika segmen adalah nama role
    if (segment === "owner" || segment === "karyawan") return;

    // URL tetap dibangun menggunakan urutan asli allSegments agar routing tidak rusak
    const url = `/${allSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === allSegments.length - 1;

    let label = breadcrumbNameMap[segment];

    if (!label) {
      if (isDynamicId(segment)) {
        const parentSegment = allSegments[index - 1];
        if (parentSegment === "branch") label = "Detail Cabang";
        else if (parentSegment === "products") label = "Detail Produk";
        else label = "Detail";
      } else {
        label = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }
    }

    breadcrumbItems.push({
      key: url,
      title: isLast ? (
        <span className="text-gray-800 font-medium">{label}</span>
      ) : (
        <Link href={url}>{label}</Link>
      ),
    });
  });

  return (
    <div className="mb-4 py-2 px-4 inline-block">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
}
