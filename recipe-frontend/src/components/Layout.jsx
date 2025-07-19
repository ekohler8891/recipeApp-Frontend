export default function Layout({ children }) {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: "url('/path/to/your/background.jpg')",
                backgroundColor: "#f9fafb", // fallback
            }}
        >
            <div className="backdrop-blur-sm bg-white/80 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
