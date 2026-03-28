import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo or Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full">
            <Building2 className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Modern Könyvelés, <br className="hidden md:block" />
          <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
            A Felhőben.
          </span>
        </h1>

        {/* Hero Paragraph */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Üdvözlünk a Jupi Ügyfélportálon! Kezeld a cégeid dokumentumait, kövesd nyomon a határidőket és kommunikálj közvetlenül a könyvelőddel egyetlen letisztult felületen.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Bejelentkezés <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/init">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full bg-background border-2 hover:bg-muted transition-all">
              Rendszer Inicializálás
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-foreground">Biztonságos Tárhely</h3>
            <p className="text-muted-foreground text-sm">A számláid és bérpapírjaid titkosítva, Vercel Blob felhőben tárolódnak.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-foreground">Valós idejű Chat</h3>
            <p className="text-muted-foreground text-sm">Felejtsd el a zavaros email láncokat! Kommunikálj téma szerint szűrve.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border shadow-sm">
            <h3 className="font-bold text-lg mb-2 text-foreground">Határidő Figyelő</h3>
            <p className="text-muted-foreground text-sm">Ügyfélként mindig tudod, mikor miből és mit kell leadnod.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
