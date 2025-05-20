import Link from "next/link";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <header className="bg-blue-600 text-white py-4">
    <div className="container mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">KWF SaaS</h1>
        <nav>
            
            <Link href="/login" className="bg-blue-900 hover:bg-blue-400 shadow-lg px-12 py-3 rounded-lg">
                Login
            </Link>
        </nav>
    </div>
</header>
        {children}
        <footer className="bg-blue-600 text-white py-4">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2023 KWF SaaS. All rights reserved.</p>
                </div>
            </footer>
      </body>
    </html>
  );
}
