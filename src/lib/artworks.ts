// Placeholder gallery imagery for the portfolio template.
// Source: The Metropolitan Museum of Art Open Access collection
// (collectionapi.metmuseum.org), all isPublicDomain: true. Real paintings by
// their original, credited artists, downloaded and self-hosted in
// /public/artwork, used as stand-in imagery for a fictional painter persona
// ("Marisol Andrade") framed as studies "after" the source work. See the
// credit line in the footer and the attribution shown in each lightbox.

export interface Artwork {
  slug: string
  title: string
  year: string
  medium: string
  sourceArtist: string
  sourceTitle: string
  sourceYear: string
  orientation: 'portrait' | 'landscape'
  file: string
}

export const artworkImage = (art: Pick<Artwork, 'file'>) => `/artwork/${art.file}`

export const artworks: Artwork[] = [
  {
    slug: 'quiet-orchard',
    title: 'Quiet Orchard',
    year: '2023',
    medium: 'Oil on linen',
    sourceArtist: 'John Wootton',
    sourceTitle: 'Classical Landscape with Roma Figures',
    sourceYear: '1748',
    orientation: 'portrait',
    file: 'quiet-orchard.jpg',
  },
  {
    slug: 'the-net',
    title: 'The Net',
    year: '2023',
    medium: 'Oil on canvas',
    sourceArtist: 'Juan Bautista Martínez del Mazo',
    sourceTitle: 'Don Gaspar de Guzmán, Count-Duke of Olivares',
    sourceYear: 'ca. 1636',
    orientation: 'portrait',
    file: 'the-net.jpg',
  },
  {
    slug: 'village-edge',
    title: 'Village, Edge of the Wood',
    year: '2022',
    medium: 'Oil on panel',
    sourceArtist: 'Thomas Gainsborough',
    sourceTitle: 'Cottage Children (The Wood Gatherers)',
    sourceYear: '1787',
    orientation: 'portrait',
    file: 'village-edge.jpg',
  },
  {
    slug: 'reverie',
    title: 'Reverie',
    year: '2024',
    medium: 'Oil on canvas',
    sourceArtist: 'Francisco de Goya',
    sourceTitle: 'Josefa de Castilla Portugal y van Asbrock de Garcini',
    sourceYear: '1804',
    orientation: 'portrait',
    file: 'reverie.jpg',
  },
  {
    slug: 'self-study-no-4',
    title: 'Self-Study No. 4',
    year: '2021',
    medium: 'Oil on board',
    sourceArtist: 'Anthony van Dyck',
    sourceTitle: 'Self-Portrait',
    sourceYear: 'ca. 1620-21',
    orientation: 'portrait',
    file: 'self-study-no-4.jpg',
  },
  {
    slug: 'constance',
    title: 'Constance',
    year: '2022',
    medium: 'Oil on canvas',
    sourceArtist: 'Domingo Ortiz',
    sourceTitle: 'Portrait of Sor Juana de Nuestra Señora de Guadalupe',
    sourceYear: '1797',
    orientation: 'portrait',
    file: 'constance.jpg',
  },
  {
    slug: 'rio',
    title: 'Rio',
    year: '2024',
    medium: 'Oil on linen',
    sourceArtist: 'Francisco de Goya',
    sourceTitle: 'Ignacio Garcini y Queralt, Brigadier of Engineers',
    sourceYear: '1804',
    orientation: 'portrait',
    file: 'rio.jpg',
  },
  {
    slug: 'the-visit',
    title: 'The Visit',
    year: '2023',
    medium: 'Oil on canvas',
    sourceArtist: 'Edgar Degas',
    sourceTitle: 'The Collector of Prints',
    sourceYear: '1866',
    orientation: 'portrait',
    file: 'the-visit.jpg',
  },
]
