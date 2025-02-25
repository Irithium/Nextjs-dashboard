import { Inter, Roboto, Lusitana } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});
