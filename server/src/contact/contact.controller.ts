import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Query, Delete, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthService } from '../authentication/auth.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { CreateContactDTO } from './dto/contact.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';
import { UserService } from 'src/user/user.service';
    
@Controller('contact')
export class ContactController {
    constructor(
        private contactService: ContactService, 
        private userService: UserService,
    ) {}

    @Post('/add')
    @UseGuards(AuthGuard("jwt"))
    async addContact(@Res() res, @Body() createContactDTO: CreateContactDTO) {
        const user = (await this.userService.findById(createContactDTO.user));
        if (!user) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: `The user with id ${createContactDTO.user} does not exist.`
            });
        } 
        try{
            const newContact = await this.contactService.addContact(createContactDTO);
            return res.status(HttpStatus.OK).json({
                message: 'Contact has been created successfully!',
                contact: newContact,
            });
        }catch{
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: 'Contact already exists!'
            });
        }
        
    }
    
    @Get('contact/:contactID')
    async getContact(@Res() res, @Param('contactID', new ValidateObjectId()) contactID) {
        const contact = await this.contactService.getContact(contactID);
        if (!contact) {
            throw new NotFoundException('Contact does not exist!');
        }
        return res.status(HttpStatus.OK).json(contact);
    }

    @Get('/all')
    @UseGuards(AuthGuard("jwt"))
    async getContacts(@Res() res) {
        const contacts = await this.contactService.getContacts();
        return res.status(HttpStatus.OK).json(contacts);
    }

    @Get('/userContacts')
    @UseGuards(AuthGuard("jwt"))
    async getUserContacts(@Res() res, @Query('userID', new ValidateObjectId()) userID) {
        const contacts = await this.contactService.getUserContacts(userID);
        return res.status(HttpStatus.OK).json(contacts);
    }

    @Put('/edit')
    @UseGuards(AuthGuard("jwt"))
    async editContact(@Res() res, @Query('contactID', new ValidateObjectId()) contactID, @Body() createContactDTO: CreateContactDTO){
        const editedContact = await this.contactService.editContact(contactID, createContactDTO);
        if (!editedContact) {
            throw new NotFoundException('Contact does not exist!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Contact has been updated updated',
            contact: editedContact,
        });
    }
    
    @Delete('/delete')
    @UseGuards(AuthGuard("jwt"))
    async deleteContact(@Res() res,  @Query('contactID', new ValidateObjectId()) contactID) {
        const deletedContact = await this.contactService.deleteContact(contactID);
        if (!deletedContact) {
            throw new NotFoundException('Contact does not exist!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Contact has been deleted!',
            contact: deletedContact,
        });
    }
}