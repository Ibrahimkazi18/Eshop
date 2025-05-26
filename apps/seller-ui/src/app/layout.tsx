import './global.css';
import Providers from './provider';
import { Poppins, Roboto } from "next/font/google"

export const metadata = {
  title: 'Eshop Seller',
  description: 'An e-commerce dashboard to manage your e-shop.',
}

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable} min-h-screen bg-slate-900 font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
