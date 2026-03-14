import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  Bell,
  Calendar,
  CreditCard,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NotificationsScreen = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "notifications"),
        // where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const notificationsList = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          let userName = "Unknown User";

          if (data.userId) {
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const userData = userSnap.data();
              userName = userData.fullName || userData.name || "User";
            }
          }

          return {
            id: docSnap.id,
            ...data,
            userName,
          };
        }),
      );

      setNotifications(notificationsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  const markAsRead = async (notificationId) => {
    try {
      const notifRef = doc(db, "notifications", notificationId);
      await updateDoc(notifRef, {
        isRead: true,
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    console.log(notification);
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case "reschedule_request":
        navigate("/users", {
          state: { activeTab: "reschedule", notification },
        });
        break;
      case "cancel_request":
        navigate("/users", { state: { activeTab: "cancel", notification } });
        break;
      case "assessmentspurchased":
        navigate("/users", {
          state: { activeTab: "assessmentspurchased", notification },
        });
        break;
      case "booking":
        navigate("/users", { state: { activeTab: "booking", notification } });
        break;
      case "creditspurchased":
        navigate("/users", {
          state: { activeTab: "creditspurchased", notification },
        });
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "reschedule_request":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "cancel_request":
        return <X className="w-5 h-5 text-red-500" />;
      case "assessmentspurchased":
        return <FileText className="w-5 h-5 text-green-500" />;
      case "booking":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "payment_success":
        return <CreditCard className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    console.log(type);
    switch (type) {
      case "reschedule_request":
        return "bg-blue-50 border-blue-200";
      case "cancel_request":
        return "bg-red-50 border-red-200";
      case "assessmentspurchased":
        return "bg-green-50 border-green-200";
      case "booking":
        return "bg-yellow-50 border-yellow-200";
      case "creditspurchased":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const filteredNotifications =
    filter === "All"
      ? notifications
      : filter === "Unread"
        ? notifications.filter((n) => !n.isRead)
        : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary md:flex hidden" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Unread",
              "reschedule_request",
              "cancel_request",
              "assessmentspurchased",
              "booking",
              "creditspurchased",
            ].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === filterType
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterType === "reschedule_request"
                  ? "Reschedule"
                  : filterType === "cancel_request"
                    ? "Cancel"
                    : filterType === "assessmentspurchased"
                      ? "Assessments"
                      : filterType === "booking"
                        ? "Therapy Booking"
                        : filterType === "creditspurchased"
                          ? "Credits Purchased"
                          : filterType}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 mb-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                {filter === "Unread"
                  ? "You're all caught up!"
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={` bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead
                    ? getNotificationColor(notification.type)
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Type Badge */}
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              notification.type === "reschedule_request"
                                ? "bg-blue-100 text-blue-700"
                                : notification.type === "cancel_request"
                                  ? "bg-red-100 text-red-700"
                                  : notification.type === "assessmentspurchased"
                                    ? "bg-green-100 text-green-700"
                                    : notification.type === "booking"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : notification.type === "creditspurchased"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {notification.type === "reschedule_request"
                              ? "Reschedule Request"
                              : notification.type === "cancel_request"
                                ? "Cancel Request"
                                : notification.type === "assessmentspurchased"
                                  ? "Assessment Purchase"
                                  : notification.type === "booking"
                                    ? "Therapy Booking"
                                    : notification.type === "creditspurchased"
                                      ? "Credits Purchased"
                                      : notification.type}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="font-semibold">{notification.userName}</p>
                        {/* Message */}
                        <p className="text-sm text-gray-800 mb-2">
                          {notification.message}
                        </p>

                        {/* Credits Info */}
                        {notification.credits &&
                          notification.credits !== "N/A" && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <CreditCard className="w-3 h-3" />
                              <span>Credits: {notification.credits}</span>
                            </div>
                          )}
                      </div>

                      {/* Timestamp & Action Arrow */}
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(notification.createdAt)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
