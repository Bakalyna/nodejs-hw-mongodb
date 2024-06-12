import { Router } from 'express';
import ctrlWrapper from '../utils/ctrWrapper.js';
import {
  createContactController,
  deleteContactByIDController,
  getAllContactsController,
  getContactByIdcontroller,
  patchContactController,
} from '../controllers/contacts.js';

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdcontroller));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', ctrlWrapper(patchContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactByIDController));

export default router;
