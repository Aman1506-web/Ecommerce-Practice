import { useUser } from "@clerk/nextjs";

export function useUserRole(): string | undefined {
  // ye hook ka kaam h role return krna user ka
  const { user } = useUser();
  return user?.publicMetadata?.role as string | undefined;
}