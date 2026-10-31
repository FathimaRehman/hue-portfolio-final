
import "./globals.css";

export const metadata = {
  title: "Fathima Rehman A | WordPress & MERN Stack Developer",
  description:
    "Portfolio of Fathima Rehman A, a WordPress and MERN Stack Developer based in Calicut, Kerala, India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
