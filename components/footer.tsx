export function Footer() {
  return (
    <footer className="border-t border-sky-200 bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-600 md:flex-row">
        <p>&copy; {new Date().getFullYear()} <span className="text-sky-500 font-semibold">Pixel</span><span className="text-black font-semibold">Primp</span>. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:text-sky-500 font-medium transition-colors">
            Privacy
          </a>
          <a href="#terms" className="hover:text-sky-500 font-medium transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
