import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnalysisResult, SocialProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useListAnalyses() {
  const { actor, isFetching } = useActor();
  return useQuery<AnalysisResult[]>({
    queryKey: ["analyses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAnalyses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAnalysis(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<AnalysisResult | null>({
    queryKey: ["analysis", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getAnalysis(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSubmitAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profile,
      labelText,
    }: {
      profile: SocialProfile;
      labelText: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitAnalysis(profile, labelText);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}

export function useDeleteAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAnalysis(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}

export function useCreateSeeds() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createSeeds();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}
