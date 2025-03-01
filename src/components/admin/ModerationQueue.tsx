import React, { useState, useEffect } from "react";
import { Badge, Button, Card, Modal, Alert, Tabs } from "../ui/";
import { ModerationItem } from "@/types/admin";
import useAuth from "@/hooks/useAuth";
import { fetchClient } from "@/lib/api/fetchClient";
import { endpoints } from "@/lib/api/endpoints";
import LoadingSpinner from "../shared/LoadingSpinner";
import EmptyState from "../shared/EmptyState";

enum ModerationAction {
  APPROVE = "approve",
  REJECT = "reject",
  FLAG = "flag",
}

enum ModerationTab {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  FLAGGED = "flagged",
}

enum ContentType {
  POLL = "poll",
  OPINION = "opinion",
  COMMENT = "comment",
  FORUM = "forum",
  GROUP = "group",
}

interface ContentTypeFilter {
  [ContentType.POLL]: boolean;
  [ContentType.OPINION]: boolean;
  [ContentType.COMMENT]: boolean;
  [ContentType.FORUM]: boolean;
  [ContentType.GROUP]: boolean;
}

const ModerationQueue: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ModerationTab>(
    ModerationTab.PENDING
  );
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>(
    {
      [ContentType.POLL]: true,
      [ContentType.OPINION]: true,
      [ContentType.COMMENT]: true,
      [ContentType.FORUM]: true,
      [ContentType.GROUP]: true,
    }
  );

  useEffect(() => {
    if (!isAdmin) {
      setError("You don't have permission to access this page.");
      setIsLoading(false);
      return;
    }

    fetchModerationItems();
  }, [activeTab, contentTypeFilter]);

  const fetchModerationItems = async () => {
    setIsLoading(true);
    try {
      const enabledTypes = Object.entries(contentTypeFilter)
        .filter(([_, enabled]) => enabled)
        .map(([type]) => type);

      const response = await fetchClient(
        `${
          endpoints.admin.moderation
        }?status=${activeTab}&types=${enabledTypes.join(",")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch moderation items");
      }

      const data = await response.json();
      setItems(data.items);
      setError(null);
    } catch (err) {
      setError("Error loading moderation queue. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    item: ModerationItem,
    action: ModerationAction
  ) => {
    try {
      const response = await fetchClient(
        `${endpoints.admin.moderation}/${item.id}/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            reason: actionReason,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} item`);
      }

      // Remove the item from the current list
      setItems(items.filter((i) => i.id !== item.id));
      setIsModalOpen(false);
      setActionReason("");
    } catch (err) {
      setError(`Error performing action. Please try again.`);
      console.error(err);
    }
  };

  const openActionModal = (item: ModerationItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleTabChange = (tab: ModerationTab) => {
    setActiveTab(tab);
  };

  const toggleContentTypeFilter = (type: ContentType) => {
    setContentTypeFilter((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ModerationTab.PENDING:
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case ModerationTab.APPROVED:
        return <Badge className="bg-green-500">Approved</Badge>;
      case ModerationTab.REJECTED:
        return <Badge className="bg-red-500">Rejected</Badge>;
      case ModerationTab.FLAGGED:
        return <Badge className="bg-orange-500">Flagged</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  const getContentTypeBadge = (type: ContentType) => {
    switch (type) {
      case ContentType.POLL:
        return <Badge className="bg-blue-500">Poll</Badge>;
      case ContentType.OPINION:
        return <Badge className="bg-purple-500">Opinion</Badge>;
      case ContentType.COMMENT:
        return <Badge className="bg-cyan-500">Comment</Badge>;
      case ContentType.FORUM:
        return <Badge className="bg-indigo-500">Forum</Badge>;
      case ContentType.GROUP:
        return <Badge className="bg-pink-500">Group</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  if (error) {
    return <Alert variant="destructive">{error}</Alert>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Moderation Queue</h1>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Filter by content type:</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(ContentType).map((type) => (
            <Button
              key={type}
              variant={
                contentTypeFilter[type as ContentType] ? "default" : "outline"
              }
              size="sm"
              onClick={() => toggleContentTypeFilter(type as ContentType)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <Tabs>
        <Tabs.List>
          <Tabs.Trigger
            value={ModerationTab.PENDING}
            onClick={() => handleTabChange(ModerationTab.PENDING)}
            active={activeTab === ModerationTab.PENDING}
          >
            Pending
          </Tabs.Trigger>
          <Tabs.Trigger
            value={ModerationTab.APPROVED}
            onClick={() => handleTabChange(ModerationTab.APPROVED)}
            active={activeTab === ModerationTab.APPROVED}
          >
            Approved
          </Tabs.Trigger>
          <Tabs.Trigger
            value={ModerationTab.REJECTED}
            onClick={() => handleTabChange(ModerationTab.REJECTED)}
            active={activeTab === ModerationTab.REJECTED}
          >
            Rejected
          </Tabs.Trigger>
          <Tabs.Trigger
            value={ModerationTab.FLAGGED}
            onClick={() => handleTabChange(ModerationTab.FLAGGED)}
            active={activeTab === ModerationTab.FLAGGED}
          >
            Flagged
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No items to moderate"
          description={`There are currently no ${activeTab} items in the moderation queue.`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between mb-2">
                {getContentTypeBadge(item.contentType as ContentType)}
                {getStatusBadge(item.status)}
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                By: {item.authorName} •{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <div className="border rounded p-2 bg-gray-50 mb-3 max-h-32 overflow-y-auto">
                <p className="text-sm">{item.content}</p>
              </div>
              <div className="flex justify-end space-x-2">
                {activeTab === ModerationTab.PENDING && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openActionModal(item)}
                    >
                      Review
                    </Button>
                  </>
                )}
                {activeTab !== ModerationTab.PENDING && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openActionModal(item)}
                  >
                    Details
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Review Content"
        >
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              {getContentTypeBadge(selectedItem.contentType as ContentType)}
              {getStatusBadge(selectedItem.status)}
            </div>
            <h2 className="text-xl font-bold mb-1">{selectedItem.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              By: {selectedItem.authorName} •{" "}
              {new Date(selectedItem.createdAt).toLocaleDateString()}
            </p>
            <div className="border rounded p-3 bg-gray-50 mb-4 max-h-64 overflow-y-auto">
              <p>{selectedItem.content}</p>
            </div>

            {selectedItem.reasonForReview && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold">Reason for review:</h3>
                <p className="text-sm italic">{selectedItem.reasonForReview}</p>
              </div>
            )}

            {selectedItem.status !== ModerationTab.PENDING &&
              selectedItem.moderationReason && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold">Moderation note:</h3>
                  <p className="text-sm italic">
                    {selectedItem.moderationReason}
                  </p>
                </div>
              )}

            {activeTab === ModerationTab.PENDING && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Reason (optional):
                  </label>
                  <textarea
                    className="w-full border rounded p-2"
                    rows={3}
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Add a reason for this moderation action..."
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleAction(selectedItem, ModerationAction.REJECT)
                    }
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleAction(selectedItem, ModerationAction.FLAG)
                    }
                  >
                    Flag for Review
                  </Button>
                  <Button
                    variant="default"
                    onClick={() =>
                      handleAction(selectedItem, ModerationAction.APPROVE)
                    }
                  >
                    Approve
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ModerationQueue;
