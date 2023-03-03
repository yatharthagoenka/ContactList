import * as mongoose from 'mongoose';

export class CreateContactDTO {
readonly user: string;
readonly name: string;
readonly phone: number;
}