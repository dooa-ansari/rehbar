import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { Skill } from "@/types/skills_graph";
import { EndPoint } from "../endpoints";
import { apiClient } from "../axios_client";

export const useSkills = (query?: string) => {
  return useQuery<Skill[]>({
    queryKey: [EndPoint.skills.key, query],
    queryFn: async () => {
      const { data } = await apiClient.get<Skill[]>(EndPoint.skills.url, {
        params: { q: query },
      });
      console.log(data)
      return data;
    },
    enabled: true
  });
};
