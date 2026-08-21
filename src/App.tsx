import { Nav } from '@/components/Nav'
import { SmoothScroll } from '@/components/SmoothScroll'
import { GrainOverlay } from '@/components/GrainOverlay'
import { Hero } from '@/components/sections/Hero'
import { SelectedWorks } from '@/components/sections/SelectedWorks'
import { Catalog } from '@/components/sections/Catalog'
import { About } from '@/components/sections/About'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <div className="bg-stone-950">
      <SmoothScroll />
      <GrainOverlay />
      <Nav />
      <Hero />
      <SelectedWorks />
      <Catalog />
      <About />
      <Footer />
    </div>
  )
}

export default App
