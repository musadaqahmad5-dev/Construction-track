export interface StylingComment {
  commentId: string;
  lookId: string;
  author: string;
  text: string;
  timestamp: Date;
  likes: number;
}

export class Comments {
  private static mockComments: StylingComment[] = [
    {
      commentId: 'c-01',
      lookId: 'rnd-01',
      author: 'scandisartorialist',
      text: 'Brilliant use of charcoal wool. The drapes match Stockholm winters perfectly.',
      timestamp: new Date(Date.now() - 3600000),
      likes: 8
    }
  ];

  static addComment(lookId: string, author: string, text: string): StylingComment {
    const fresh: StylingComment = {
      commentId: `com-${Date.now()}`,
      lookId,
      author: author || 'Guest Stylist',
      text,
      timestamp: new Date(),
      likes: 0
    };
    this.mockComments.unshift(fresh);
    return fresh;
  }

  static getCommentsForLook(lookId: string): StylingComment[] {
    return this.mockComments.filter(c => c.lookId === lookId);
  }
}
