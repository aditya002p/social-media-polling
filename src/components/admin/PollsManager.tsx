import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface Poll {
  id: string;
  title: string;
  status: "active" | "closed" | "draft" | "flagged";
  createdAt: string;
  responses: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const PollsManager: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // In a real application, you would fetch polls from your API here
    const fetchPolls = async () => {
      setIsLoading(true);
      try {
        // Simulated API call
        const mockPolls: Poll[] = [
          {
            id: "poll-1",
            title: "What is your favorite programming language?",
            status: "active",
            createdAt: "2024-02-15T12:00:00Z",
            responses: 143,
            author: {
              id: "user-1",
              name: "Jane Smith",
              avatar: "/avatars/jane.png",
            },
          },
          {
            id: "poll-2",
            title: "Should we switch to a 4-day work week?",
            status: "closed",
            createdAt: "2024-02-10T10:30:00Z",
            responses: 257,
            author: {
              id: "user-2",
              name: "John Doe",
              avatar: "/avatars/john.png",
            },
          },
          {
            id: "poll-3",
            title: "Is AI going to replace programmers?",
            status: "flagged",
            createdAt: "2024-02-08T15:45:00Z",
            responses: 89,
            author: {
              id: "user-3",
              name: "Alice Johnson",
              avatar: "/avatars/alice.png",
            },
          },
        ];

        setPolls(mockPolls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const filteredPolls = polls.filter((poll) => {
    const matchesSearch = poll.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus ? poll.status === filterStatus : true;
    return matchesSearch && matchesFilter;
  });

  const handleDeletePoll = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this poll? This action cannot be undone."
      )
    ) {
      // In a real application, you would call your API to delete the poll
      setPolls(polls.filter((poll) => poll.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatusBadge = ({ status }: { status: Poll["status"] }) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
      draft: "bg-blue-100 text-blue-800",
      flagged: "bg-red-100 text-red-800",
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
        <h2 className="text-2xl font-bold text-gray-800">Polls Management</h2>
        <button
          onClick={() => router.push("/admin/polls-management/create")}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          Create New Poll
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filterStatus || ""}
            onChange={(e) => setFilterStatus(e.target.value || null)}
            className="border rounded-md focus:outline-none focus:ring-2 focus:ring-primary p-2"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No polls found matching your criteria
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolls.map((poll) => (
                <tr key={poll.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {poll.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={poll.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(poll.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {poll.responses}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={poll.author.avatar || "/avatars/placeholder.png"}
                          alt={poll.author.name}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {poll.author.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/polls-management/${poll.id}`)
                        }
                        className="text-gray-500 hover:text-gray-700"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin/polls-management/${poll.id}/edit`)
                        }
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePoll(poll.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
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
export default PollsManager;
