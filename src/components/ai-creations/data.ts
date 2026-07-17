import { AICreation, AICreationCreator } from './types';

export const MOCK_CREATORS: Record<string, AICreationCreator> = {
  currentUser: {
    id: 'creator-current-user',
    name: 'Aura Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    bio: 'Digital Atelier pushing the boundaries of generative cloth solvers & spatial wear.',
    followers: 1240,
    following: 382,
    totalCreations: 12,
    likesReceived: 4850,
    viewsReceived: 24900
  },
  xenon: {
    id: 'creator-xenon',
    name: 'Xenon_Design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    bio: 'Speculative streetwear & mechanical outer armor concepts.',
    followers: 8930,
    following: 110,
    totalCreations: 45,
    likesReceived: 32000,
    viewsReceived: 189000
  },
  vibe_weaver: {
    id: 'creator-vibe-weaver',
    name: 'Vibe_Weaver',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    bio: 'Luxury haute couture meets deep latent diffusion models.',
    followers: 12400,
    following: 940,
    totalCreations: 82,
    likesReceived: 78500,
    viewsReceived: 412000
  },
  minimalist_clt: {
    id: 'creator-minimalist',
    name: 'Slate_Minimalist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop',
    bio: 'Monolithic shapes, zero drag, and raw architectural drapes.',
    followers: 4320,
    following: 156,
    totalCreations: 28,
    likesReceived: 15400,
    viewsReceived: 98000
  }
};

export const INITIAL_CREATIONS: AICreation[] = [
  {
    id: 'look-c-1',
    title: 'Iridescent Cyberpunk Tech Shell',
    prompt: 'Neon cybernetic futuristic jacket, loose fitting, modular tactical pockets, glowing purple lining, Unreal Engine 5.4 Path Tracer render on Male Athletic Mannequin, iridescent nylon finish, 8k',
    negativePrompt: 'low resolution, photorealistic human, messy threads, bad lighting, blurry, out of focus',
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
    imageUrlBefore: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', // conceptual before image (3D mesh)
    model: 'Imagen 4.0 Ultra',
    style: 'Streetwear',
    resolution: '2048x2048',
    aspectRatio: '1:1',
    createdAt: new Date().toISOString(),
    seed: '94827591823',
    likesCount: 245,
    viewsCount: 1250,
    savesCount: 89,
    commentsCount: 18,
    creator: MOCK_CREATORS.xenon,
    status: 'Published',
    tags: ['cyberpunk', 'techwear', 'iridescent', 'outerwear'],
    colorPalette: ['#3b82f6', '#8b5cf6', '#101015', '#00ffcc'],
    variations: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'look-c-2',
    title: 'Monolithic Slate Trench Overcoat',
    prompt: 'Minimalist double breasted heavy wool trench overcoat, high-collared, matte slate grey, draping perfectly over flowing cream silk trousers, studio editorial lighting, 120mm lens',
    negativePrompt: 'noisy, highly saturated, sports, futuristic, mechanical, accessories, logos',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    imageUrlBefore: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    model: 'Flux.1 Dev',
    style: 'Minimal',
    resolution: '1200x1600',
    aspectRatio: '3:4',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    seed: '10928374952',
    likesCount: 182,
    viewsCount: 940,
    savesCount: 54,
    commentsCount: 12,
    creator: MOCK_CREATORS.minimalist_clt,
    status: 'Published',
    tags: ['minimal', 'slate', 'trench', 'luxury', 'wool'],
    colorPalette: ['#27272a', '#f5f5f4', '#1c1917', '#d6d3d1'],
    variations: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'look-c-3',
    title: 'Ethereal Desert Sand Linen Gown',
    prompt: 'Haute couture layered silk sand-colored gown, flowing asymmetric raw linen panels, dramatic dunes background, golden hour lighting, cinematic atmosphere, editorial',
    negativePrompt: 'neon, metal, futuristic, dark background, blue, green, modern architecture, casual clothes',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    imageUrlBefore: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    model: 'Midjourney v6.1',
    style: 'Editorial',
    resolution: '1440x1920',
    aspectRatio: '3:4',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    seed: '88374928172',
    likesCount: 412,
    viewsCount: 2200,
    savesCount: 180,
    commentsCount: 42,
    creator: MOCK_CREATORS.vibe_weaver,
    status: 'Published',
    tags: ['dunes', 'linen', 'couture', 'gown', 'editorial'],
    colorPalette: ['#e4d5c3', '#cbbba0', '#4a3b2c', '#1e1c19'],
    variations: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'look-c-4',
    title: 'Deconstructed Spatial Blazer v2',
    prompt: 'Deconstructed asymmetric tailored charcoal wool blazer, open raw-edge details, metallic threads woven, holographic sheen, matte back background, Unreal Path Tracer',
    negativePrompt: 'poor quality, regular suit, colorful background, casual, sports, low contrast',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    imageUrlBefore: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    model: 'Imagen 4.0 Ultra',
    style: 'Avant-Garde',
    resolution: '2048x2048',
    aspectRatio: '1:1',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    seed: '77291048255',
    likesCount: 320,
    viewsCount: 1650,
    savesCount: 120,
    commentsCount: 27,
    creator: MOCK_CREATORS.currentUser,
    status: 'Published',
    tags: ['deconstructed', 'blazer', 'charcoal', 'holographic', 'avant-garde'],
    colorPalette: ['#1c1c24', '#2e2e38', '#4b5563', '#a78bfa'],
    variations: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'look-c-5',
    title: 'Holographic Organza Cyber Corset',
    prompt: 'Liquid glass holographic corset paired with ultra-wide structural silk cargo pants, cyber-noir mood, ambient magenta highlights, extreme lighting contrast',
    negativePrompt: 'unrealistic, normal clothing, bad textures, low quality, high distortion',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    imageUrlBefore: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
    model: 'Flux.1 Dev',
    style: 'Luxury',
    resolution: '1200x1600',
    aspectRatio: '3:4',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    seed: '66204918274',
    likesCount: 512,
    viewsCount: 3100,
    savesCount: 210,
    commentsCount: 39,
    creator: MOCK_CREATORS.vibe_weaver,
    status: 'Published',
    tags: ['holographic', 'corset', 'organza', 'cargo', 'cyber-noir'],
    colorPalette: ['#18181b', '#db2777', '#7c3aed', '#ec4899'],
    variations: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'look-c-6',
    title: 'Biomorphic Kinetic Pleats Vest',
    prompt: 'Pleated technical vest with organic overlapping curves, generative kinetic fabric structure simulation, pure ivory fabric, minimal matte grey background',
    negativePrompt: 'messy, color noise, bad cuts, shiny, human model, high saturation',
    imageUrl: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=800&auto=format&fit=crop',
    imageUrlBefore: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    model: 'Midjourney v6.1',
    style: 'Minimal',
    resolution: '1024x1024',
    aspectRatio: '1:1',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
    seed: '44591028475',
    likesCount: 140,
    viewsCount: 780,
    savesCount: 38,
    commentsCount: 9,
    creator: MOCK_CREATORS.minimalist_clt,
    status: 'Published',
    tags: ['pleats', 'biomorphic', 'kinetic', 'ivory', 'vest'],
    colorPalette: ['#e4e4e7', '#a1a1aa', '#27272a', '#fafafa'],
    variations: [
      'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
    ]
  }
];
