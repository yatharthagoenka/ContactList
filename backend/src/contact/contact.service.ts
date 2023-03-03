import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './interfaces/contact.interface';
import { CreateContactDTO } from './dto/contact.dto';

@Injectable()
export class ContactService {

    constructor(@InjectModel('Contact') private readonly contactModel: Model<Contact>) { }
    
    async addContact(createContactDTO: CreateContactDTO): Promise<Contact> {
        const newContact = new this.contactModel(createContactDTO);
        return newContact.save();
    }  
        
    async getContact(contactID): Promise<Contact> {
        const state = await this.contactModel.findById(contactID).exec();
        return state;
    }
        
    async getContacts(): Promise<Contact[]> {
        const Contacts = await this.contactModel.find().exec();
        return Contacts;
    }

    async editContact(contactID, createContactDTO: CreateContactDTO): Promise<Contact> {
        const editedContact = await this.contactModel.findByIdAndUpdate(contactID, createContactDTO, { new: true });
        return editedContact;
      }
      async deleteContact(contactID): Promise<any> {
        const deletedContact = await this.contactModel.findByIdAndRemove(contactID);
        return deletedContact;
      }

}
