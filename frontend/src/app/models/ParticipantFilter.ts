
import { RoleEngagement, TypeParticipant , TypeEngagement} from './participant';


export interface ParticipantFilter {
    page?: number;
    size?: number;
    role?: RoleEngagement;
    type?: TypeParticipant;
    typeEngagement?: TypeEngagement;
    search?: string;
    evenementId?: number;
  }
