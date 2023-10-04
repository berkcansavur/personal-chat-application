import { CreateNotificationDto } from '../dto/create-notification.dto';
export interface INotificationState {
    create({
        createNotificationDto
    }:{
        createNotificationDto : CreateNotificationDto
    }): Promise<Notification>;
}