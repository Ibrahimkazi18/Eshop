import Header from '../shared/widgets/header';
import './global.css';
import { Poppins, Roboto, Jost } from "next/font/google"
import Providers from './providers';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Eshop',
  description: 'An e-commerce website that meets all your requirements.',
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

const jost = Jost({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-jost",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${poppins.variable} ${jost.variable}`}>
        <Providers>
        <Header />
        <Toaster 
            position="bottom-right"
            reverseOrder={false}
          />  
        {children}
        </Providers>
      </body>
    </html>
  )
}
