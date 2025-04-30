import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import {
  Bell,
  Briefcase,
  Users,
  Wrench,
  CheckCircle,
  Clock,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { NOTIFICATION_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredNotifications(notifications);
    } else if (activeFilter === 'unread') {
      setFilteredNotifications(notifications.filter(n => !n.read));
    } else {
      setFilteredNotifications(notifications.filter(n => n.type.includes(activeFilter)));
    }
  }, [activeFilter, notifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(NOTIFICATION_API_END_POINT, {
        withCredentials: true
      });

      if (response.data.success) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(NOTIFICATION_API_END_POINT, {
        withCredentials: true
      });

      if (response.data.success) {
        setNotifications(response.data.notifications);
        toast.success('Notifications refreshed');
      }
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      toast.error('Failed to refresh notifications');
    } finally {
      setRefreshing(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${NOTIFICATION_API_END_POINT}/${notificationId}/read`, {}, {
        withCredentials: true
      });

      // Update local state
      setNotifications(notifications.map(notification =>
        notification._id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${NOTIFICATION_API_END_POINT}/read-all`, {}, {
        withCredentials: true
      });

      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleNavigate = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification._id);
    }

    // Navigate based on notification type
    switch(notification.type) {
      case 'job_application':
      case 'job_status_update':
      case 'job_quota_filled':
        if (notification.relatedJobId) {
          navigate(`/description/${notification.relatedJobId._id}`);
        }
        break;
      case 'group_invitation':
        if (notification.relatedGroupId) {
          navigate(`/groups/${notification.relatedGroupId._id}`);
        }
        break;
      case 'tool_request':
        if (notification.relatedToolId) {
          navigate(`/tools`);
        }
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'job_application':
      case 'job_status_update':
      case 'job_quota_filled':
        return <Briefcase className="h-5 w-5" />;
      case 'group_invitation':
        return <Users className="h-5 w-5" />;
      case 'tool_request':
        return <Wrench className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationStatusIcon = (notification) => {
    if (notification.read) {
      return <EyeOff className="h-4 w-4 text-gray-400" />;
    }
    return <Clock className="h-4 w-4 text-blue-500" />;
  };

  // Get notification counts by type
  const getNotificationCounts = () => {
    const counts = {
      all: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      job: notifications.filter(n => n.type.includes('job')).length,
      group: notifications.filter(n => n.type.includes('group')).length,
      tool: notifications.filter(n => n.type.includes('tool')).length
    };
    return counts;
  };

  const counts = getNotificationCounts();

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto my-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Bell className="mr-2" /> Notifications
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshNotifications}
              disabled={refreshing}
              className="text-sm flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {notifications.some(n => !n.read) && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="text-sm flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveFilter}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all" className="flex items-center justify-center">
              All
              {counts.all > 0 && (
                <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center justify-center">
              Unread
              {counts.unread > 0 && (
                <Badge variant="secondary" className="ml-2">{counts.unread}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="job" className="flex items-center justify-center">
              Jobs
              {counts.job > 0 && (
                <Badge variant="secondary" className="ml-2">{counts.job}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center justify-center">
              Groups
              {counts.group > 0 && (
                <Badge variant="secondary" className="ml-2">{counts.group}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tool" className="flex items-center justify-center">
              Tools
              {counts.tool > 0 && (
                <Badge variant="secondary" className="ml-2">{counts.tool}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">
              {notifications.length === 0 ? 'No notifications yet' : 'No notifications match the selected filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => (
              <div
                key={notification._id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${!notification.read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => handleNavigate(notification)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`${!notification.read ? 'font-medium' : ''}`}>{notification.content}</p>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">New</Badge>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {getNotificationStatusIcon(notification)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
