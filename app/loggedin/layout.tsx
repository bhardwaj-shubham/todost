import Provider from "../providers";
import { auth } from "@/auth";

export default async function LoggedInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return <Provider session={session}>{children}</Provider>;
}
