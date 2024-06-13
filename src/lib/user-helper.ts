const UserHelper = {
  isLoggedIn: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },
  logout: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    //reset tidio chat
    const tidioUrl = process.env.NEXT_PUBLIC_TIDIO_SRC;
    const tidio = tidioUrl?.split('/').pop()?.replace('.js', '') || '';
    localStorage.removeItem(`tidio_state_${tidio}`);
    localStorage.removeItem(`tidio_state_${tidio}_cache`);
    window.location.href = "/";
  },
};

export default UserHelper;
