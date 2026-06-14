import { CreatorProfile, CreatorProfiles } from './creatorProfiles';
import { CreatorCollections } from './creatorCollections';

export interface LeaderboardRank {
  rank: number;
  creator: CreatorProfile;
  compositeRepScore: number;
  trendingDelta: number;
}

export class CreatorRanking {
  static getTopCreatorLeaderboard(): LeaderboardRank[] {
    const creators = CreatorProfiles.getCreators();
    const collections = CreatorCollections.getCollections();

    const ranked = creators.map((cr) => {
      // Find matches collections
      const matchedCols = collections.filter(col => col.creatorId === cr.creatorId);
      const collectionBonus = matchedCols.reduce((sum, c) => sum + c.rankingScore, 0);

      // Composite scoring formula: seguidores (0.1) + likes (0.5) + collection ranking (0.4)
      const compositeRepScore = Math.round(
        cr.followersCount * 0.15 + cr.likesCollected * 0.4 + collectionBonus * 0.8
      );

      return {
        creator: cr,
        compositeRepScore,
        trendingDelta: cr.engagementScore > 90 ? 12.8 : 4.5
      };
    });

    // Sort by composite score
    return ranked
      .sort((a, b) => b.compositeRepScore - a.compositeRepScore)
      .map((item, idx) => ({
        rank: idx + 1,
        creator: item.creator,
        compositeRepScore: item.compositeRepScore,
        trendingDelta: item.trendingDelta
      }));
  }
}
