import * as mongoose from 'mongoose';

export interface Contact extends mongoose.Document{
  readonly user: string;
  readonly name: string;
  readonly phone: number;
}