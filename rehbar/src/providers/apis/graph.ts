import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "../axios_client";
import { EndPoint } from "../endpoints";
import { SkillsGraph } from "@/types/skills_graph";

export const useGraphs = () => {
    return useQuery({
        queryKey: [EndPoint.graph.key],
        queryFn: async () => apiClient.get<SkillsGraph[]>(EndPoint.graph.url),
    });
};

export const useGraph = (id: string) => {
    return useQuery({
        queryKey: [EndPoint.graph.key, id],
        queryFn: async () => apiClient.get<SkillsGraph>(EndPoint.graph.url),
    });
};

export const useCreateGraph = () => {
    return useMutation({
        mutationFn: async (graph: SkillsGraph) => {
            console.log("API call - Creating graph:", graph);
            console.log("API endpoint:", EndPoint.graph.url);
            const response = await apiClient.post(EndPoint.graph.url, graph);
            console.log("API response:", response);
            return response;
        },
    });
};

export const useUpdateGraph = () => {
    return useMutation({
        mutationFn: async (graph: SkillsGraph) => apiClient.put(EndPoint.graph.url, graph),
    });
};

export const useDeleteGraph = () => {
    return useMutation({
        mutationFn: async (id: string) => apiClient.delete(EndPoint.graph.url),
    });
};

