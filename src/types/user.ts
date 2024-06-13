import { User } from "lucide-react";

export type User = {
  id: string;
  name: string;
  email: string;
  email_verified_at: Date;
  must_set_password: Boolean;
};
