import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}