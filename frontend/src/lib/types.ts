import { ChangeEvent, FormEvent } from "react";

export type UploadFormData = {
  title: string;
  description: string;
  postDetails: string;
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

export type QueryProps = {
  limit: number | null;
  offset: number | null;
  description: string | null ;
}
