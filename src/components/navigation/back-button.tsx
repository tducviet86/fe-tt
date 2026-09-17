"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ label, className = "" }: { label: string; className?: string }) {
  const router = useRouter();
  return <button type="button" onClick={() => router.back()} className={`inline-flex items-center gap-2 text-sm font-semibold text-[#173f34] hover:underline ${className}`}><ArrowLeft size={17}/>{label}</button>;
}
