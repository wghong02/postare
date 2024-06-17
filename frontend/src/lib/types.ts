import { ChangeEvent, FormEvent } from "react";

export interface UploadFormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  postDetails: string;
  imageUrl: string;
}

export interface UploadPostFormProps {
  formData: UploadFormData;
  isOpen: boolean;
  onClose: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (event: FormEvent) => Promise<void>;
}
