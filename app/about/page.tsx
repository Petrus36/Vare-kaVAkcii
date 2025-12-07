import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center">
          <div className="text-center text-white z-10">
            <div className="text-8xl mb-6">👨‍🍳</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">O Kuchárovi</h1>
            <p className="text-xl md:text-2xl text-primary-100">Váš sprievodca svetom chutí</p>
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 lg:p-16">
          <div className="prose prose-lg max-w-none">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-primary-200 pb-3">
                  Vitajte v mojom kuchynskom svete
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Som vášnivý kuchár s láskou k tradičným aj moderným receptom. 
                  Moja cesta s varením začala už v detstve, keď som pomáhal mojej 
                  babičke v kuchyni. Odvtedy som sa neustále učil a experimentoval 
                  s rôznymi chutami a technikami.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Verím, že dobré jedlo spája ľudí a vytvára nezabudnuteľné zážitky. 
                  Každý recept, ktorý zdieľam, bol dôkladne otestovaný a prispôsobený 
                  tak, aby bol jednoduchý na prípravu, ale zároveň plný chuti.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-primary-50 to-amber-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Moja filozofia</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✨</span>
                    <div>
                      <strong className="text-gray-800">Jednoduchosť</strong>
                      <p className="text-gray-600 text-sm">Recepty, ktoré zvládne každý</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">🌱</span>
                    <div>
                      <strong className="text-gray-800">Čerstvé ingrediencie</strong>
                      <p className="text-gray-600 text-sm">Dávam prednosť lokálnym produktom</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">❤️</span>
                    <div>
                      <strong className="text-gray-800">Vášeň</strong>
                      <p className="text-gray-600 text-sm">Varenie je moja vášeň a radosť</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">👨‍👩‍👧‍👦</span>
                    <div>
                      <strong className="text-gray-800">Rodinné hodnoty</strong>
                      <p className="text-gray-600 text-sm">Recepty, ktoré spájajú generácie</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Prečo práve tieto recepty?
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Otestované</h4>
                  <p className="text-gray-600">Každý recept bol viackrát vyskúšaný</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">📱</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Video návody</h4>
                  <p className="text-gray-600">Pozrite si recepty na TikTok</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🍽️</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Pre každého</h4>
                  <p className="text-gray-600">Od začiatočníkov po pokročilých</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                Spojme sa!
              </h3>
              <p className="text-gray-600 mb-6">
                Sledujte moje najnovšie recepty a kuchynské tipy na sociálnych sieťach
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="#"
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold inline-flex items-center"
                >
                  <span className="mr-2">📱</span>
                  TikTok
                </a>
                <a
                  href="#"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
                >
                  <span className="mr-2">📘</span>
                  Facebook
                </a>
                <a
                  href="#"
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold inline-flex items-center"
                >
                  <span className="mr-2">📷</span>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

