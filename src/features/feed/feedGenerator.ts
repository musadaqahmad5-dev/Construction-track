import { PersonaVector } from '../user-profile-memory/vectorProfileMemory';
import { RenderedLook, OutfitRenderer } from '../rendering/outfitRenderer';

export interface FeedPost {
  postId: string;
  creatorName: string;
  avatarAccent: string;
  look: RenderedLook;
  affinityPercent: number; // calculated feed factor Match Score
  likes: number;
  comments: number;
  tags: string[];
  editorialTitle: string;
  sourceTab: 'For You' | 'Trending' | 'Following' | 'Experimental';
}

export class FeedGenerator {
  private static generatedPostsCache: { [key: string]: FeedPost[] } = {};

  static compileFeed(
    profileVector: PersonaVector,
    tab: 'For You' | 'Trending' | 'Following' | 'Experimental'
  ): FeedPost[] {
    const key = `${tab}-${profileVector.minimalist}-${profileVector.cyberpunk}`;
    if (this.generatedPostsCache[key]) {
      return this.generatedPostsCache[key];
    }

    const compiledPosts: FeedPost[] = [];

    // Synthesize looks fitting specific feeds
    if (tab === 'For You') {
      // High affinity with current style vector
      const look1 = OutfitRenderer.renderLook(profileVector, 'Urban Commute', { temperature: 18, condition: 'Clear' }, ['Minimalist'], 180);
      const look2 = OutfitRenderer.renderLook(profileVector, 'Savile Evening', { temperature: 14, condition: 'Chilly' }, ['Luxury'], 450);
      
      compiledPosts.push(
        {
          postId: 'post-fy-01',
          creatorName: 'scandisartorialist',
          avatarAccent: 'from-zinc-400 to-slate-600',
          look: look1,
          affinityPercent: 96,
          likes: 412,
          comments: 24,
          tags: ['Sartorial', 'DanishDrapes'],
          editorialTitle: 'Architectural Layering for Chilly Transits',
          sourceTab: tab
        },
        {
          postId: 'post-fy-02',
          creatorName: 'editorial_charlotte',
          avatarAccent: 'from-rose-400 to-indigo-900',
          look: look2,
          affinityPercent: 88,
          likes: 189,
          comments: 11,
          tags: ['Cashmere', 'WarmTailoring'],
          editorialTitle: 'High Contrast Fine Merino Evening Uniform',
          sourceTab: tab
        }
      );
    } else if (tab === 'Trending') {
      // High likes, high engagement, slightly lower affinity is fine
      const trendVector: PersonaVector = { minimalist: 0.1, streetwear: 0.9, classic: 0.1, luxury: 0.2, cyberpunk: 0.8, traditional: 0.1 };
      const look1 = OutfitRenderer.renderLook(trendVector, 'Cyber Street meetup', { temperature: 20, condition: 'Neon Cloud' }, ['Gorpcore Hack'], 350);

      compiledPosts.push({
        postId: 'post-tr-01',
        creatorName: 'tactical_nomad',
        avatarAccent: 'from-emerald-900 to-black',
        look: look1,
        affinityPercent: 74,
        likes: 1420,
        comments: 145,
        tags: ['Cybertech', 'RipstopActive'],
        editorialTitle: 'Ripstop Heavy Shell Utility Outpost',
        sourceTab: tab
      });
    } else if (tab === 'Following') {
      // Looks generated specifically using creator credentials
      const folVector: PersonaVector = { minimalist: 0.2, streetwear: 0.5, classic: 0.1, luxury: 0.3, cyberpunk: 0.7, traditional: 0.1 };
      const look1 = OutfitRenderer.renderLook(folVector, 'All-Weather Mission', { temperature: 12, condition: 'Stormy' }, ['Windproof Shell'], 800);

      compiledPosts.push({
        postId: 'post-fo-01',
        creatorName: 'tactical_nomad',
        avatarAccent: 'from-emerald-900 to-black',
        look: look1,
        affinityPercent: 91,
        likes: 530,
        comments: 67,
        tags: ['Goretex', 'AllWeatherComfort'],
        editorialTitle: '3-Layer Stormproof System Set',
        sourceTab: tab
      });
    } else {
      // Experimental: high diversity, introducing creative style overlaps (cyberpunk meets traditional)
      const expVector: PersonaVector = { minimalist: 0.1, streetwear: 0.1, classic: 0.1, luxury: 0.1, cyberpunk: 0.9, traditional: 0.9 };
      const look1 = OutfitRenderer.renderLook(expVector, 'Retro tech mashup', { temperature: 17, condition: 'Sun' }, ['Edo Tech'], 300);

      compiledPosts.push({
        postId: 'post-ex-01',
        creatorName: 'RetroSartorialist',
        avatarAccent: 'from-purple-900 via-stone-900 to-black',
        look: look1,
        affinityPercent: 49, // Lower because of extreme style drift factor
        likes: 92,
        comments: 18,
        tags: ['TraditionalEdo', 'AsymmetricArmor'],
        editorialTitle: 'Kyoto-Origin Technical Kimono Shell',
        sourceTab: tab
      });
    }

    this.generatedPostsCache[key] = compiledPosts;
    return compiledPosts;
  }
}
