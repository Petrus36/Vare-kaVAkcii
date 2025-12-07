import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🍳</span>
              Vareška v Akcii
            </h3>
            <p className="text-gray-400">
              Najlepšie recepty pre každého kuchára. Jednoduché, chutné a otestované.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigácia</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Recepty
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  O mne
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <div className="space-y-2 text-gray-400">
              <p>Sledujte nás na sociálnych sieťach</p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-2xl hover:text-white transition-colors">📱</a>
                <a href="#" className="text-2xl hover:text-white transition-colors">📘</a>
                <a href="#" className="text-2xl hover:text-white transition-colors">📷</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Vareška v Akcii. Všetky práva vyhradené.
          </p>
        </div>
      </div>
    </footer>
  )
}

