import { ChangeEvent, FormEvent } from "react";

export interface UploadFormData {
  title: string;
  description: string;
  price: string;
  condition: string;
  productLocation: string;
  productDetails: string;
  imageUrl: string;
}

export interface UploadProductFormProps {
  formData: UploadFormData;
  isOpen: boolean;
  onClose: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (event: FormEvent) => Promise<void>;
}

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}
