export interface UserPrivacySettings {
  visibility: 'public' | 'connections' | 'private';
  requestPermission: 'everyone' | 'connections' | 'nobody';
  messagePermission: 'everyone' | 'connections' | 'nobody';
  findability: 'public' | 'private';
  shareWardrobe: boolean;
  shareCreations: boolean;
}

export interface CreatorIdentity {
  isCreator: boolean;
  verified: boolean;
  badge?: string;
  styleVibe: string;
  specialty: string;
}

export interface UserSocialProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  fashionInterests: string[];
  creatorIdentity?: CreatorIdentity;
  privacySettings: UserPrivacySettings;
  metrics: {
    followersCount: number;
    followingCount: number;
    connectionsCount: number;
  };
  createdAt?: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface SocialConnection {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
}

export interface CreatorFollower {
  id: string;
  followerId: string;
  targetCreatorId: string;
  createdAt: string;
}

export interface SharedCreationItem {
  id: string;
  title: string;
  imageUrl: string;
  styleTags?: string[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  mediaUrl?: string;
  sharedCreation?: SharedCreationItem;
  createdAt: string;
  readBy: string[];
}

export interface ChatConversation {
  id: string;
  participants: string[];
  participantProfiles: Record<string, { name: string; avatar: string; username: string }>;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: Record<string, number>;
  type: 'direct' | 'group' | 'room';
  title?: string;
  createdAt: string;
}

export interface FashionCommunity {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  category: 'Luxury Fashion' | 'AI Designers' | 'Streetwear' | 'Couture' | 'Regional Groups' | 'Sustainable Fashion';
  membersCount: number;
  postsCount: number;
  members: string[];
  createdBy: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  content: string;
  mediaUrl?: string;
  sharedCreation?: SharedCreationItem;
  likesCount: number;
  likedBy: string[];
  commentsCount: number;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface AISocialMatchmakerQuery {
  queryText: string;
  userFashionInterests?: string[];
  requestedType?: 'creators' | 'communities' | 'peers';
}

export interface AISocialMatchmakerResponse {
  answer: string;
  matchesFound: boolean;
  suggestedCreators?: UserSocialProfile[];
  suggestedCommunities?: FashionCommunity[];
  privacyDisclaimer: string;
}
