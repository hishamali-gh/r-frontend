import '../index.css'

export default function Footer() {
    return (
        <footer className="w-full bg-white/50 backdrop-blur-md border-t border-white/40 px-8 py-6 mt-12 text-gray-700 flex flex-col items-center text-center" style={{ fontFamily: "SUSE Mono" }}>
            
            <p className="text-sm mb-1">
                No footer info here.
            </p>
            <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Willow. All rights goes to Zara.
            </p>
        </footer>
    );
}
