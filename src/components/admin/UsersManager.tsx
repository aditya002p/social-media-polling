import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Lock,
  Unlock,
  Shield,
  User,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "suspended" | "banned";
  joinedAt: string;
  lastActive: string;
  avatar?: string;
}

const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch users from your API here
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Simulated API call
        const mockUsers: UserData[] = [
          {
            id: "user-1",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "admin",
            status: "active",
            joinedAt: "2023-09-15T12:00:00Z",
            lastActive: "2024-02-15T14:32:00Z",
            avatar: "/avatars/jane.png",
          },
          {
            id: "user-2",
            name: "John Doe",
            email: "john@example.com",
            role: "moderator",
            status: "active",
            joinedAt: "2023-10-21T08:45:00Z",
            lastActive: "2024-02-14T09:17:00Z",
            avatar: "/avatars/john.png",
          },
          {
            id: "user-3",
            name: "Alice Johnson",
            email: "alice@example.com",
            role: "user",
            status: "suspended",
            joinedAt: "2023-11-03T11:20:00Z",
            lastActive: "2024-01-28T16:05:00Z",
            avatar: "/avatars/alice.png",
          },
          {
            id: "user-4",
            name: "Bob Williams",
            email: "bob@example.com",
            role: "user",
            status: "banned",
            joinedAt: "2023-12-14T15:10:00Z",
            lastActive: "2024-01-15T10:45:00Z",
            avatar: "/avatars/bob.png",
          },
        ];

        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoleFilter = filterRole ? user.role === filterRole : true;
    const matchesStatusFilter = filterStatus
      ? user.status === filterStatus
      : true;
    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  });

  const handleDeleteUser = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      // In a real application, you would call your API to delete the user
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleToggleUserStatus = async (id: string, currentStatus: string) => {
    // In a real application, you would call your API to update the user status
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, status: newStatus as UserData["status"] }
          : user
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const RoleBadge = ({ role }: { role: UserData["role"] }) => {
    const roleStyles = {
      admin: "bg-purple-100 text-purple-800",
      moderator: "bg-blue-100 text-blue-800",
      user: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyles[role]}`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: UserData["status"] }) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      suspended: "bg-yellow-100 text-yellow-800",
      banned: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filterRole || ""}
              onChange={(e) => setFilterRole(e.target.value || null)}
              className="border rounded-md focus:outline-none focus:ring-2 focus:ring-primary p-2"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>
          </div>

          <select
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="border rounded-md focus:outline-none focus:ring-2 focus:ring-primary p-2"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No users found matching your criteria
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar || "/avatars/placeholder.png"}
                          alt={user.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.joinedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastActive)} at{" "}
                    {formatTime(user.lastActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          handleToggleUserStatus(user.id, user.status)
                        }
                        className={
                          user.status === "active"
                            ? "text-yellow-500 hover:text-yellow-700"
                            : "text-green-500 hover:text-green-700"
                        }
                        title={
                          user.status === "active"
                            ? "Suspend User"
                            : "Activate User"
                        }
                      >
                        {user.status === "active" ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <Unlock className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        className="text-purple-500 hover:text-purple-700"
                        title="Edit User Role"
                      >
                        <Shield className="h-5 w-5" />
                      </button>
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit User Details"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete User"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default UsersManager;
