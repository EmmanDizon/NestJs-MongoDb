import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserSettings {
  @Prop({ required: false, default: false })
  receiveNotifications?: boolean;

  @Prop({ required: false, default: false })
  recieveEmails?: boolean;

  @Prop({ required: false, default: false })
  receieveSMS?: boolean;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
