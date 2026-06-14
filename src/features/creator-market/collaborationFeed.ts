import { RenderedLook } from '../rendering/outfitRenderer';

export interface CollabProject {
  projectId: string;
  contributingCreators: string[]; // creatorIds
  name: string;
  mergedConcept: string;
  resultingLook: RenderedLook;
  coCreationStrength: number; // 0-100%
  commentsCount: number;
  likesCount: number;
}

export class CollaborationFeed {
  private static projects: CollabProject[] = [];

  static seedCollabProject(
    creators: string[],
    name: string,
    mergedConcept: string,
    look: RenderedLook
  ): CollabProject {
    const proj: CollabProject = {
      projectId: `collab-${Date.now()}`,
      contributingCreators: creators,
      name,
      mergedConcept,
      resultingLook: look,
      coCreationStrength: Math.round(75 + Math.random() * 25),
      commentsCount: 3,
      likesCount: 14
    };
    this.projects.push(proj);
    return proj;
  }

  static getActiveCollaborationFeeds(): CollabProject[] {
    return this.projects;
  }
}
