import Image from "next/image";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-coven-border px-4 py-6 md:px-8">
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/branding/satans-alter-horizontal.png"
          alt="Satans Alter"
          width={1024}
          height={202}
          className="h-6 w-auto opacity-40"
        />
        <p className="text-[11px] text-coven-text-muted/50">
          © {year} Satans Alter. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
