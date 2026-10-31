export const campaignPhotos = [
  {
    url: "https://images.unsplash.com/photo-1778521157912-620fd0d3c6e1?auto=format&fit=crop&w=1400&q=85",
    alt: "Sepatu sneakers dalam foto produk dengan pencahayaan studio",
    credit: "Sou Jest",
    source: "https://unsplash.com/photos/sneakers-on-display-stands-under-warm-focused-lighting-DXTT02-ee-8",
  },
  {
    url: "https://images.unsplash.com/photo-1741896136331-10375875eff4?auto=format&fit=crop&w=1400&q=85",
    alt: "Serum skincare tersusun sebagai foto produk berlatar merah muda",
    credit: "Maria Lupan",
    source: "https://unsplash.com/photos/skincare-serum-bottles-arranged-on-a-pink-surface-CD8_3hYj-Vc",
  },
  {
    url: "https://images.unsplash.com/photo-1674658556545-f18d4080ab6c?auto=format&fit=crop&w=1400&q=85",
    alt: "Headphone dalam foto produk bergaya minimal",
    credit: "Steven Erixon",
    source: "https://unsplash.com/photos/a-pair-of-headphones-sitting-on-top-of-a-table-v_mf1iidtnk",
  },
  {
    url: "https://images.unsplash.com/photo-1658980356514-30b17f977d29?auto=format&fit=crop&w=1400&q=85",
    alt: "Kopi dan kemasan biji kopi dalam suasana kafe",
    credit: "Ivan Yeo",
    source: "https://unsplash.com/photos/a-black-bag-with-a-white-label-and-a-cup-of-coffee-qoeafdZTuwo",
  },
];

export function campaignPhotoFor(campaignId: string) {
  const stableIndex = Array.from(campaignId).reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );

  return campaignPhotos[stableIndex % campaignPhotos.length];
}
