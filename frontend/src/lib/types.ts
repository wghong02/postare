import { ChangeEvent, FormEvent } from "react";

export type UploadFormData = {
  title: string;
  description: string;
  postDetails: string;
  imageUrl: string;
};

export type TouchedUploadFields = {
  [key in keyof UploadFormData]: boolean;
};

export interface UploadPostFormProps {
  formData: UploadFormData;
  isOpen: boolean;
  onClose: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (event: FormEvent) => Promise<void>;
}
