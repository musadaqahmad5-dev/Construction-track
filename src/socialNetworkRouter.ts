import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import {
  UserSocialProfile,
  FriendRequest,
  SocialConnection,
  CreatorFollower,
  ChatConversation,
  ChatMessage,
  FashionCommunity,
  CommunityPost,
  CommunityComment,
  AISocialMatchmakerResponse
} from "./types/social";

const router = Router();

// ==========================================
// IN-MEMORY HIGH-FIDELITY SEED & DATA STORES
// ==========================================

const userProfilesStore: Record<string, UserSocialProfile> = {
  "usr-current": {
    id: "usr-current",
    name: "Sartorial Member",
    username: "sartorial_lead",
    bio: "Exploring high-contrast avant-garde silhouettes and AI style DNA integration.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    fashionInterests: ["Avant-Garde", "Cyber Couture", "Dark Minimalism", "High Tailoring"],
    privacySettings: {
      visibility: "public",
      requestPermission: "everyone",
      messagePermission: "everyone",
      findability: "public",
      shareWardrobe: true,
      shareCreations: true
    },
    metrics: {
      followersCount: 142,
      followingCount: 38,
      connectionsCount: 24
    },
    createdAt: "2026-01-10T10:00:00.000Z"
  },
  "creator-aurelia": {
    id: "creator-aurelia",
    name: "Aurelia Vance",
    username: "aurelia_couture",
    bio: "Former haute couture editorial director. Sculpting architectural silhouettes & dark outerwear.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    fashionInterests: ["Haute Couture", "Avant-Garde", "Dark Tailoring", "Editorial"],
    creatorIdentity: {
      isCreator: true,
      verified: true,
      badge: "Couture Master",
      styleVibe: "Architectural & Dark Monochromatic",
      specialty: "Statement Coats & Asymmetric Lapels"
    },
    privacySettings: {
      visibility: "public",
      requestPermission: "everyone",
      messagePermission: "everyone",
      findability: "public",
      shareWardrobe: true,
      shareCreations: true
    },
    metrics: {
      followersCount: 18920,
      followingCount: 112,
      connectionsCount: 340
    },
    createdAt: "2025-11-15T08:30:00.000Z"
  },
  "creator-kaito": {
    id: "creator-kaito",
    name: "Kaito Tanaka",
    username: "kaito_tokyo",
    bio: "Tokyo cyber streetwear designer. Modular utility garments, raw denim, asymmetric layering.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    fashionInterests: ["Cyber Couture", "Streetwear", "Techwear", "Modular Utility"],
    creatorIdentity: {
      isCreator: true,
      verified: true,
      badge: "Streetwear Lead",
      styleVibe: "Cyberpunk & Functional Utility",
      specialty: "Asymmetric Shell Jackets & Cargo Silhouettes"
    },
    privacySettings: {
      visibility: "public",
      requestPermission: "everyone",
      messagePermission: "everyone",
      findability: "public",
      shareWardrobe: true,
      shareCreations: true
    },
    metrics: {
      followersCount: 14250,
      followingCount: 89,
      connectionsCount: 210
    },
    createdAt: "2025-12-01T12:00:00.000Z"
  },
  "creator-sven": {
    id: "creator-sven",
    name: "Sven Lindqvist",
    username: "sven_stockholm",
    bio: "Stockholm sartorial advisor. Dedicated to clean organic lines, soft cashmere, and beige neutrals.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    fashionInterests: ["Nordic Minimal", "Sustainable Fashion", "Quiet Luxury", "Cashmere Tailoring"],
    creatorIdentity: {
      isCreator: true,
      verified: true,
      badge: "Minimalist Master",
      styleVibe: "Nordic Warm & Beige Neutrals",
      specialty: "Unstructured Oversized Coats & Wool Trousers"
    },
    privacySettings: {
      visibility: "public",
      requestPermission: "everyone",
      messagePermission: "everyone",
      findability: "public",
      shareWardrobe: true,
      shareCreations: true
    },
    metrics: {
      followersCount: 9840,
      followingCount: 45,
      connectionsCount: 180
    },
    createdAt: "2026-01-02T14:20:00.000Z"
  },
  "creator-elena": {
    id: "creator-elena",
    name: "Elena Rostova",
    username: "elena_velvet",
    bio: "Milan-based velvet draper & eveningwear designer. Rich textures & romantic silhouettes.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    fashionInterests: ["Couture", "Eveningwear", "Velvet Draping", "High Fashion"],
    creatorIdentity: {
      isCreator: true,
      verified: true,
      badge: "Milan Atelier",
      styleVibe: "Sensual Luxury & Rich Silk Velvets",
      specialty: "Sculpted Evening Gowns & Corsetry"
    },
    privacySettings: {
      visibility: "public",
      requestPermission: "everyone",
      messagePermission: "everyone",
      findability: "public",
      shareWardrobe: true,
      shareCreations: true
    },
    metrics: {
      followersCount: 22100,
      followingCount: 150,
      connectionsCount: 512
    },
    createdAt: "2025-10-20T09:15:00.000Z"
  }
};

const friendRequestsStore: Record<string, FriendRequest> = {
  "req-1": {
    id: "req-1",
    fromUserId: "creator-sven",
    fromUserName: "Sven Lindqvist",
    fromUserAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    toUserId: "usr-current",
    toUserName: "Sartorial Member",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
};

const connectionsStore: Record<string, SocialConnection> = {
  "conn-1": {
    id: "conn-1",
    user1Id: "usr-current",
    user2Id: "creator-aurelia",
    createdAt: "2026-01-15T10:00:00.000Z"
  }
};

const followersStore: Record<string, CreatorFollower> = {
  "fol-1": {
    id: "fol-1",
    followerId: "usr-current",
    targetCreatorId: "creator-aurelia",
    createdAt: "2026-01-12T08:00:00.000Z"
  },
  "fol-2": {
    id: "fol-2",
    followerId: "usr-current",
    targetCreatorId: "creator-kaito",
    createdAt: "2026-01-14T11:30:00.000Z"
  }
};

const conversationsStore: Record<string, ChatConversation> = {
  "conv-aurelia": {
    id: "conv-aurelia",
    participants: ["usr-current", "creator-aurelia"],
    participantProfiles: {
      "usr-current": {
        name: "Sartorial Member",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
        username: "sartorial_lead"
      },
      "creator-aurelia": {
        name: "Aurelia Vance",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
        username: "aurelia_couture"
      }
    },
    lastMessage: "Greetings. I have analyzed your style DNA. Let us collaborate to sculpt your next high-contrast capsule coordinates.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unreadCount: { "usr-current": 0, "creator-aurelia": 0 },
    type: "direct",
    createdAt: "2026-01-15T10:05:00.000Z"
  },
  "conv-kaito": {
    id: "conv-kaito",
    participants: ["usr-current", "creator-kaito"],
    participantProfiles: {
      "usr-current": {
        name: "Sartorial Member",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
        username: "sartorial_lead"
      },
      "creator-kaito": {
        name: "Kaito Tanaka",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
        username: "kaito_tokyo"
      }
    },
    lastMessage: "Yo! Ready to elevate your rotation? I can guide you on integrating techwear components.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    unreadCount: { "usr-current": 0, "creator-kaito": 0 },
    type: "direct",
    createdAt: "2026-01-16T14:20:00.000Z"
  }
};

const messagesStore: Record<string, ChatMessage[]> = {
  "conv-aurelia": [
    {
      id: "msg-aur-1",
      conversationId: "conv-aurelia",
      senderId: "creator-aurelia",
      senderName: "Aurelia Vance",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      text: "Greetings. I have analyzed your style DNA. Let us collaborate to sculpt your next high-contrast capsule coordinates.",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      readBy: ["usr-current", "creator-aurelia"]
    }
  ],
  "conv-kaito": [
    {
      id: "msg-kai-1",
      conversationId: "conv-kaito",
      senderId: "creator-kaito",
      senderName: "Kaito Tanaka",
      senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      text: "Yo! Ready to elevate your rotation? I can guide you on integrating techwear components.",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      readBy: ["usr-current", "creator-kaito"]
    }
  ]
};

const communitiesStore: Record<string, FashionCommunity> = {
  "comm-luxury-circle": {
    id: "comm-luxury-circle",
    name: "Luxury Fashion Circle",
    slug: "luxury-fashion-circle",
    description: "An exclusive atelier salon discussing high tailoring, haute couture runways, and rare archive pieces.",
    coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    category: "Luxury Fashion",
    membersCount: 1240,
    postsCount: 382,
    members: ["usr-current", "creator-aurelia", "creator-elena"],
    createdBy: "creator-aurelia",
    isPrivate: false,
    createdAt: "2025-11-01T00:00:00.000Z"
  },
  "comm-ai-designers": {
    id: "comm-ai-designers",
    name: "AI Designers Guild",
    slug: "ai-designers-guild",
    description: "Pioneering generative fashion prompts, latent space textiles, and 3D virtual fitting simulations.",
    coverImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600&auto=format&fit=crop",
    category: "AI Designers",
    membersCount: 3890,
    postsCount: 1204,
    members: ["usr-current", "creator-kaito"],
    createdBy: "usr-current",
    isPrivate: false,
    createdAt: "2025-11-10T00:00:00.000Z"
  },
  "comm-streetwear": {
    id: "comm-streetwear",
    name: "Cyber & Techwear Lab",
    slug: "cyber-techwear-lab",
    description: "Tokyo utility outerwear, waterproof membranes, asymmetric straps, and high-spec urban armor.",
    coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
    category: "Streetwear",
    membersCount: 2150,
    postsCount: 740,
    members: ["creator-kaito"],
    createdBy: "creator-kaito",
    isPrivate: false,
    createdAt: "2025-12-05T00:00:00.000Z"
  },
  "comm-nordic-minimal": {
    id: "comm-nordic-minimal",
    name: "Nordic Minimalist Society",
    slug: "nordic-minimalist-society",
    description: "Organic materials, quiet luxury, restrained silhouettes, neutral earth palettes, and zero waste design.",
    coverImage: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop",
    category: "Sustainable Fashion",
    membersCount: 1680,
    postsCount: 420,
    members: ["usr-current", "creator-sven"],
    createdBy: "creator-sven",
    isPrivate: false,
    createdAt: "2026-01-01T00:00:00.000Z"
  }
};

const communityPostsStore: Record<string, CommunityPost[]> = {
  "comm-luxury-circle": [
    {
      id: "post-lux-1",
      communityId: "comm-luxury-circle",
      authorId: "creator-aurelia",
      authorName: "Aurelia Vance",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      authorHandle: "aurelia_couture",
      content: "Unveiling our newest architectural capsule concept: High-contrast wool lapels with integrated magnetic closures. What are your thoughts on asymmetric collar structures for formal evening coats?",
      mediaUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
      sharedCreation: {
        id: "cre-aur-99",
        title: "Monolithic Noir Overcoat",
        imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop",
        styleTags: ["Avant-Garde", "Couture", "Monochrome"]
      },
      likesCount: 84,
      likedBy: ["usr-current"],
      commentsCount: 12,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ],
  "comm-ai-designers": [
    {
      id: "post-ai-1",
      communityId: "comm-ai-designers",
      authorId: "usr-current",
      authorName: "Sartorial Member",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      authorHandle: "sartorial_lead",
      content: "Generated a fluid silk kimono jacket using neural style conditioning. The lattice pattern was calculated based on algorithmic fabric tension models.",
      mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      likesCount: 42,
      likedBy: ["creator-kaito"],
      commentsCount: 5,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ]
};

const postCommentsStore: Record<string, CommunityComment[]> = {
  "post-lux-1": [
    {
      id: "cmt-1",
      postId: "post-lux-1",
      authorId: "usr-current",
      authorName: "Sartorial Member",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      content: "The magnetic closure keeps the line extremely clean. Incredible architectural tension!",
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
    }
  ]
};

// ==========================================
// 1. GLOBAL DISCOVERY & USER PROFILES
// ==========================================

// GET /api/social/users/search - Discover users & creators
router.get("/users/search", async (req: Request, res: Response): Promise<void> => {
  try {
    const queryStr = String(req.query.q || "").toLowerCase().trim();
    const interestFilter = String(req.query.interest || "").toLowerCase().trim();
    const creatorsOnly = req.query.creatorsOnly === "true";

    const allUsers = Object.values(userProfilesStore);

    const filtered = allUsers.filter(user => {
      // Respect findability setting
      if (user.privacySettings.findability === "private" && user.id !== "usr-current") {
        return false;
      }

      if (creatorsOnly && !user.creatorIdentity?.isCreator) {
        return false;
      }

      if (interestFilter) {
        const matchesInterest = user.fashionInterests.some(i => i.toLowerCase().includes(interestFilter));
        if (!matchesInterest) return false;
      }

      if (!queryStr) return true;

      const nameMatch = user.name.toLowerCase().includes(queryStr);
      const usernameMatch = user.username.toLowerCase().includes(queryStr);
      const bioMatch = user.bio.toLowerCase().includes(queryStr);
      const interestMatch = user.fashionInterests.some(i => i.toLowerCase().includes(queryStr));
      const vibeMatch = user.creatorIdentity?.styleVibe?.toLowerCase().includes(queryStr) || false;

      return nameMatch || usernameMatch || bioMatch || interestMatch || vibeMatch;
    });

    res.json({
      success: true,
      query: queryStr,
      count: filtered.length,
      users: filtered
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Search failed" });
  }
});

// GET /api/social/users/:userId/profile - Get user profile
router.get("/users/:userId/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = String(req.params.userId);
    const profile = userProfilesStore[userId];

    if (!profile) {
      res.status(404).json({ success: false, error: "User profile not found" });
      return;
    }

    // Check relationship with current user
    const isConnected = Object.values(connectionsStore).some(
      c => (c.user1Id === "usr-current" && c.user2Id === userId) || (c.user1Id === userId && c.user2Id === "usr-current")
    );

    const isFollowing = Object.values(followersStore).some(
      f => f.followerId === "usr-current" && f.targetCreatorId === userId
    );

    const pendingReq = Object.values(friendRequestsStore).find(
      r => (r.fromUserId === "usr-current" && r.toUserId === userId) || (r.fromUserId === userId && r.toUserId === "usr-current")
    );

    res.json({
      success: true,
      profile,
      relationship: {
        isConnected,
        isFollowing,
        pendingRequestStatus: pendingReq ? pendingReq.status : null,
        pendingRequestId: pendingReq ? pendingReq.id : null
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to fetch user profile" });
  }
});

// PUT /api/social/users/me/privacy - Update privacy controls
router.put("/users/me/privacy", async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = userProfilesStore["usr-current"];
    if (!currentUser) {
      res.status(404).json({ success: false, error: "User profile not found" });
      return;
    }

    const { visibility, requestPermission, messagePermission, findability, shareWardrobe, shareCreations } = req.body || {};

    currentUser.privacySettings = {
      visibility: visibility || currentUser.privacySettings.visibility,
      requestPermission: requestPermission || currentUser.privacySettings.requestPermission,
      messagePermission: messagePermission || currentUser.privacySettings.messagePermission,
      findability: findability || currentUser.privacySettings.findability,
      shareWardrobe: typeof shareWardrobe === "boolean" ? shareWardrobe : currentUser.privacySettings.shareWardrobe,
      shareCreations: typeof shareCreations === "boolean" ? shareCreations : currentUser.privacySettings.shareCreations
    };

    res.json({
      success: true,
      message: "Privacy settings updated successfully",
      privacySettings: currentUser.privacySettings
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to update privacy settings" });
  }
});

// PUT /api/social/users/me/profile - Update profile details
router.put("/users/me/profile", async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = userProfilesStore["usr-current"];
    if (!currentUser) {
      res.status(404).json({ success: false, error: "User profile not found" });
      return;
    }

    const { name, bio, fashionInterests, avatar } = req.body || {};

    if (name) currentUser.name = String(name).trim();
    if (bio) currentUser.bio = String(bio).trim();
    if (Array.isArray(fashionInterests)) currentUser.fashionInterests = fashionInterests.map(String);
    if (avatar) currentUser.avatar = String(avatar).trim();

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: currentUser
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to update profile" });
  }
});

// ==========================================
// 2. SOCIAL GRAPH & FRIEND REQUESTS
// ==========================================

// POST /api/social/friend-requests - Send a friend request
router.post("/friend-requests", async (req: Request, res: Response): Promise<void> => {
  try {
    const { toUserId } = req.body || {};
    const targetUser = userProfilesStore[toUserId];

    if (!targetUser) {
      res.status(404).json({ success: false, error: "Target user not found" });
      return;
    }

    // Check target user's request permission settings
    if (targetUser.privacySettings.requestPermission === "nobody") {
      res.status(403).json({ success: false, error: "This user does not accept new friend requests." });
      return;
    }

    // Check if request or connection already exists
    const existingReq = Object.values(friendRequestsStore).find(
      r => (r.fromUserId === "usr-current" && r.toUserId === toUserId) && r.status === "pending"
    );

    if (existingReq) {
      res.json({ success: true, message: "Friend request is already pending", request: existingReq });
      return;
    }

    const newReqId = `req-${Date.now()}`;
    const newReq: FriendRequest = {
      id: newReqId,
      fromUserId: "usr-current",
      fromUserName: userProfilesStore["usr-current"].name,
      fromUserAvatar: userProfilesStore["usr-current"].avatar,
      toUserId,
      toUserName: targetUser.name,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    friendRequestsStore[newReqId] = newReq;

    res.json({
      success: true,
      message: `Friend request sent to ${targetUser.name}`,
      request: newReq
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to send friend request" });
  }
});

// POST /api/social/friend-requests/:requestId/respond - Accept or reject request
router.post("/friend-requests/:requestId/respond", async (req: Request, res: Response): Promise<void> => {
  try {
    const requestId = String(req.params.requestId);
    const { action } = req.body || {}; // 'accept' or 'reject'

    const friendReq = friendRequestsStore[requestId];
    if (!friendReq) {
      res.status(404).json({ success: false, error: "Friend request not found" });
      return;
    }

    if (action === "accept") {
      friendReq.status = "accepted";

      // Create Connection
      const connId = `conn-${Date.now()}`;
      connectionsStore[connId] = {
        id: connId,
        user1Id: friendReq.fromUserId,
        user2Id: friendReq.toUserId,
        createdAt: new Date().toISOString()
      };

      // Increment connections counts
      if (userProfilesStore[friendReq.fromUserId]) {
        userProfilesStore[friendReq.fromUserId].metrics.connectionsCount += 1;
      }
      if (userProfilesStore[friendReq.toUserId]) {
        userProfilesStore[friendReq.toUserId].metrics.connectionsCount += 1;
      }

      res.json({
        success: true,
        message: "Friend request accepted! Connection established.",
        request: friendReq
      });
    } else {
      friendReq.status = "rejected";
      res.json({
        success: true,
        message: "Friend request declined.",
        request: friendReq
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to respond to request" });
  }
});

// DELETE /api/social/connections/:targetUserId - Remove connection
router.delete("/connections/:targetUserId", async (req: Request, res: Response): Promise<void> => {
  try {
    const targetUserId = String(req.params.targetUserId);

    const connEntryKey = Object.keys(connectionsStore).find(key => {
      const c = connectionsStore[key];
      return (c.user1Id === "usr-current" && c.user2Id === targetUserId) || (c.user1Id === targetUserId && c.user2Id === "usr-current");
    });

    if (connEntryKey) {
      delete connectionsStore[connEntryKey];
      if (userProfilesStore["usr-current"] && userProfilesStore["usr-current"].metrics.connectionsCount > 0) {
        userProfilesStore["usr-current"].metrics.connectionsCount -= 1;
      }
      if (userProfilesStore[targetUserId] && userProfilesStore[targetUserId].metrics.connectionsCount > 0) {
        userProfilesStore[targetUserId].metrics.connectionsCount -= 1;
      }
    }

    res.json({ success: true, message: "Connection removed." });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to remove connection" });
  }
});

// GET /api/social/connections - Get current user connections and friend requests
router.get("/connections", async (req: Request, res: Response): Promise<void> => {
  try {
    const userConns = Object.values(connectionsStore).filter(
      c => c.user1Id === "usr-current" || c.user2Id === "usr-current"
    );

    const connectedUserIds = userConns.map(c => (c.user1Id === "usr-current" ? c.user2Id : c.user1Id));
    const connectedProfiles = connectedUserIds.map(id => userProfilesStore[id]).filter(Boolean);

    const incomingRequests = Object.values(friendRequestsStore).filter(
      r => r.toUserId === "usr-current" && r.status === "pending"
    );

    const outgoingRequests = Object.values(friendRequestsStore).filter(
      r => r.fromUserId === "usr-current" && r.status === "pending"
    );

    const followedCreators = Object.values(followersStore)
      .filter(f => f.followerId === "usr-current")
      .map(f => userProfilesStore[f.targetCreatorId])
      .filter(Boolean);

    res.json({
      success: true,
      connections: connectedProfiles,
      incomingRequests,
      outgoingRequests,
      followedCreators
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to fetch connections" });
  }
});

// POST /api/social/creators/:creatorId/follow - Follow / Unfollow creator
router.post("/creators/:creatorId/follow", async (req: Request, res: Response): Promise<void> => {
  try {
    const creatorId = String(req.params.creatorId);
    const { follow = true } = req.body || {};

    const creator = userProfilesStore[creatorId];
    if (!creator) {
      res.status(404).json({ success: false, error: "Creator not found" });
      return;
    }

    const existingFollowKey = Object.keys(followersStore).find(
      key => followersStore[key].followerId === "usr-current" && followersStore[key].targetCreatorId === creatorId
    );

    if (follow) {
      if (!existingFollowKey) {
        const folId = `fol-${Date.now()}`;
        followersStore[folId] = {
          id: folId,
          followerId: "usr-current",
          targetCreatorId: creatorId,
          createdAt: new Date().toISOString()
        };
        creator.metrics.followersCount += 1;
        userProfilesStore["usr-current"].metrics.followingCount += 1;
      }
      res.json({ success: true, message: `Now following ${creator.name}`, isFollowing: true });
    } else {
      if (existingFollowKey) {
        delete followersStore[existingFollowKey];
        if (creator.metrics.followersCount > 0) creator.metrics.followersCount -= 1;
        if (userProfilesStore["usr-current"].metrics.followingCount > 0) userProfilesStore["usr-current"].metrics.followingCount -= 1;
      }
      res.json({ success: true, message: `Unfollowed ${creator.name}`, isFollowing: false });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to update follow state" });
  }
});

// ==========================================
// 3. REAL-TIME PRIVATE & ROOM MESSAGING
// ==========================================

// GET /api/social/conversations - List conversations
router.get("/conversations", async (req: Request, res: Response): Promise<void> => {
  try {
    const userConvs = Object.values(conversationsStore).filter(
      c => c.participants.includes("usr-current")
    );

    // Sort by lastMessageAt descending
    userConvs.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    res.json({
      success: true,
      conversations: userConvs
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to fetch conversations" });
  }
});

// POST /api/social/conversations - Start or get existing conversation
router.post("/conversations", async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetUserId } = req.body || {};
    const targetUser = userProfilesStore[targetUserId];

    if (!targetUser) {
      res.status(404).json({ success: false, error: "Target user not found" });
      return;
    }

    // Check message permissions
    if (targetUser.privacySettings.messagePermission === "nobody") {
      res.status(403).json({ success: false, error: "This user does not accept direct messages." });
      return;
    }

    if (targetUser.privacySettings.messagePermission === "connections") {
      const isConnected = Object.values(connectionsStore).some(
        c => (c.user1Id === "usr-current" && c.user2Id === targetUserId) || (c.user1Id === targetUserId && c.user2Id === "usr-current")
      );
      if (!isConnected) {
        res.status(403).json({ success: false, error: "You must be connected with this user to send direct messages." });
        return;
      }
    }

    // Check existing conversation
    let existingConv = Object.values(conversationsStore).find(
      c => c.type === "direct" && c.participants.includes("usr-current") && c.participants.includes(targetUserId)
    );

    if (!existingConv) {
      const convId = `conv-${Date.now()}`;
      const currentUser = userProfilesStore["usr-current"];

      existingConv = {
        id: convId,
        participants: ["usr-current", targetUserId],
        participantProfiles: {
          "usr-current": {
            name: currentUser.name,
            avatar: currentUser.avatar,
            username: currentUser.username
          },
          [targetUserId]: {
            name: targetUser.name,
            avatar: targetUser.avatar,
            username: targetUser.username
          }
        },
        lastMessage: "Conversation opened",
        lastMessageAt: new Date().toISOString(),
        unreadCount: { "usr-current": 0, [targetUserId]: 0 },
        type: "direct",
        createdAt: new Date().toISOString()
      };

      conversationsStore[convId] = existingConv;
      messagesStore[convId] = [];
    }

    res.json({
      success: true,
      conversation: existingConv
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to create conversation" });
  }
});

// GET /api/social/conversations/:conversationId/messages - Message history
router.get("/conversations/:conversationId/messages", async (req: Request, res: Response): Promise<void> => {
  try {
    const conversationId = String(req.params.conversationId);
    const conv = conversationsStore[conversationId];

    if (!conv) {
      res.status(404).json({ success: false, error: "Conversation not found" });
      return;
    }

    const messages = messagesStore[conversationId] || [];

    res.json({
      success: true,
      conversation: conv,
      messages
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to fetch messages" });
  }
});

// POST /api/social/conversations/:conversationId/messages - Send a message
router.post("/conversations/:conversationId/messages", async (req: Request, res: Response): Promise<void> => {
  try {
    const conversationId = String(req.params.conversationId);
    const { text, mediaUrl, sharedCreation } = req.body || {};

    const conv = conversationsStore[conversationId];
    if (!conv) {
      res.status(404).json({ success: false, error: "Conversation not found" });
      return;
    }

    if (!text && !mediaUrl && !sharedCreation) {
      res.status(400).json({ success: false, error: "Message must contain text, media, or shared creation." });
      return;
    }

    const currentUser = userProfilesStore["usr-current"];
    const msgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
      conversationId,
      senderId: "usr-current",
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text ? String(text).trim() : (sharedCreation ? `Shared creation: ${sharedCreation.title}` : "Shared media attachment"),
      mediaUrl: mediaUrl ? String(mediaUrl) : undefined,
      sharedCreation: sharedCreation || undefined,
      createdAt: new Date().toISOString(),
      readBy: ["usr-current"]
    };

    if (!messagesStore[conversationId]) {
      messagesStore[conversationId] = [];
    }
    messagesStore[conversationId].push(newMsg);

    // Update conversation metadata
    conv.lastMessage = newMsg.text;
    conv.lastMessageAt = newMsg.createdAt;

    // Simulate smart curator or peer response if messaging an AI Creator
    const otherParticipantId = conv.participants.find(p => p !== "usr-current");
    if (otherParticipantId && userProfilesStore[otherParticipantId]?.creatorIdentity) {
      setTimeout(() => {
        const creator = userProfilesStore[otherParticipantId];
        const replyMsgId = `msg-reply-${Date.now()}`;
        const replyMsg: ChatMessage = {
          id: replyMsgId,
          conversationId,
          senderId: creator.id,
          senderName: creator.name,
          senderAvatar: creator.avatar,
          text: `Thank you for sharing! I love the focus on ${creator.creatorIdentity?.styleVibe || "architectural fashion"}. Let's collaborate on this coordinate!`,
          createdAt: new Date().toISOString(),
          readBy: ["usr-current", creator.id]
        };
        messagesStore[conversationId].push(replyMsg);
        conv.lastMessage = replyMsg.text;
        conv.lastMessageAt = replyMsg.createdAt;
      }, 1200);
    }

    res.json({
      success: true,
      message: newMsg
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to send message" });
  }
});

// ==========================================
// 4. FASHION COMMUNITIES SYSTEM
// ==========================================

// GET /api/social/communities - List communities
router.get("/communities", async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryFilter = String(req.query.category || "").toLowerCase().trim();
    const allCommunities = Object.values(communitiesStore);

    const filtered = allCommunities.filter(c => {
      if (categoryFilter && c.category.toLowerCase() !== categoryFilter) {
        return false;
      }
      return true;
    });

    res.json({
      success: true,
      communities: filtered
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to fetch communities" });
  }
});

// POST /api/social/communities - Create a community
router.post("/communities", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, coverImage, isPrivate } = req.body || {};

    if (!name || !description || !category) {
      res.status(400).json({ success: false, error: "Name, description, and category are required." });
      return;
    }

    const commId = `comm-${Date.now()}`;
    const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newComm: FashionCommunity = {
      id: commId,
      name: String(name).trim(),
      slug,
      description: String(description).trim(),
      coverImage: coverImage ? String(coverImage) : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
      category,
      membersCount: 1,
      postsCount: 0,
      members: ["usr-current"],
      createdBy: "usr-current",
      isPrivate: Boolean(isPrivate),
      createdAt: new Date().toISOString()
    };

    communitiesStore[commId] = newComm;
    communityPostsStore[commId] = [];

    res.json({
      success: true,
      message: "Fashion community created successfully!",
      community: newComm
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to create community" });
  }
});

// POST /api/social/communities/:communityId/join - Join / Leave community
router.post("/communities/:communityId/join", async (req: Request, res: Response): Promise<void> => {
  try {
    const communityId = String(req.params.communityId);
    const comm = communitiesStore[communityId];

    if (!comm) {
      res.status(404).json({ success: false, error: "Community not found" });
      return;
    }

    const isMember = comm.members.includes("usr-current");

    if (isMember) {
      comm.members = comm.members.filter(m => m !== "usr-current");
      comm.membersCount = Math.max(0, comm.membersCount - 1);
      res.json({ success: true, message: `Left ${comm.name}`, isMember: false, community: comm });
    } else {
      comm.members.push("usr-current");
      comm.membersCount += 1;
      res.json({ success: true, message: `Joined ${comm.name}`, isMember: true, community: comm });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to update community membership" });
  }
});

// GET /api/social/communities/:communityId/posts - Community post feed
router.get("/communities/:communityId/posts", async (req: Request, res: Response): Promise<void> => {
  try {
    const communityId = String(req.params.communityId);
    const posts = communityPostsStore[communityId] || [];

    res.json({
      success: true,
      communityId,
      posts
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to fetch community posts" });
  }
});

// POST /api/social/communities/:communityId/posts - Create post
router.post("/communities/:communityId/posts", async (req: Request, res: Response): Promise<void> => {
  try {
    const communityId = String(req.params.communityId);
    const { content, mediaUrl, sharedCreation } = req.body || {};

    const comm = communitiesStore[communityId];
    if (!comm) {
      res.status(404).json({ success: false, error: "Community not found" });
      return;
    }

    if (!content) {
      res.status(400).json({ success: false, error: "Post content is required." });
      return;
    }

    const currentUser = userProfilesStore["usr-current"];
    const postId = `post-${Date.now()}`;
    const newPost: CommunityPost = {
      id: postId,
      communityId,
      authorId: "usr-current",
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorHandle: currentUser.username,
      content: String(content).trim(),
      mediaUrl: mediaUrl ? String(mediaUrl) : undefined,
      sharedCreation: sharedCreation || undefined,
      likesCount: 0,
      likedBy: [],
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };

    if (!communityPostsStore[communityId]) {
      communityPostsStore[communityId] = [];
    }
    communityPostsStore[communityId].unshift(newPost);
    comm.postsCount += 1;

    res.json({
      success: true,
      message: "Post created successfully!",
      post: newPost
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to create post" });
  }
});

// POST /api/social/posts/:postId/like - Like / Unlike post
router.post("/posts/:postId/like", async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = String(req.params.postId);

    let foundPost: CommunityPost | null = null;
    for (const commPosts of Object.values(communityPostsStore)) {
      const match = commPosts.find(p => p.id === postId);
      if (match) {
        foundPost = match;
        break;
      }
    }

    if (!foundPost) {
      res.status(404).json({ success: false, error: "Post not found" });
      return;
    }

    const hasLiked = foundPost.likedBy.includes("usr-current");
    if (hasLiked) {
      foundPost.likedBy = foundPost.likedBy.filter(id => id !== "usr-current");
      foundPost.likesCount = Math.max(0, foundPost.likesCount - 1);
    } else {
      foundPost.likedBy.push("usr-current");
      foundPost.likesCount += 1;
    }

    res.json({
      success: true,
      likesCount: foundPost.likesCount,
      hasLiked: !hasLiked
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to update post like" });
  }
});

// GET /api/social/posts/:postId/comments - Fetch comments
router.get("/posts/:postId/comments", async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = String(req.params.postId);
    const comments = postCommentsStore[postId] || [];
    res.json({ success: true, postId, comments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to fetch comments" });
  }
});

// POST /api/social/posts/:postId/comments - Add comment
router.post("/posts/:postId/comments", async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = String(req.params.postId);
    const { content } = req.body || {};

    if (!content) {
      res.status(400).json({ success: false, error: "Comment text required" });
      return;
    }

    const currentUser = userProfilesStore["usr-current"];
    const cmtId = `cmt-${Date.now()}`;
    const newComment: CommunityComment = {
      id: cmtId,
      postId,
      authorId: "usr-current",
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content: String(content).trim(),
      createdAt: new Date().toISOString()
    };

    if (!postCommentsStore[postId]) postCommentsStore[postId] = [];
    postCommentsStore[postId].push(newComment);

    // Increment post comment count
    for (const commPosts of Object.values(communityPostsStore)) {
      const match = commPosts.find(p => p.id === postId);
      if (match) {
        match.commentsCount += 1;
        break;
      }
    }

    res.json({
      success: true,
      comment: newComment
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || "Failed to post comment" });
  }
});

// ==========================================
// 5. PRIVACY-FIRST AI SOCIAL INTELLIGENCE
// ==========================================

// POST /api/social/ai-assistant - User-initiated AI Social Matchmaker & Creator Discovery
router.post("/ai-assistant", async (req: Request, res: Response): Promise<void> => {
  try {
    const { queryText } = req.body || {};

    if (!queryText) {
      res.status(400).json({ success: false, error: "Prompt query required" });
      return;
    }

    const currentUser = userProfilesStore["usr-current"];

    // 1. Gather ONLY public profile data & public communities
    const publicCreators = Object.values(userProfilesStore).filter(
      u => u.creatorIdentity?.isCreator && u.privacySettings.visibility === "public"
    );

    const publicCommunities = Object.values(communitiesStore).filter(
      c => !c.isPrivate
    );

    // Prepare context for Gemini model
    const creatorsSummary = publicCreators.map(c => ({
      id: c.id,
      name: c.name,
      username: c.username,
      vibe: c.creatorIdentity?.styleVibe,
      specialty: c.creatorIdentity?.specialty,
      fashionInterests: c.fashionInterests,
      followersCount: c.metrics.followersCount
    }));

    const communitiesSummary = publicCommunities.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      description: c.description,
      membersCount: c.membersCount
    }));

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Direct high-fidelity deterministic response if key unavailable
      const queryLower = String(queryText).toLowerCase();

      let matchedCreators = publicCreators.filter(c =>
        c.fashionInterests.some(i => queryLower.includes(i.toLowerCase())) ||
        c.creatorIdentity?.styleVibe.toLowerCase().includes(queryLower) ||
        c.name.toLowerCase().includes(queryLower)
      );

      let matchedCommunities = publicCommunities.filter(c =>
        c.category.toLowerCase().includes(queryLower) ||
        c.name.toLowerCase().includes(queryLower)
      );

      if (matchedCreators.length === 0 && matchedCommunities.length === 0) {
        res.json({
          success: true,
          response: {
            answer: "Insufficient information available. I could not find verified creators or public fashion circles matching your specific criteria in the current social index. You can adjust your fashion interest tags or search global discovery directly.",
            matchesFound: false,
            suggestedCreators: [],
            suggestedCommunities: [],
            privacyDisclaimer: "Privacy Guard Active: AI only accesses verified public creator profiles and public communities with explicit permission."
          }
        });
        return;
      }

      res.json({
        success: true,
        response: {
          answer: `Based on public creator indices, I discovered ${matchedCreators.length} verified creators and ${matchedCommunities.length} fashion circles matching your request.`,
          matchesFound: true,
          suggestedCreators: matchedCreators,
          suggestedCommunities: matchedCommunities,
          privacyDisclaimer: "Privacy Guard Active: AI accesses public profile data only upon explicit user request."
        }
      });
      return;
    }

    // Call Gemini API with strict privacy instructions
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the AI Social Intelligence Assistant for LOOK VISION AI Fashion Operating System.
The user is requesting creator recommendations or community circles matching their query.

User Query: "${queryText}"
User Fashion DNA Interests: ${JSON.stringify(currentUser.fashionInterests)}

Available Verified Public Creators:
${JSON.stringify(creatorsSummary, null, 2)}

Available Public Fashion Communities:
${JSON.stringify(communitiesSummary, null, 2)}

STRICT PRIVACY-FIRST RULES:
1. NEVER invent or hallucinate fake creators, fake user profiles, or non-existent social matches.
2. If there are no creators or communities matching the query or user interests, clearly state: "Insufficient information available."
3. Do NOT reveal private profiles or private user data.
4. Keep the tone sophisticated, sartorial, and objective.

Provide a brief, elegant summary explaining your findings and recommend matching creator IDs and community IDs from the provided lists if applicable.`;

    const aiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const aiAnswer = aiRes.text || "Insufficient information available.";

    // Filter relevant creators and communities
    const matchedCreators = publicCreators.filter(c =>
      aiAnswer.includes(c.id) ||
      aiAnswer.includes(c.name) ||
      c.fashionInterests.some(i => String(queryText).toLowerCase().includes(i.toLowerCase()))
    );

    const matchedCommunities = publicCommunities.filter(c =>
      aiAnswer.includes(c.id) ||
      aiAnswer.includes(c.name) ||
      String(queryText).toLowerCase().includes(c.category.toLowerCase())
    );

    res.json({
      success: true,
      response: {
        answer: aiAnswer,
        matchesFound: matchedCreators.length > 0 || matchedCommunities.length > 0,
        suggestedCreators: matchedCreators,
        suggestedCommunities: matchedCommunities,
        privacyDisclaimer: "Privacy Guard Active: AI executes social match checks strictly on user demand with public boundary isolation."
      }
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || "AI Social Matchmaker query failed",
      response: {
        answer: "Insufficient information available due to temporary system latency. Please retry your query.",
        matchesFound: false,
        privacyDisclaimer: "Privacy Guard Active: AI operates strictly on explicit user request."
      }
    });
  }
});

export default router;
