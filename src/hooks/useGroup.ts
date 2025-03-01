import { useState, useEffect, useCallback } from "react";
import { fetchClient } from "@/lib/api/fetchClient";
import { endpoints } from "@/lib/api/endpoints";
import {
  Group,
  GroupMember,
  CreateGroupData,
  UpdateGroupData,
} from "@/types/group";

interface UseGroupReturn {
  groups: Group[];
  userGroups: Group[];
  currentGroup: Group | null;
  groupMembers: GroupMember[];
  isLoading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  fetchUserGroups: () => Promise<void>;
  fetchGroupById: (id: string) => Promise<void>;
  fetchGroupMembers: (groupId: string) => Promise<void>;
  createGroup: (data: CreateGroupData) => Promise<Group | null>;
  updateGroup: (id: string, data: UpdateGroupData) => Promise<Group | null>;
  deleteGroup: (id: string) => Promise<boolean>;
  joinGroup: (groupId: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  addMember: (
    groupId: string,
    userId: string,
    role?: string
  ) => Promise<boolean>;
  removeMember: (groupId: string, userId: string) => Promise<boolean>;
  updateMemberRole: (
    groupId: string,
    userId: string,
    role: string
  ) => Promise<boolean>;
}

export function useGroup(): UseGroupReturn {
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClient<Group[]>(endpoints.groups.list);
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch groups");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserGroups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClient<Group[]>(endpoints.groups.userGroups);
      setUserGroups(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user groups"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchGroupById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClient<Group>(`${endpoints.groups.single}/${id}`);
      setCurrentGroup(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch group");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchGroupMembers = useCallback(async (groupId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClient<GroupMember[]>(
        `${endpoints.groups.members}/${groupId}`
      );
      setGroupMembers(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch group members"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGroup = useCallback(
    async (data: CreateGroupData): Promise<Group | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const newGroup = await fetchClient<Group>(endpoints.groups.create, {
          method: "POST",
          body: JSON.stringify(data),
        });
        setGroups((prev) => [...prev, newGroup]);
        setUserGroups((prev) => [...prev, newGroup]);
        return newGroup;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create group");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateGroup = useCallback(
    async (id: string, data: UpdateGroupData): Promise<Group | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedGroup = await fetchClient<Group>(
          `${endpoints.groups.update}/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(data),
          }
        );

        setGroups((prev) => prev.map((g) => (g.id === id ? updatedGroup : g)));
        setUserGroups((prev) =>
          prev.map((g) => (g.id === id ? updatedGroup : g))
        );

        if (currentGroup?.id === id) {
          setCurrentGroup(updatedGroup);
        }

        return updatedGroup;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update group");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentGroup?.id]
  );

  const deleteGroup = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchClient(`${endpoints.groups.delete}/${id}`, {
          method: "DELETE",
        });

        setGroups((prev) => prev.filter((g) => g.id !== id));
        setUserGroups((prev) => prev.filter((g) => g.id !== id));

        if (currentGroup?.id === id) {
          setCurrentGroup(null);
        }

        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete group");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentGroup?.id]
  );

  const joinGroup = useCallback(
    async (groupId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchClient(`${endpoints.groups.join}/${groupId}`, {
          method: "POST",
        });

        // Refresh user groups
        await fetchUserGroups();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to join group");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserGroups]
  );

  const leaveGroup = useCallback(
    async (groupId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchClient(`${endpoints.groups.leave}/${groupId}`, {
          method: "POST",
        });

        // Refresh user groups
        await fetchUserGroups();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to leave group");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserGroups]
  );

  const addMember = useCallback(
    async (
      groupId: string,
      userId: string,
      role: string = "member"
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchClient(`${endpoints.groups.addMember}/${groupId}`, {
          method: "POST",
          body: JSON.stringify({ userId, role }),
        });

        // Refresh group members if we're looking at this group
        if (currentGroup?.id === groupId) {
          await fetchGroupMembers(groupId);
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add member to group"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentGroup?.id, fetchGroupMembers]
  );

  const removeMember = useCallback(
    async (groupId: string, userId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchClient(
          `${endpoints.groups.removeMember}/${groupId}/${userId}`,
          {
            method: "DELETE",
          }
        );

        // Refresh group members if we're looking at this group
        if (currentGroup?.id === groupId) {
          await fetchGroupMembers(groupId);
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to remove member from group"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentGroup?.id, fetchGroupMembers]
  );

  const updateMemberRole = useCallback(
    async (groupId: string, userId: string, role: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchClient(
          `${endpoints.groups.updateMemberRole}/${groupId}/${userId}`,
          {
            method: "PUT",
            body: JSON.stringify({ role }),
          }
        );

        // Refresh group members if we're looking at this group
        if (currentGroup?.id === groupId) {
          await fetchGroupMembers(groupId);
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update member role"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentGroup?.id, fetchGroupMembers]
  );

  // Cleanup function
  useEffect(() => {
    return () => {
      setGroups([]);
      setUserGroups([]);
      setCurrentGroup(null);
      setGroupMembers([]);
      setIsLoading(false);
      setError(null);
    };
  }, []);

  return {
    groups,
    userGroups,
    currentGroup,
    groupMembers,
    isLoading,
    error,
    fetchGroups,
    fetchUserGroups,
    fetchGroupById,
    fetchGroupMembers,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    addMember,
    removeMember,
    updateMemberRole,
  };
}
