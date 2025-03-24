import "./globals.css";
import RootLayoutServer from "@/components/layout/RootLayoutServer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutServer>{children}</RootLayoutServer>;
}
