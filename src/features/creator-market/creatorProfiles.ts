export interface CreatorProfile {
  creatorId: string;
  username: string;
  displayName: string;
  avatarGradient: string;
  followersCount: number;
  likesCollected: number;
  reputationPoints: number; // calculated from remixes + saves
  engagementScore: number; // 0-100 indicating active viral factor
  biography: string;
  aestheticFocus: string[];
  isVerified: boolean;
}

export class CreatorProfiles {
  private static mockCreators: CreatorProfile[] = [
    {
      creatorId: 'c-01',
      username: 'scandisartorialist',
      displayName: 'Sven Lindqvist',
      avatarGradient: 'from-zinc-400 to-slate-600',
      followersCount: 14200,
      likesCollected: 48900,
      reputationPoints: 2450,
      engagementScore: 92,
      biography: 'Sartorial minimalism emphasizing un-dyed Danish wool and heavy linen tailoring.',
      aestheticFocus: ['Minimalistize', 'Monochrome Earth'],
      isVerified: true
    },
    {
      creatorId: 'c-02',
      username: 'tactical_nomad',
      displayName: 'Kenji Sato',
      avatarGradient: 'from-emerald-900 to-black',
      followersCount: 22800,
      likesCollected: 73400,
      reputationPoints: 4900,
      engagementScore: 97,
      biography: 'Tech-wear shell systems with magnetic closures and asymmetric silhouette overlays.',
      aestheticFocus: ['Cyberpunk', 'Gorpcore'],
      isVerified: true
    },
    {
      creatorId: 'c-03',
      username: 'editorial_charlotte',
      displayName: 'Charlotte Vance',
      avatarGradient: 'from-rose-400 to-indigo-900',
      followersCount: 8900,
      likesCollected: 21200,
      reputationPoints: 1200,
      engagementScore: 84,
      biography: 'High-contrast vintage drapes paired with modern sportswear panels.',
      aestheticFocus: ['Classic Luxury', 'Streetwear'],
      isVerified: false
    }
  ];

  private static userFollowingIds: string[] = ['c-02']; // default follow Salomon Kenji

  static getCreators(): CreatorProfile[] {
    return this.mockCreators;
  }

  static followCreator(id: string): boolean {
    if (this.userFollowingIds.includes(id)) {
      this.userFollowingIds = this.userFollowingIds.filter(fId => fId !== id);
      const host = this.mockCreators.find(c => c.creatorId === id);
      if (host) host.followersCount -= 1;
      return false; // un-followed
    } else {
      this.userFollowingIds.push(id);
      const host = this.mockCreators.find(c => c.creatorId === id);
      if (host) host.followersCount += 1;
      return true; // followed
    }
  }

  static isFollowing(id: string): boolean {
    return this.userFollowingIds.includes(id);
  }

  static getCreatorById(id: string): CreatorProfile | undefined {
    return this.mockCreators.find(c => c.creatorId === id);
  }
}
