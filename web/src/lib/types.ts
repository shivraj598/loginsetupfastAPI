export type User = {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
};

export type SignUpInput = {
  email: string;
  full_name?: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};
