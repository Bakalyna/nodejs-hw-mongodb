import { contactsModel } from '../db/Contact/contact.js';

export const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

export const getContactById = async (studentId) => {
  const contact = await contactsModel.findById(studentId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await contactsModel.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await contactsModel.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await contactsModel.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};