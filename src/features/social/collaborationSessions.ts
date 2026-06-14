import { RenderedLook } from '../rendering/outfitRenderer';

export interface CollaborationRoom {
  roomId: string;
  name: string;
  activeDesigners: string[]; // usernames
  currentBaseLook?: RenderedLook;
  proposedChanges: {
    author: string;
    description: string;
    appliedAt: Date;
  }[];
  isLive: boolean;
}

export class CollaborationSessions {
  private static rooms: { [id: string]: CollaborationRoom } = {
    'room-01': {
      roomId: 'room-01',
      name: 'Milan Fashion Week Co-labs',
      activeDesigners: ['scandisartorialist', 'tactical_nomad'],
      isLive: true,
      proposedChanges: [
        { author: 'tactical_nomad', description: 'Swap the wool trousers with multi-pocket nylon ripstop cords.', appliedAt: new Date() }
      ]
    }
  };

  static listRooms(): CollaborationRoom[] {
    return Object.values(this.rooms);
  }

  static createRoom(name: string, firstDesignerName: string): CollaborationRoom {
    const fresh: CollaborationRoom = {
      roomId: `room-${Date.now()}`,
      name,
      activeDesigners: [firstDesignerName],
      isLive: true,
      proposedChanges: []
    };
    this.rooms[fresh.roomId] = fresh;
    return fresh;
  }

  static proposeStyleSlide(roomId: string, author: string, desc: string) {
    const room = this.rooms[roomId];
    if (room) {
      room.proposedChanges.push({
        author,
        description: desc,
        appliedAt: new Date()
      });
    }
  }
}
