import { Router } from 'express';
import ctrlWrapper from '../utils/ctrWrapper.js';
import {
  createContactController,
  deleteContactByIDController,
  getAllContactsController,
  getContactByIdcontroller,
  patchContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middleware/validateBody.js';
import { createContactSchema } from '../validation/createContactShema.js';
import { updateContactSchema } from '../validation/updateContactShema.js';
import { isValidId } from '../utils/isValidId.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdcontroller));
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactByIDController),
);

export default router;
