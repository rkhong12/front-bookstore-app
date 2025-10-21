import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../service/userAPI";

export const useUser = (page = 0, size = 10) => {
  const queryClient = useQueryClient();

  const { data: users = {}, isLoading } = useQuery({
    queryKey: ["users", page, size],
    queryFn: () => userAPI.list(page, size),
  });

  const updatePoint = useMutation({
    mutationFn: userAPI.updatePoint,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return {
    users,
    isLoading,
    updatePoint,
  };
};
