import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();

  const logoutAndRedirect = (redirectTo: string = '/auth/login') => {
    logout();
    router.push(redirectTo);
  };

  return { logout, logoutAndRedirect };
}
