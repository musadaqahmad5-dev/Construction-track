export type ReactionType = 'heart' | 'save' | 'fire' | 'applaud';

export interface PostReactionCount {
  postId: string;
  heart: number;
  save: number;
  fire: number;
  applaud: number;
}

export class Reactions {
  private static userReactions: { [key: string]: { [type in ReactionType]?: boolean } } = {};
  private static mockDatabase: { [postId: string]: PostReactionCount } = {
    'post-fy-01': { postId: 'post-fy-01', heart: 42, save: 15, fire: 8, applaud: 12 },
    'post-fy-02': { postId: 'post-fy-02', heart: 18, save: 9, fire: 2, applaud: 4 }
  };

  static toggleReaction(postId: string, type: ReactionType): PostReactionCount {
    if (!this.userReactions[postId]) {
      this.userReactions[postId] = {};
    }

    if (!this.mockDatabase[postId]) {
      this.mockDatabase[postId] = { postId, heart: 0, save: 0, fire: 0, applaud: 0 };
    }

    const state = this.userReactions[postId][type];
    if (state) {
      this.userReactions[postId][type] = false;
      this.mockDatabase[postId][type] -= 1;
    } else {
      this.userReactions[postId][type] = true;
      this.mockDatabase[postId][type] += 1;
    }

    return this.mockDatabase[postId];
  }

  static getReactions(postId: string): PostReactionCount {
    return this.mockDatabase[postId] || { postId, heart: 0, save: 0, fire: 0, applaud: 0 };
  }

  static hasUserReacted(postId: string, type: ReactionType): boolean {
    return !!(this.userReactions[postId] && this.userReactions[postId][type]);
  }
}
