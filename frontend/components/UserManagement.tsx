import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Search, BarChart3, Shield, Ban, CheckCircle, Eye, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role: 'user' | 'moderator' | 'admin' | 'student';
  is_active: boolean;
  created_at: string;
  last_login?: string;
  lessons_completed: number;
  study_streak: number;
  avg_score: number;
}

interface UserManagementProps {
  currentUser: { username: string; email?: string; role?: string };
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

export function UserManagement({ currentUser }: UserManagementProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication required");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success && result.data) {
        // Map backend fields to frontend format
        const mappedUsers = result.data.map((u: any) => ({
          ...u,
          role: u.role === 'student' ? 'user' : u.role,
          lessons_completed: u.lessons_completed || 0,
          study_streak: u.study_streak || 0,
          avg_score: Math.round(u.avg_score || 0),
        }));
        setUsers(mappedUsers);
      } else {
        toast.error(result.error || "Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.is_active) ||
                         (statusFilter === "inactive" && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Toggle user status via API
  const toggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE}/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !user.is_active }),
      });

      const result = await response.json();
      if (result.success) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, is_active: !u.is_active } : u
        ));
        toast.success(
          !user.is_active
            ? t('admin.users.activated', { username: user.username })
            : t('admin.users.deactivated', { username: user.username })
        );
      } else {
        toast.error(result.error || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Change user role via API
  const changeUserRole = async (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
    if (currentUser.role !== 'admin') {
      toast.error(t('admin.users.onlyAdminCanChangeRoles'));
      return;
    }

    try {
      const token = getAuthToken();
      // Map frontend "user" role to backend "student" role
      const backendRole = newRole === 'user' ? 'student' : newRole;
      
      const response = await fetch(`${API_BASE}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ role: backendRole }),
      });

      const result = await response.json();
      if (result.success) {
        const user = users.find(u => u.id === userId);
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ));
        toast.success(t('admin.users.roleChanged', { username: user?.username, role: t(`admin.roles.${newRole}`) }));
        setShowRoleDialog(false);
      } else {
        toast.error(result.error || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-300';
      case 'moderator': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6 border-2 border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('admin.users.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder={t('admin.users.filterByRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.users.allRoles')}</SelectItem>
              <SelectItem value="user">{t('admin.roles.user')}</SelectItem>
              <SelectItem value="moderator">{t('admin.roles.moderator')}</SelectItem>
              <SelectItem value="admin">{t('admin.roles.admin')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder={t('admin.users.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.users.allStatuses')}</SelectItem>
              <SelectItem value="active">{t('admin.users.active')}</SelectItem>
              <SelectItem value="inactive">{t('admin.users.inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* User Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-2 border-[#225d9c]">
          <div className="text-sm text-gray-600 mb-1">{t('admin.users.totalUsers')}</div>
          <div className="text-3xl">{users.length}</div>
        </Card>
        <Card className="p-6 border-2 border-green-500">
          <div className="text-sm text-gray-600 mb-1">{t('admin.users.activeUsers')}</div>
          <div className="text-3xl text-green-600">{users.filter(u => u.is_active).length}</div>
        </Card>
        <Card className="p-6 border-2 border-purple-500">
          <div className="text-sm text-gray-600 mb-1">{t('admin.users.moderators')}</div>
          <div className="text-3xl text-purple-600">{users.filter(u => u.role === 'moderator').length}</div>
        </Card>
        <Card className="p-6 border-2 border-red-500">
          <div className="text-sm text-gray-600 mb-1">{t('admin.users.admins')}</div>
          <div className="text-3xl text-red-600">{users.filter(u => u.role === 'admin').length}</div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-2 border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#225d9c]" />
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.username')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.email')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.role')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.progress')}
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">
                  {t('admin.users.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#225d9c] text-white flex items-center justify-center mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-900">{user.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`border ${getRoleBadgeColor(user.role)}`}>
                      {t(`admin.roles.${user.role}`)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={`border ${getStatusBadgeColor(user.is_active)}`}>
                      {t(`admin.users.${user.is_active ? 'active' : 'inactive'}`)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.lessons_completed} {t('admin.users.lessons')} • {user.study_streak} {t('admin.users.dayStreak')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowStatsDialog(true);
                        }}
                        className="border-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowRoleDialog(true);
                        }}
                        disabled={currentUser.role !== 'admin'}
                        className="border-2"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                        className="border-2"
                      >
                        {user.is_active ? (
                          <Ban className="w-4 h-4 text-red-600" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>

      {/* User Statistics Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="border-2 border-[#225d9c]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#225d9c]" />
              {t('admin.users.learningStats')}: {selectedUser?.username}
            </DialogTitle>
            <DialogDescription>
              {t('admin.users.statsDescription')}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{t('admin.users.lessonsCompleted')}</div>
                  <div className="text-2xl">{selectedUser.lessons_completed}</div>
                </Card>
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{t('admin.users.studyStreak')}</div>
                  <div className="text-2xl">{selectedUser.study_streak} {t('admin.users.days')}</div>
                </Card>
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{t('admin.users.avgScore')}</div>
                  <div className="text-2xl">{selectedUser.avg_score}%</div>
                </Card>
                <Card className="p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">{t('admin.users.joinDate')}</div>
                  <div className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="border-2 border-[#225d9c]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#225d9c]" />
              {t('admin.users.changeRole')}: {selectedUser?.username}
            </DialogTitle>
            <DialogDescription>
              {t('admin.users.changeRoleDescription')}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {t('admin.users.currentRole')}: <Badge className={`border ${getRoleBadgeColor(selectedUser.role)}`}>
                  {t(`admin.roles.${selectedUser.role}`)}
                </Badge>
              </div>
              <Select
                defaultValue={selectedUser.role}
                onValueChange={(value: 'user' | 'moderator' | 'admin') => {
                  changeUserRole(selectedUser.id, value);
                }}
              >
                <SelectTrigger className="border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{t('admin.roles.user')}</SelectItem>
                  <SelectItem value="moderator">{t('admin.roles.moderator')}</SelectItem>
                  <SelectItem value="admin">{t('admin.roles.admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)} className="border-2">
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
