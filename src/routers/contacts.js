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
import { upload } from '../middleware/multer.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdcontroller));
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactByIDController),
);

export default router;
