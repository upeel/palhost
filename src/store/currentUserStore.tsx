import { User } from "@/types/user";
import { create } from "zustand";

type UserSlice = {
  user: User | null;
  setUser: (user: User) => void;
};

const useCurrentUserStore = create<UserSlice>((set) => ({
  user: null,
  setUser: (user: User) => {
    set({ user });
  },
}));

export default useCurrentUserStore;
