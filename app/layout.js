import Header from '@/components/Header/Header'
import './globals.css'

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                <Header />

                <main>
                    {children}
                </main>
            </body>
        </html>
    )
}